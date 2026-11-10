import * as React from 'react';
import {
  Calculator,
  ArrowLeftRight,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Search,
  Code2,
  Sparkles,
  Video,
  Music,
  ShieldCheck,
  CheckSquare,
  Calendar,
  Percent,
  Activity,
  Coins,
  Layers,
  QrCode,
  KeyRound,
  Palette,
  CaseSensitive,
  Binary,
  Split,
  Timer,
  Wrench,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Calculator,
  ArrowLeftRight,
  FileText,
  Image: ImageIcon,
  AlignLeft,
  Search,
  Code2,
  Sparkles,
  Video,
  Music,
  ShieldCheck,
  CheckSquare,
  Calendar,
  Percent,
  Activity,
  Coins,
  Layers,
  QrCode,
  KeyRound,
  Palette,
  CaseSensitive,
  Binary,
  Split,
  Timer,
  Wrench,
};

export interface CategoryIconProps extends LucideProps {
  name?: string;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const IconComponent = (name && iconMap[name]) || Wrench;
  return <IconComponent {...props} />;
}
