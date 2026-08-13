import {
  Briefcase,
  Camera,
  Circle,
  Eye,
  Lightbulb,
  Mic,
  Monitor,
  Plug,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

export interface FeatureIconProps {
  iconKey: string;
  className?: string;
}

const featureIcons: Record<string, LucideIcon> = {
  view: Eye,
  sensor: Camera,
  noise: Volume2,
  resolution: Monitor,
  microphone: Mic,
  lighting: Lightbulb,
  portability: Briefcase,
  plug: Plug,
};

export function FeatureIcon({
  iconKey,
  className,
}: FeatureIconProps): ReactElement {
  const Icon = featureIcons[iconKey] ?? Circle;

  return (
    <Icon
      aria-hidden="true"
      className={cn("size-8", className)}
      strokeWidth={1.6}
    />
  );
}
