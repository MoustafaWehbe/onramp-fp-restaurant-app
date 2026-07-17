import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data.email, data.password, data.name);
      navigate("/email-verification", {state: { email: data.email } });
    } catch {
      setError("Registration failed. That email may already be in use.");
    }
  };

return (
    <Card className="w-full max-w-2xl rounded-3xl border-gray-200 bg-gray-50/80 px-8 py-8 shadow-lg"> 
    <CardHeader className="space-y-3 pb-10">
      <CardTitle className="text-5xl font-extrabold tracking-tight text-foreground">
        Create an account
      </CardTitle>

      <CardDescription className="text-xl leading-relaxed text-muted-foreground">
        Fill in the details below to get started.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-base text-destructive">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-4">
          <Label
            htmlFor="name"
            className="text-xl font-semibold text-foreground"
          >
            Name
          </Label>

          <Input
            id="name"
            placeholder="Alice Smith"
            className="h-16 rounded-2xl border-input bg-background px-6 text-lg placeholder:text-muted-foreground "
            {...register("name")}
          />

          {errors.name && (
            <p className="text-base text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-4">
          <Label
            htmlFor="email"
            className="text-xl font-semibold text-foreground"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-16 rounded-2xl border-input bg-background px-6 text-lg placeholder:text-muted-foreground "
            {...register("email")}
          />

          {errors.email && (
            <p className="text-base text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-4">
          <Label
            htmlFor="password"
            className="text-xl font-semibold text-foreground"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-16 rounded-2xl border-input bg-background px-6 pr-14 text-lg placeholder:text-muted-foreground "
              {...register("password")}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-base text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-20 w-full rounded-2xl text-xl font-semibold"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </CardContent>

    <CardFooter className="justify-center pt-8">
      <p className="text-lg text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </CardFooter>
  </Card>
);
}