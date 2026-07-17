import { Outlet, Link } from "react-router-dom";

export default function AuthCenteredLayout() {
    return (
        <main
            className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/auth-food.png')" }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Brand */}
            <Link
                to="/"
                className="absolute left-8 top-8 z-10 flex items-center gap-3"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl shadow-lg">
                    🍽️
                </div>

                <span className="text-2xl font-bold text-white">
                    Platera
                </span>
            </Link>

            {/* Child page */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-2xl">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}