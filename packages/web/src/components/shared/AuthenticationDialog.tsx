import { useNavigate } from "react-router-dom";
import { Bookmark, ArrowRight, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AuthenticationDialogProps {
  open: boolean;
  title: string;
  description: string;
  redirectTo?: string;
  onClose: () => void;
}

export function AuthenticationDialog({
  open,
  title,
  description,
  redirectTo,
  onClose,
}: AuthenticationDialogProps) {
  const navigate = useNavigate();

  const handleContinue = () => {
    const target =
      redirectTo ??
      window.location.pathname + window.location.search;

    navigate(`/login?redirect=${encodeURIComponent(target)}`);
    onClose();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <AlertDialogContent
        className="
          max-w-md
          overflow-hidden
          rounded-3xl
          border border-orange-100
          bg-white
          p-0
          shadow-[0_25px_80px_rgba(0,0,0,0.14)]
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition-all
            hover:bg-orange-50
            hover:text-orange-500
          "
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {/* Main content */}
        <div className="relative overflow-hidden px-8 pb-8 pt-9 text-center">
          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-44
              w-44
              rounded-full
              bg-orange-100/70
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-16
              h-40
              w-40
              rounded-full
              bg-amber-50
              blur-3xl
            "
          />

          <div className="relative">
            {/* Icon */}
            <div
              className="
                mx-auto
                mb-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-orange-100
                bg-gradient-to-br
                from-orange-50
                to-amber-50
                shadow-sm
              "
            >
              <Bookmark
                className="h-7 w-7 text-orange-500"
                strokeWidth={1.7}
              />
            </div>

            <AlertDialogHeader className="space-y-3 text-center">
              <AlertDialogTitle
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-gray-950
                "
              >
                {title}
              </AlertDialogTitle>

              <AlertDialogDescription
                className="
                  mx-auto
                  max-w-sm
                  text-[15px]
                  leading-6
                  text-gray-500
                "
              >
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Sign in */}
            <div className="mt-7 flex justify-center">
              <AlertDialogAction
                onClick={handleContinue}
                className="
                  group
                  inline-flex
                  min-w-[150px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border-0
                  bg-gradient-to-r
                  from-orange-500
                  to-amber-500
                  px-7
                  py-5
                  font-semibold
                  text-white
                  shadow-md
                  shadow-orange-200/60
                  transition-all
                  hover:-translate-y-0.5
                  hover:from-orange-600
                  hover:to-amber-600
                  hover:shadow-lg
                  hover:shadow-orange-200/70
                 "
              >
                <span>Sign in</span>

                <ArrowRight
                  className="
                    h-4
                    w-4
                    shrink-0
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                  "
                />
              </AlertDialogAction>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}