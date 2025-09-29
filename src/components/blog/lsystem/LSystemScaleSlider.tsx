import Slider from "rc-slider";
import { FunctionComponent } from "react";

interface LSystemScaleSliderProps {
  initialValue: number;
  value: number;
  onChange: (value: number) => void;
  /** Must be strictly positive. */
  min: number;
  /** Must not be too high. */
  max: number;
}

export const LSystemScaleSlider: FunctionComponent<LSystemScaleSliderProps> = ({
  initialValue,
  value,
  onChange,
  min,
  max,
}) => {
  // return <div />;
  return <Slider min={min} max={max} defaultValue={initialValue} value={value} onChange={v => onChange(v as number)} />;
};
