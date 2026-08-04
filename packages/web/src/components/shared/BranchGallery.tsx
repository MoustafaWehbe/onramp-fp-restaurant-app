import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BranchImage {
  url: string;
  type: string;
}

interface BranchGalleryProps {
  images: BranchImage[];
}

const BranchGallery = ({ images }: BranchGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Card className="flex h-96 w-full items-center justify-center">
        <p className="text-muted-foreground">
          No images available
        </p>
      </Card>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <img
        src={images[currentIndex].url}
        alt={`Branch image ${currentIndex + 1}`}
        className="h-[60vh] min-h-[500px] w-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchGallery;