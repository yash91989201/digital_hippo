"use client";
import { useEffect, useRef, useState } from "react";
// CUSTOM HOOKS
import useOnClickOutside from "@/hooks/use-on-click-outside";
// CUSTOM COMPONENTS
import NavItem from "@/components/navbar/nav-item";
// CONSTANTS
import { PRODUCT_CATEGORIES } from "@/constants";

export default function NavItems() {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const isAnyOpen = activeIndex !== null;

  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className="flex h-full gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };

        const close = () => setActiveIndex(null);
        const isOpen = index === activeIndex;

        return (
          <NavItem
            key={index}
            isOpen={isOpen}
            category={category}
            isAnyOpen={isAnyOpen}
            close={close}
            handleOpen={handleOpen}
          />
        );
      })}
    </div>
  );
}
