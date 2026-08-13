import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Search,
  Sparkles,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { apiClient } from "@/lib/api-client";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

type ClaimType = "existing" | "new";

export default function RestaurantClaimPage() {
  const navigate = useNavigate();

  const [claimType, setClaimType] =
    useState<ClaimType>("existing");

  const [restaurantName, setRestaurantName] = useState("");
  const [search, setSearch] = useState("");

  const [restaurants, setRestaurants] = useState<
    Restaurant[]
  >([]);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [claimSuccessOpen, setClaimSuccessOpen] =
    useState(false);

  // Live restaurant search
  useEffect(() => {
    if (claimType !== "existing") {
      return;
    }

    if (selectedRestaurant) {
      return;
    }

    const searchTerm = search.trim();

    if (!searchTerm) {
      setRestaurants([]);
      setSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");

        const response = await apiClient.get(
          "/restaurants/by-name",
          {
            params: {
              name: searchTerm,
            },
          }
        );

        setRestaurants(response.data?.data ?? []);
      } catch (error: any) {
        console.error(
          "Restaurant search error:",
          error
        );

        setRestaurants([]);

        setError(
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Unable to search restaurants."
        );
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, claimType]);

  const handleSelectRestaurant = (
    restaurant: Restaurant
  ) => {
    setSelectedRestaurant(restaurant);
    setSearch(restaurant.name);
    setRestaurants([]);
    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      claimType === "existing" &&
      !selectedRestaurant
    ) {
      setError(
        "Please search for and select your restaurant."
      );
      return;
    }

    if (
      claimType === "new" &&
      !restaurantName.trim()
    ) {
      setError("Please enter your restaurant name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        restaurantId:
          claimType === "existing"
            ? selectedRestaurant!.id
            : null,

        restaurantName:
          claimType === "existing"
            ? selectedRestaurant!.name
            : restaurantName.trim(),

        email: email.trim(),
        phone: phone.trim(),
      };

      await apiClient.post(
        "/restaurant-claims",
        payload
      );

      setRestaurantName("");
      setSearch("");
      setRestaurants([]);
      setSelectedRestaurant(null);
      setEmail("");
      setPhone("");
      setClaimSuccessOpen(true);

    } catch (error: any) {
      console.error(
        "Restaurant claim error:",
        error
      );

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
          <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5 md:p-10">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Store className="h-7 w-7 text-primary" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Join Platera
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Bring your restaurant to Platera
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Connect your restaurant with hungry diners
                and showcase what makes your business special.
              </p>
            </div>

            {/* Two options */}
            <div className="mb-7 grid gap-4 md:grid-cols-2">

              {/* Existing restaurant */}
              <button
                type="button"
                onClick={() => {
                  setClaimType("existing");
                  setError("");
                }}
                className={`rounded-2xl border p-5 text-left transition ${claimType === "existing"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
                  }`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>

                <h2 className="font-semibold">
                  My restaurant is already on Platera
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search for your restaurant and claim it.
                </p>
              </button>

              {/* New restaurant */}
              <button
                type="button"
                onClick={() => {
                  setClaimType("new");
                  setSelectedRestaurant(null);
                  setSearch("");
                  setRestaurants([]);
                  setError("");
                }}
                className={`rounded-2xl border p-5 text-left transition ${claimType === "new"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
                  }`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>

                <h2 className="font-semibold">
                  My restaurant is new to Platera
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us the name of your restaurant.
                </p>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Existing restaurant */}
              {claimType === "existing" && (
                <div className="relative">
                  <label htmlFor="claim-email" className="mb-2 block text-sm font-medium">
                    Search your restaurant
                  </label>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="claim-email"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedRestaurant(null);
                      }}
                      placeholder="Search by restaurant name..."
                      className="h-11 rounded-xl pl-11 pr-10"
                    />

                    {searching && (
                      <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Search results */}
                  {restaurants.length > 0 && (
                    <div className="absolute left-0 right-0 top-[76px] z-20 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                      {restaurants.map((restaurant) => (
                        <button
                          key={restaurant.id}
                          type="button"
                          onClick={() =>
                            handleSelectRestaurant(
                              restaurant
                            )
                          }
                          className="flex w-full items-center px-4 py-3 text-left transition hover:bg-muted"
                        >
                          <div>
                            <p className="font-medium">
                              {restaurant.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {restaurant.slug}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected restaurant */}
                  {selectedRestaurant && (
                    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-sm font-medium text-primary">
                        Selected restaurant
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedRestaurant.name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* New restaurant */}
              {claimType === "new" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Restaurant name
                  </label>

                  <Input
                    value={restaurantName}
                    onChange={(e) =>
                      setRestaurantName(e.target.value)
                    }
                    placeholder="Enter your restaurant name"
                    className="h-11 rounded-xl"
                  />
                </div>
              )}

              {/* Contact information */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone
                  </label>

                  <Input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+961 XX XXX XXX"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                {submitting
                  ? "Submitting..."
                  : "Claim My Restaurant"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Your request will be reviewed by the
                Platera team before ownership is approved.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <AlertDialog
        open={claimSuccessOpen}
        onOpenChange={setClaimSuccessOpen}
      >
        <AlertDialogContent className="max-w-md rounded-3xl p-8">
          <AlertDialogHeader className="items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>

            <AlertDialogTitle className="text-2xl">
              Your claim is on its way!
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-center">
              Your restaurant ownership request has been
              successfully submitted. Our team will review
              your claim and get back to you soon.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 sm:justify-center">
            <AlertDialogAction
              onClick={() => navigate("/")}
              className="h-11 min-w-[180px] rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              Back to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}