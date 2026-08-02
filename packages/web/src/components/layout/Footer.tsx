import { Link } from "react-router-dom";
import { UtensilsCrossed, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1400px] px-8 py-16">

        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/home"
              className="flex items-center gap-3"
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-xl
                  bg-primary/10
                "
              >
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>

              <span className="text-3xl font-bold tracking-tight text-primary">
                Platera
              </span>
            </Link>

            <p
              className="
                mt-5 max-w-md
                text-base leading-relaxed
                text-foreground/60
              "
            >
              Discover exceptional restaurants, explore unique dining
              experiences, and let AI help you find the perfect place
              for every occasion.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon) => (
                <button
                  key={Icon.name}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    border border-foreground/10
                    text-foreground/60
                    transition-all
                    hover:border-primary
                    hover:text-primary
                    hover:bg-primary/5
                  "
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>


          {/* Explore */}
          <div>
            <h3
              className="
                text-sm font-semibold
                uppercase tracking-wider
                text-foreground
              "
            >
              Explore
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-foreground/60">
              <li>
                <Link
                  to="/restaurants"
                  className="transition hover:text-primary"
                >
                  Restaurants
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="transition hover:text-primary"
                >
                  AI Restaurant Search
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="transition hover:text-primary"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>


          {/* Restaurant owners */}
          <div>
            <h3
              className="
                text-sm font-semibold
                uppercase tracking-wider
                text-foreground
              "
            >
              For Restaurants
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-foreground/60">
              <li>
                <Link
                  to="/owner/dashboard"
                  className="transition hover:text-primary"
                >
                  Manage your restaurant
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-primary"
                >
                  Join Platera
                </Link>
              </li>
            </ul>
          </div>

        </div>


        {/* Divider */}
        <div className="my-10 border-t border-foreground/10" />


        {/* Bottom */}
        <div
          className="
            flex flex-col gap-4
            text-sm text-foreground/60
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {new Date().getFullYear()} Platera. Crafted for food lovers.
          </p>

          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="transition hover:text-primary"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-primary"
            >
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}