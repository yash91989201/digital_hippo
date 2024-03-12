"use client";
import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { CreateProductType } from "@/lib/schema";
// UI
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// CUSTOM COMPONENTS
import NewFilesForm from "@/components/shared/new-files-form";

export default function ProductFilesField() {
  const { data: userFiles = [] } = api.media.getUserFiles.useQuery();
  const { control } = useFormContext<CreateProductType>();

  const { append } = useFieldArray({
    name: "productFiles",
    control,
  });

  return (
    <FormField
      control={control}
      name="productFiles"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product File</FormLabel>
          <Select
            onValueChange={(value) => {
              const selectedFile = userFiles.find((file) => file.id === value)!;
              append(selectedFile);
              field.onChange([selectedFile]);
            }}
          >
            <FormControl>
              <div className="flex gap-3">
                <SelectTrigger className="h-14">
                  <SelectValue placeholder="Select file(s) for new product" />
                </SelectTrigger>
                <NewFilesForm />
              </div>
            </FormControl>
            <SelectContent>
              {userFiles.length > 0 ? (
                userFiles.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden">
                        <Image
                          src={file.url}
                          alt="product file"
                          fill
                          sizes="24vw"
                        />
                      </div>
                      <p>{file.name}</p>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <p className="p-3 text-muted-foreground">
                  No file(s) available.
                </p>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
