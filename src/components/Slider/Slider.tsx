import { HTMLProps, useEffect, useRef } from "react";
import "./slider-style.css";

function Slider(
  props: HTMLProps<HTMLInputElement> & { color?: string; background?: string }
) {
  const ref = useRef<any>();

  useEffect(() => {
    if (props.value) {
      const value = props.value as number;
      const min = props.min as number;
      const max = props.max as number;
      const progress = ((value - min) * 100) / (max - min);

      ref.current.style.setProperty("--progress", `${progress}%`);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.color) ref.current.style.setProperty("--color", `${props.color}`);

    if (props.background)
      ref.current.style.setProperty("--background", `${props.background}`);
  }, [props.color, props.background]);

  const handleInput = (e: any) => {
    const value = e.target.value as number;
    const min = props.min as number;
    const max = props.max as number;
    ref.current.style.setProperty(
      "--progress",
      `${((value - min) * 100) / (max - min)}%`
    );
    props?.onInput?.(e);
  };

  return (
    <input
      type="range"
      {...props}
      className="slider"
      onInput={handleInput}
      ref={ref as any}
    />
  );
}

export default Slider;
