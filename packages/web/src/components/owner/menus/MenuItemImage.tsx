import { ImageOff } from "lucide-react";

interface MenuItemImageProps {
  src?: string | null;
  alt: string;
}

export function MenuItemImage({ src, alt }: MenuItemImageProps) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-[#FCFAF7]">
        <ImageOff className="h-6 w-6 text-[#D6D3D1]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] overflow-hidden bg-[#FCFAF7]">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
