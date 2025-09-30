import Slider from "@rc-component/slider";
import "@rc-component/slider/assets/index.css";
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
}) => <Slider min={min} max={max} defaultValue={initialValue} value={value} onChange={v => onChange(v as number)} />;
