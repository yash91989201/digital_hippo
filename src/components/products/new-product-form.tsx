"use client";
import { toast } from "sonner";
import { generateId } from "lucia";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// CUSTOM HOOKS
import useCurrentUser from "@/hooks/use-current-user";
// UTILS
import { api } from "@/trpc/react";
import { fieldActionToast } from "@/lib/utils";
// SCHEMAS
import { CreateProductSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { CreateProductType } from "@/lib/schema";
// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// CUSTOM COMPONENTS
import ProductFileField from "@/components/products/product-files-field";
import ProductImagesField from "@/components/products/product-images-field";
// ICONS
import { Loader2 } from "lucide-react";

export default function NewProductForm() {
  const { id: userId = "" } = useCurrentUser() ?? {};

  const { mutateAsync: createProductMutationAsync } =
    api.product.createProduct.useMutation();

  const newProductForm = useForm<CreateProductType>({
    defaultValues: {
      id: generateId(15),
      createdAt: new Date(),
      name: "",
      description: "",
      price: 100,
      productFiles: [],
      productImages: [],
      saleStatus: "PENDING",
      approvedForSale: false,
      userId,
      priceId: "",
      stripeId: "",
    },
    resolver: zodResolver(CreateProductSchema),
  });

  const { formState, control, handleSubmit } = newProductForm;

  const createProductAction: SubmitHandler<CreateProductType> = async (
    formData,
  ) => {
    const mutationResponse = await createProductMutationAsync(formData);
    switch (mutationResponse.status) {
      case "INITIAL": {
        toast.error("Unknown error occoured please try again.");
        break;
      }
      case "FAILED": {
        toast.error(mutationResponse.message);
        break;
      }
      case "SUCCESS": {
        toast.success(mutationResponse.message);
        fieldActionToast(mutationResponse.fields?.productFiles?.insert);
        fieldActionToast(mutationResponse.fields?.productImages?.insert);
      }
    }
  };

  return (
    <Form {...newProductForm}>
      <form
        className="my-3 flex flex-col gap-3"
        onSubmit={handleSubmit(createProductAction)}
      >
        <h3 className="text-2xl font-semibold">Create new product</h3>
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product name" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Textarea
                    {...field}
                    className="resize-none"
                    placeholder="Describe your product."
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="price"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Pricing (in Rs.)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter product price"
                  className="[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(event) => {
                    const regex = /^\d+$/;
                    if (regex.test(event.target.value)) {
                      field.onChange(Number(event.target.value));
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UI_KITS">UI Kits</SelectItem>
                  <SelectItem value="ICONS">Icons</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <ProductFileField />
        <ProductImagesField />

        <Button className="flex items-center justify-center gap-3 self-start">
          <span>
            {formState.isSubmitting ? "Creating Product" : "Create Product"}
          </span>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
