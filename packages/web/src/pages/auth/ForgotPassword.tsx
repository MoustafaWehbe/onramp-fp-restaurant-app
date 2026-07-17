import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

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

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Temporary simulation until the backend endpoint is ready.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
        <CardHeader className="items-center space-y-5 pb-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              className="h-10 w-10 text-green-600"
              aria-hidden="true"
            />
          </div>

          <CardTitle className="text-4xl font-bold tracking-tight md:text-5xl">
            Check your email
          </CardTitle>

          <CardDescription className="max-w-xl text-lg leading-relaxed md:text-xl">
            If an account exists for{" "}
            <span className="font-semibold text-foreground">
              {submittedEmail}
            </span>
            , we have sent password reset instructions.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 md:px-10">
          <Button
            type="button"
            variant="outline"
            className="h-16 w-full rounded-2xl text-lg font-semibold"
            onClick={() => setIsSubmitted(false)}
          >
            Send to another email
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
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
      <CardHeader className="space-y-5 pb-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>

        <CardTitle className="text-4xl font-bold tracking-tight md:text-5xl">
          Forgot your password?
        </CardTitle>

        <CardDescription className="mx-auto max-w-xl text-lg leading-relaxed md:text-xl">
          Enter your email address and we’ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-8 px-6 md:px-10">
          <div className="space-y-4">
            <Label
              htmlFor="email"
              className="text-xl font-semibold text-foreground"
            >
              Email address
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-16 rounded-2xl px-6 text-lg placeholder:text-muted-foreground"
              {...register("email")}
            />

            {errors.email && (
              <p
                id="email-error"
                className="text-base font-medium text-destructive"
                role="alert"
              >
                {errors.email.message}
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
                Sending...
              </>
            ) : (
              "Send reset link"
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