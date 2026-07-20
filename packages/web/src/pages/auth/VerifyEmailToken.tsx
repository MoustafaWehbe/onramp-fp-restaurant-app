import { useEffect, useState } from "react";
import { Link,useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { apiClient } from "../../lib/api-client";

export function VerifyEmailToken() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await apiClient.post("/auth/verify-email", {
          token,
        });

        navigate("/");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ??
            "Verification link is invalid or has expired.",
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <Card className="w-full max-w-xl rounded-3xl border-white/20 bg-white/95 px-8 py-10 shadow-2xl backdrop-blur-sm md:px-12 md:py-12">
      <CardHeader className="items-center space-y-5 text-center">
        {status === "loading" && (
          <Loader2
            className="h-16 w-16 animate-spin text-primary"
            aria-hidden="true"
          />
        )}

        {status === "error" && (
          <XCircle
            className="h-16 w-16 text-destructive"
            aria-hidden="true"
          />
        )}

        <CardTitle className="text-4xl font-bold">
          {status === "loading"
            ? "Verifying your email..."
            : "Verification failed"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <p className="text-lg text-muted-foreground">
          {message}
        </p>

        {status === "error" && (
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl text-lg"
          >
            <Link to="/email-verification">
              Back to verification
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}