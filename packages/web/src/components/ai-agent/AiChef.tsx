import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import chefAnimation from "@/assets/animations/chef.json";
import { AiChat } from "./AiChat";

export function AiChef() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);

      setTimeout(() => {
        setShowHint(false);
      }, 5000);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {showHint && !open && (
          <div
            className="
              bg-white
              shadow-lg
              rounded-xl
              px-4
              py-3
              text-sm
              max-w-xs
            "
          >
            👨‍🍳 Need help finding a restaurant?
            <br />
            I'm here to assist!
          </div>
        )}

        <button
          onClick={() => {
            setOpen(true);
            setShowHint(false);
          }}
          className="
            w-24
            h-24
            rounded-full
            bg-white
            shadow-xl
            hover:scale-105
            transition-transform
          "
        >
          <Lottie
            src={chefAnimation}
            loop
            autoplay
            className="w-full h-full"
          />
        </button>
      </div>

      {open && (
        <AiChat
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}