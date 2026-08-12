import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OwnerCta() {
  return (
    <section className="w-full px-6 pb-20">
      <div
        className="
          flex
          w-full
          flex-col
          gap-8
          rounded-3xl
          border
          border-border
          bg-card
          p-8
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-12
        "
      >
        <div className="flex items-start gap-5">
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
            "
          >
            <Store className="h-7 w-7 text-primary" />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-foreground
                sm:text-3xl
              "
            >
              Showcase your restaurant on Platera
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-muted-foreground
              "
            >
              Connect with food lovers, highlight your menu, and help diners
              discover your restaurant.
            </p>
          </div>
        </div>

        <Button asChild size="lg">
          <Link to="/claim-restaurant">
            Join Platera
          </Link>
        </Button>
      </div>
    </section>
  );
}