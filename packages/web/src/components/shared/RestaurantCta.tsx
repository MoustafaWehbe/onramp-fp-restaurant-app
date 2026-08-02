import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function RestaurantCta() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div
        className="
          rounded-3xl
          border
          border-primary/20
          bg-primary/5
          px-8
          py-14
          text-center
          sm:px-12
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-foreground
            sm:text-4xl
          "
        >
          Ready to discover your next favorite restaurant?
        </h2>


        <p
          className="
            mx-auto
            mt-4
            max-w-2xl
            text-muted-foreground
          "
        >
          Explore restaurants, discover new flavors, and let Platera help you
          find the perfect dining experience.
        </p>


        <Button
          size="lg"
          onClick={() => navigate("/restaurants")}
          className="
            mt-8
            shadow-md
          "
        >
          Explore Restaurants
        </Button>

      </div>

    </section>
  );
}