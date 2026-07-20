import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
} from "lucide-react";

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

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain an uppercase letter")
            .regex(/[0-9]/, "Password must contain a number"),

        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            setError(null);

            if (!token) {
                setError("This password reset link is invalid or incomplete.");
                return;
            }

            // Temporary delay until the backend endpoint is ready.
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Later, send:
            // token
            // data.password

            setIsSubmitted(true);
        } catch {
            setError("Unable to reset your password. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <Card className="w-full max-w-3xl rounded-3xl border-border bg-card px-8 py-10 shadow-2xl md:px-12 md:py-12">
                <CardHeader className="items-center space-y-5 pb-10 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2
                            className="h-10 w-10 text-green-600"
                            aria-hidden="true"
                        />
                    </div>

                    <CardTitle className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                        Password updated
                    </CardTitle>

                    <CardDescription className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                        Your password has been reset successfully. You can now sign in
                        using your new password.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 md:px-10">
                    <Link
                        to="/login"
                        className="inline-flex h-16 w-full items-center justify-center rounded-2xl bg-primary px-4 text-xl font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Continue to login
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-3xl rounded-3xl border-border bg-card px-8 py-10 shadow-2xl md:px-12 md:py-12">
            <CardHeader className="space-y-5 pb-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <LockKeyhole
                        className="h-10 w-10 text-primary"
                        aria-hidden="true"
                    />
                </div>

                <CardTitle className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Create a new password
                </CardTitle>

                <CardDescription className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    Enter a secure password that you have not used before.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <CardContent className="space-y-8 px-6 md:px-10">
                    {error && (
                        <div
                            className="rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-base text-destructive"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* New password */}
                    <div className="space-y-4">
                        <Label
                            htmlFor="password"
                            className="text-xl font-semibold text-foreground"
                        >
                            New password
                        </Label>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password ? "password-error" : undefined
                                }
                                className="h-16 rounded-2xl px-6 pr-14 text-lg"
                                {...register("password")}
                            />

                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((previous) => !previous)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p
                                id="password-error"
                                className="text-base text-destructive"
                                role="alert"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-4">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-xl font-semibold text-foreground"
                        >
                            Confirm new password
                        </Label>

                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.confirmPassword)}
                                aria-describedby={
                                    errors.confirmPassword
                                        ? "confirm-password-error"
                                        : undefined
                                }
                                className="h-16 rounded-2xl px-6 pr-14 text-lg"
                                {...register("confirmPassword")}
                            />

                            <button
                                type="button"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirmed password"
                                        : "Show confirmed password"
                                }
                                aria-pressed={showConfirmPassword}
                                onClick={() =>
                                    setShowConfirmPassword((previous) => !previous)
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p
                                id="confirm-password-error"
                                className="text-base text-destructive"
                                role="alert"
                            >
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="h-16 w-full rounded-2xl text-xl font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    className="mr-3 h-6 w-6 animate-spin"
                                    aria-hidden="true"
                                />
                                Resetting password...
                            </>
                        ) : (
                            "Reset password"
                        )}
                    </Button>
                </CardContent>

                <CardFooter className="justify-center pt-10">
                    <Link
                        to="/login"
                        className="flex items-center gap-3 text-lg font-semibold text-primary hover:underline"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                        Back to login
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}