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
import type { ImageType } from "@/lib/schema";
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
import { MAX_IMAGE_SIZE, MAX_IMAGE_UPLOAD_LIMIT } from "@/constants";

export default function NewImagesForm() {
  const newFileFormSidebar = useToggle(false);
  const { id: userId = "" } = useCurrentUser() ?? {};

  const [imageStates, setImageStates] = useState<FileState[]>([]);

  const { edgestore } = useEdgeStore();
  const apiUtils = api.useUtils();

  const { mutateAsync: addNewImagesMutationAsync, isLoading } =
    api.media.addNewImages.useMutation({
      onSuccess: async () => {
        await apiUtils.media.getUserImages.invalidate();
      },
    });

  const toggleSidebarState = () => {
    if (newFileFormSidebar.isOpen) {
      newFileFormSidebar.close();
      setImageStates([]);
    }
    if (newFileFormSidebar.isClosed) {
      newFileFormSidebar.open();
    }
  };

  const updateFileUploadProgress = (
    key: string,
    progress: FileState["progress"],
  ) => {
    setImageStates((imageStates) => {
      const newFileStates = structuredClone(imageStates);
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
    const uploadedImagesData: ImageType[] = [];
    await Promise.all(
      imageStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;

          const fileUploadRes = await edgestore.productImages.upload({
            file: fileState.file,
            onProgressChange: (progress) => {
              updateFileUploadProgress(fileState.key, progress);
              if (progress === 100) {
                updateFileUploadProgress(fileState.key, "COMPLETE");
              }
            },
          });

          uploadedImagesData.push({
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
    const actionResponse = await addNewImagesMutationAsync({
      images: uploadedImagesData,
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
          <SheetTitle>Add Image(s).</SheetTitle>
          <SheetDescription>Add Images to your account.</SheetDescription>
        </SheetHeader>
        <div className="my-6 flex flex-col gap-3">
          <MultiFileDropzone
            value={imageStates}
            dropzoneOptions={{
              maxSize: MAX_IMAGE_SIZE,
              maxFiles: MAX_IMAGE_UPLOAD_LIMIT,
            }}
            onChange={setImageStates}
            onFilesAdded={async (addedFiles) => {
              setImageStates([...imageStates, ...addedFiles]);
            }}
          />
        </div>
        <SheetFooter className="mt-2 flex items-center gap-3">
          <Button
            className="flex items-center justify-center gap-3"
            onClick={uploadAllFiles}
            disabled={
              !imageStates.filter(
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
