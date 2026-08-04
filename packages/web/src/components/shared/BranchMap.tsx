import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface BranchMapProps {
  latitude: number;
  longitude: number;
}

const BranchMap = ({ latitude, longitude }: BranchMapProps) => {
  return (
    <Card className="mx-auto w-full max-w-5xl overflow-hidden">
      <div className="flex h-80 flex-col items-center justify-center gap-4 bg-muted">
        <MapPin size={40} className="text-primary" />

        <h3 className="text-xl font-semibold">
          Location Map
        </h3>

        <p className="text-sm text-muted-foreground">
          Map integration coming soon
        </p>

        <div className="rounded-lg bg-background px-4 py-2 text-sm">
          Coordinates:
          <br />
          {latitude}, {longitude}
        </div>
      </div>
    </Card>
  );
};

export default BranchMap;