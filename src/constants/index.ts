import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";

export const PRODUCT_CATEGORIES = [
  {
    label: "UI Kits",
    value: "UI_KITS" as const,
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
    value: "ICONS" as const,
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

export const PRODUCT_CATEGORIES_LABEL = {
  UI_KITS: "UI Kits",
  ICONS: "Icons",
};

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

// 5MB per file is allowed
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const MAX_FILE_UPLOAD_LIMIT = 5;
export const ACCEPTED_FILE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
  "image/x-icon",
];

export const MAX_IMAGE_SIZE = 1024 * 1024 * 5;
export const MAX_IMAGE_UPLOAD_LIMIT = 1024 * 1024 * 5;

export const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"];

export const DEFAULT_PRODUCT_REEL_LIMIT = 5;

export const PRODUCT_PAGE_BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

export const TRANSACTION_FEE = 80;
