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
import NewImagesForm from "@/components/shared/new-images-form";

export default function ProductImagesField() {
  const { data: userImages = [] } = api.media.getUserImages.useQuery();
  const { control } = useFormContext<CreateProductType>();

  const { append } = useFieldArray({
    name: "productImages",
    control,
  });

  return (
    <FormField
      control={control}
      name="productImages"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <Select
            onValueChange={(value) => {
              const selectedFile = userImages.find(
                (file) => file.id === value,
              )!;
              append(selectedFile);
              field.onChange([selectedFile]);
            }}
          >
            <FormControl>
              <div className="flex gap-3">
                <SelectTrigger className="h-14">
                  <SelectValue placeholder="Select image for new product" />
                </SelectTrigger>
                <NewImagesForm />
              </div>
            </FormControl>
            <SelectContent>
              {userImages.length > 0 ? (
                userImages.map((image) => (
                  <SelectItem key={image.id} value={image.id}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden">
                        <Image
                          src={image.url}
                          alt="product image"
                          fill
                          sizes="24vw"
                        />
                      </div>
                      <p>{image.name}</p>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <p className="p-3 text-muted-foreground">
                  No image(s) available.
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
