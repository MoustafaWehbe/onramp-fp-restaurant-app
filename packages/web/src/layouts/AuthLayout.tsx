import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <section
        className="relative hidden min-h-screen overflow-hidden bg-cover bg-center text-white lg:flex lg:flex-col"
        style={{
          backgroundImage: "url('/images/auth-food.png')",
        }}
      >
        {/* Dark overlay placed above the image */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Orange decorative glow */}
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

        {/* Content placed above the overlay */}
        <div className="relative z-10 flex min-h-screen flex-col px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl shadow-lg">
              🍽️
            </div>

            <span className="text-2xl font-bold">Platera</span>
          </div>

          {/* Main message */}
          <div className="my-auto max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Discover your next favorite
            </p>

            <blockquote className="text-4xl font-bold leading-tight xl:text-5xl">
              Every meal tells a story. Let{" "}
              <span className="text-orange-400">Platera</span>{" "}
              help you discover the next one.
            </blockquote>

            <p className="mt-8 text-lg text-gray-300">
              Explore restaurants, flavors, and unforgettable dining experiences.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Platera
          </p>
        </div>
      </section>

      {/* Right Side */}
      <section className="flex min-h-screen items-center justify-center bg-white px-8 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
