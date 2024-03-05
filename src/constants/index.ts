import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";

export const PRODUCT_CATEGORIES = [
  {
    label: "UI Kits",
    value: "ui_kits" as const,
    featured: [
      {
        name: "Editor picks",
        href: "#",
        imgSrc: "/nav/ui-kits/mixed.jpg",
      },
      {
        name: "New Arrivals",
        href: "#",
        imgSrc: "/nav/ui-kits/blue.jpg",
      },
      {
        name: "Bestsellers",
        href: "#",
        imgSrc: "/nav/ui-kits/purple.jpg",
      },
    ],
  },
  {
    label: "Icons",
    value: "icons" as const,
    featured: [
      {
        name: "Favorite Icon Picks",
        href: "#",
        imgSrc: "/nav/icons/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "#",
        imgSrc: "/nav/icons/new.jpg",
      },
      {
        name: "Bestselling Icons",
        href: "#",
        imgSrc: "/nav/icons/bestsellers.jpg",
      },
    ],
  },
];

export const PERKS = [
  {
    name: "Instant Delivery",
    description:
      "Get your assets to your email in seconds and download them right away",
    Icon: ArrowDownToLine,
  },
  {
    name: "Guaranteed Quality",
    description:
      "Every asset on our platform is verified by our team to ensure our highest quality standards.",
    Icon: CheckCircle,
  },
  {
    name: "For the planet",
    description:
      "We've pleged 1% of sales to preservation and restoration of the natural environment.",
    Icon: Leaf,
  },
];
