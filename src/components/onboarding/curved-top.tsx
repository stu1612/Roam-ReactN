import Svg, { Path } from "react-native-svg";

import { colors } from "@/constants/theme";

export const CURVE_HEIGHT = 40;

/** The card's top edge: high on the left, sweeping down to the right corner. */
export function CurvedTop({ width }: { width: number }) {
  const w = width;
  const h = CURVE_HEIGHT;
  const d = `M0 ${h} L0 24 Q0 2 24 2 C${w * 0.45} 2 ${w * 0.75} 10 ${w - 28} 22 Q${w} 30 ${w} ${h} Z`;
  return (
    <Svg width={w} height={h}>
      <Path d={d} fill={colors.surface} />
    </Svg>
  );
}
