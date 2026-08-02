import {
  UtensilsCrossed,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
export function Footer() {
  const socialIcons = [
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
  ];

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1400px] px-8 py-16">
        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center gap-3">
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
              {socialIcons.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
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

          {/* ...rest of your Footer remains unchanged... */}
        </div>
      </div>
    </footer>
  );
}