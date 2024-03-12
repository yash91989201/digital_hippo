"use client";
import { useState } from "react";
import { generateId } from "lucia";
import { toast } from "sonner";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
import { useEdgeStore } from "@/lib/edgestore";
import useCurrentUser from "@/hooks/use-current-user";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { FileState } from "@/components/shared/multi-file-dropzone";
// UI
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// CUSTOM COMPONENTS
import { MultiFileDropzone } from "@/components/shared/multi-file-dropzone";
// ICONS
import { Loader2, Plus } from "lucide-react";
// CONSTANTS
import { MAX_FILE_SIZE, MAX_FILE_UPLOAD_LIMIT } from "@/constants";

type FileUploadResponseType = {
  id: string;
  url: string;
  size: number;
  name: string;
  userId: string;
}[];

export default function NewFilesForm() {
  const newFileFormSidebar = useToggle(false);
  const { id: userId = "" } = useCurrentUser() ?? {};

  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const { edgestore } = useEdgeStore();
  const apiUtils = api.useUtils();

  const { mutateAsync: addNewFilesMutationAsync, isLoading } =
    api.media.addNewFiles.useMutation({
      onSuccess: async () => {
        await apiUtils.media.getUserFiles.invalidate();
      },
    });

  const toggleSidebarState = () => {
    if (newFileFormSidebar.isOpen) {
      newFileFormSidebar.close();
      setFileStates([]);
    }
    if (newFileFormSidebar.isClosed) {
      newFileFormSidebar.open();
    }
  };

  const updateFileUploadProgress = (
    key: string,
    progress: FileState["progress"],
  ) => {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  };

  const uploadAllFiles = async () => {
    const uploadedFilesData: FileUploadResponseType = [];
    await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;

          const fileUploadRes = await edgestore.productFiles.upload({
            file: fileState.file,
            onProgressChange: (progress) => {
              updateFileUploadProgress(fileState.key, progress);
              if (progress === 100) {
                updateFileUploadProgress(fileState.key, "COMPLETE");
              }
            },
          });

          uploadedFilesData.push({
            id: generateId(15),
            url: fileUploadRes.url,
            name: fileState.file.name,
            size: fileUploadRes.size,
            userId,
          });
        } catch (err) {
          updateFileUploadProgress(fileState.key, "ERROR");
        }
      }),
    );
    const actionResponse = await addNewFilesMutationAsync({
      files: uploadedFilesData,
    });
    toast.success(actionResponse.message);
  };

  return (
    <Sheet onOpenChange={toggleSidebarState}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-4/5 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add File(s).</SheetTitle>
          <SheetDescription>Add Files to your account.</SheetDescription>
        </SheetHeader>
        <div className="my-6 flex flex-col gap-3">
          <MultiFileDropzone
            value={fileStates}
            dropzoneOptions={{
              maxFiles: MAX_FILE_UPLOAD_LIMIT,
              maxSize: MAX_FILE_SIZE,
            }}
            onChange={setFileStates}
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles]);
            }}
          />
        </div>
        <SheetFooter className="mt-2 flex items-center gap-3">
          <Button
            className="flex items-center justify-center gap-3"
            onClick={uploadAllFiles}
            disabled={
              !fileStates.filter(
                (fileState) => fileState.progress === "PENDING",
              ).length
            }
          >
            <span>{isLoading ? "Uploading" : "Upload"}</span>
            {isLoading && <Loader2 className="animate-spin" />}
          </Button>
          <SheetClose>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
