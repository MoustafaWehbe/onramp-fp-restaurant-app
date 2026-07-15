import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-3xl bg-gray-50/80 px-12 py-16 shadow-lg ring-1 ring-gray-200">
      {/* Heading */}
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-950">
          Welcome back
        </h1>

        <p className="mt-3 text-xl leading-relaxed text-gray-500">
          Sign in to discover your next favorite restaurant.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base text-red-600">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-4">
          <Label
            htmlFor="email"
            className="text-xl font-semibold text-gray-900"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-16 rounded-2xl px-6 text-lg border-gray-300 bg-white px-6 text-lg placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-base text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xl font-semibold text-gray-900"
            >
              Password
            </Label>

            <button
              type="button"
              className="text-base font-medium text-orange-500 hover:text-orange-600"
            >
              Forgot?
            </button>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-16 rounded-2xl border-gray-300 bg-white px-6 pr-14 text-lg placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-500"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-base text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-20 w-full rounded-2xl bg-orange-500 text-xl font-semibold hover:bg-orange-600">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        {/* Register */}
        <p className="pt-4 text-center text-lg text-gray-500">          New to Platera?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
