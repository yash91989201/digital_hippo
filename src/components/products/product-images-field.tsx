"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { CreateProductType, ImageType } from "@/lib/schema";
// UI
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// CUSTOM COMPONENTS

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import NewImagesForm from "@/components/shared/new-images-form";

export default function ProductImagesField() {
  const { data: userImages = [], isLoading } =
    api.media.getUserImages.useQuery();

  const { control } = useFormContext<CreateProductType>();
  const [open, setOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({
    name: "productImages",
    control,
    keyName: "imagesId",
  });

  const handleUnselect = (index: number) => {
    remove(index);
  };

  const isImageSelected = (image: ImageType) => {
    return fields.map((field) => field.id).includes(image.id);
  };

  const handleAddItem = (image: ImageType) => {
    const imageAdded = fields.find((field) => field.id === image.id);
    if (!imageAdded) {
      append(image);
    } else {
      const imageIndex = fields.map((field) => field.id).indexOf(image.id);
      remove(imageIndex);
    }
  };

  return (
    <FormField
      control={control}
      name="productImages"
      render={() => (
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-3">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  aria-expanded={open}
                  className={`w-full justify-between ${fields.length > 0 ? "h-full" : "h-10"}`}
                  onClick={() => setOpen(!open)}
                >
                  <div className="flex flex-wrap gap-1">
                    {fields.length > 0 ? (
                      fields.map((field, index) => (
                        <Badge
                          variant="outline"
                          key={index}
                          className="mb-1 mr-1 flex items-center justify-start gap-3 rounded-md bg-white p-2"
                          onClick={() => handleUnselect(index)}
                        >
                          <div className="relative size-12 overflow-hidden rounded-full border">
                            <Image src={field.url} alt={field.name} fill />
                          </div>
                          <span>{field.name}</span>

                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUnselect(index);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => handleUnselect(index)}
                          >
                            <X className="size-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <p>Select Images for product</p>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <NewImagesForm />
            </div>
            <PopoverContent className="w-[640px] p-0" align="start">
              <Command>
                <CommandList>
                  {isLoading ? (
                    <CommandLoading className="py-6 text-center text-sm text-muted-foreground">
                      Loading Available Images...
                    </CommandLoading>
                  ) : (
                    <CommandEmpty>No item found.</CommandEmpty>
                  )}
                  <CommandGroup className="max-h-64 overflow-auto">
                    {userImages.map((image) => (
                      <CommandItem
                        key={image.id}
                        className="flex items-center justify-start gap-3"
                        onSelect={() => {
                          handleAddItem(image);
                          setOpen(true);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isImageSelected(image)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="relative h-14 w-14">
                          <Image src={image.url} alt={image.name} fill />
                        </div>
                        <span>{image.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
