import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { getErrorMessage } from "../../lib/error-handler";
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
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const email =
    (location.state as { email?: string } | null)?.email ?? "";

  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const [isResending, setIsResending] = useState(false);
  const [justResent, setJustResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Verify the token from the email link
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await apiClient.post("/auth/verify-email", {
          token,
        });

        setIsVerified(true);
      } catch (error) {
        setVerificationError(
          getErrorMessage(
            error,
            "This verification link is invalid or has expired.",
          ),
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleResend = async () => {
    if (!email || isResending || cooldown > 0) return;

    setIsResending(true);
    setJustResent(false);
    setResendError(null);

    try {
      await apiClient.post("/auth/resend-verification", {
        email,
      });

      setJustResent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendError(
        getErrorMessage(error, "Failed to resend verification email."),
      );
    } finally {
      setIsResending(false);
    }
  };

  // Verifying email token
  if (token) {
    if (isVerifying) {
      return (
        <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
          <CardHeader className="items-center space-y-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Loader2
                className="h-10 w-10 animate-spin text-primary"
                aria-hidden="true"
              />
            </div>

            <CardTitle className="text-4xl font-bold">
              Verifying your email...
            </CardTitle>

            <CardDescription className="text-lg">
              Please wait while we activate your Platera account.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    if (verificationError) {
      return (
        <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
          <CardHeader className="items-center space-y-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle
                className="h-10 w-10 text-red-500"
                aria-hidden="true"
              />
            </div>

            <CardTitle className="text-4xl font-bold">
              Verification failed
            </CardTitle>

            <CardDescription className="text-lg">
              {verificationError}
            </CardDescription>
          </CardHeader>

          <CardFooter className="justify-center pt-8">
            <Button
              onClick={() => navigate("/login")}
              className="h-14 rounded-2xl px-8 text-lg"
            >
              Back to login
            </Button>
          </CardFooter>
        </Card>
      );
    }

    if (isVerified) {
      return (
        <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
          <CardHeader className="items-center space-y-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                className="h-10 w-10 text-green-600"
                aria-hidden="true"
              />
            </div>

            <CardTitle className="text-4xl font-bold">
              Email verified!
            </CardTitle>

            <CardDescription className="text-lg">
              Your Platera account has been successfully verified.
              You can now log in to your account.
            </CardDescription>
          </CardHeader>

          <CardFooter className="justify-center pt-8">
            <Button
              onClick={() => navigate("/login")}
              className="h-14 rounded-2xl px-8 text-lg"
            >
              Continue to login
            </Button>
          </CardFooter>
        </Card>
      );
    }
  }

  // Registration flow: user arrived here without a token
  if (!email) {
    return (
      <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
        <CardHeader className="items-center space-y-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MailCheck
              className="h-10 w-10 text-primary"
              aria-hidden="true"
            />
          </div>

          <CardTitle className="text-4xl font-bold">
            Verify your email
          </CardTitle>

          <CardDescription className="text-lg">
            Please register first to receive a verification email.
          </CardDescription>
        </CardHeader>

        <CardFooter className="justify-center pt-8">
          <Button
            onClick={() => navigate("/register")}
            className="h-14 rounded-2xl px-8 text-lg"
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>
    );
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
        {resendError && (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base font-medium text-red-600"
            role="alert"
          >
            {resendError}
          </div>
        )}

        {justResent && cooldown > 0 && (
          <div
            className="flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4 text-base font-medium text-green-700"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            Your verification email will be sent shortly. Please check your
            inbox.
          </div>
        )}

        <Button
          type="button"
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