import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-[#D1D5DB] bg-[#E5E7EB] shadow-inner transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#292524] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 group-data-[state=checked]/switch:translate-x-5 group-data-[size=sm]/switch:h-4 group-data-[size=sm]/switch:w-4"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
