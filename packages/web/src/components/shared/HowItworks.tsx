import { HOW_IT_WORKS_STEPS } from "@/data/mockRestaurants";
import type { HowItWorksStep } from "@/types/restaurant";
import { Search, UtensilsCrossed, Star, Sparkles } from "lucide-react";

const ICONS: Record<HowItWorksStep["icon"], typeof Search> = {
  search: Search,
  utensils: UtensilsCrossed,
  review: Star,
  ai: Sparkles,
};

export function HowItWorks() {
  return (
    <section className="w-full px-8 py-16">
      <h2 className="mb-10 text-3xl font-bold text-foreground sm:text-4xl">
        Find your perfect restaurant in three steps
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((item) => {
          const Icon = ICONS[item.icon];

          return (
            <div
              key={item.id}
              className="
                rounded-2xl
                border border-border
                bg-card
                p-8
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-primary/40
                hover:shadow-lg
              "
            >
              <div
                className="
                  mb-5
                  flex h-14 w-14
                  items-center justify-center
                  rounded-xl
                  bg-primary/10
                "
              >
                <Icon className="h-7 w-7 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Step {item.step}
              </p>

              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-3 text-base text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}