import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const RESEND_COOLDOWN_SECONDS = 60;

export function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  // Register should navigate here with: navigate("/verify-email", { state: { email } })
  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [isResending, setIsResending] = useState(false);
  const [justResent, setJustResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // If someone lands here without an email in state (e.g. direct visit),
  // send them back to register instead of showing a broken page.
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  const handleResend = async () => {
    if (isResending || cooldown > 0) return;

    setIsResending(true);
    setJustResent(false);
    try {
      // Temporary simulation until the backend endpoint is ready.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setJustResent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Resend verification email error:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
      <CardHeader className="items-center space-y-5 pb-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>

        <CardTitle className="text-4xl font-bold tracking-tight md:text-5xl">
          Verify your email
        </CardTitle>

        <CardDescription className="max-w-xl text-lg leading-relaxed md:text-xl">
          We sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          Click the link in that email to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6 md:px-10">
        {justResent && cooldown > 0 && (
          <div
            className="flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4 text-base font-medium text-green-700"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            Verification email sent again. Check your inbox.
          </div>
        )}

        <Button
          type="button"
          variant="default"
          className="h-16 w-full rounded-2xl text-lg font-semibold"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
        >
          {isResending ? (
            <>
              <Loader2
                className="mr-3 h-6 w-6 animate-spin"
                aria-hidden="true"
              />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Send another email (${cooldown}s)`
          ) : (
            "Send another email"
          )}
        </Button>

        <p className="text-center text-base text-muted-foreground">
          Didn’t get it? Check your spam folder, or make sure{" "}
          <span className="font-medium text-foreground">{email}</span> is
          correct.
        </p>
      </CardContent>

      <CardFooter className="justify-center pt-10">
        <Link
          to="/login"
          className="text-lg font-semibold text-primary hover:underline"
        >
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}