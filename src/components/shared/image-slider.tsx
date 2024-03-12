"use client";
import Image from "next/image";
// UTILS
import { cn } from "@/lib/utils";
// UI
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ImageSlider({
  imageUrls,
  className,
}: {
  imageUrls: string[];
  className: string;
}) {
  return (
    <Carousel className="group">
      <CarouselContent>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <div className={cn("relative overflow-clip rounded-md", className)}>
              <Image src={imageUrl} alt="product preview" fill />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {imageUrls.length > 1 && (
        <CarouselPrevious className="left-3 hidden items-center justify-center group-hover:flex" />
      )}
      {imageUrls.length > 1 && (
        <CarouselNext className="right-3 hidden items-center justify-center group-hover:flex" />
      )}
    </Carousel>
  );
}
