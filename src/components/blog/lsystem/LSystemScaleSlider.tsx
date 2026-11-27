import Slider from "@rc-component/slider";
import { FunctionComponent } from "react";

interface LSystemScaleSliderProps {
  initialValue: number;
  value: number;
  onChange: (value: number) => void;
  /** Must be strictly positive. */
  min: number;
  /** Must not be too high. */
  max: number;
  /** Accessible name of the slider handle. */
  ariaLabel?: string;
}

/**
 * Styled with Tailwind only (no `@rc-component/slider` stylesheet): its position styles are set inline,
 * everything else is ours.
 */
export const LSystemScaleSlider: FunctionComponent<LSystemScaleSliderProps> = ({
  initialValue,
  value,
  onChange,
  min,
  max,
  ariaLabel,
}) => (
  <Slider
    min={min}
    max={max}
    defaultValue={initialValue}
    value={value}
    onChange={v => onChange(v as number)}
    ariaLabelForHandle={ariaLabel}
    className="relative h-5 w-full cursor-pointer touch-none py-2"
    classNames={{
      rail: "absolute h-1 w-full rounded-full bg-gray",
      track: "absolute h-1 rounded-full bg-orange",
      handle:
        "absolute -mt-2 h-5 w-5 cursor-grab rounded-full border-[3px] border-black bg-orange shadow-[0_0_0_1px_var(--color-orange)] outline-none select-none focus-visible:shadow-[0_0_0_4px_var(--color-light-orange)] active:cursor-grabbing",
    }}
  />
);
