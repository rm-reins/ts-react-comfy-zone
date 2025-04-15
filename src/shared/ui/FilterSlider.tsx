import type React from "react";
import { useState, useRef, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(thumb);
  };

  const handleTouchStart = (thumb: "min" | "max") => (e: React.TouchEvent) => {
    e.preventDefault();
    setDragging(thumb);
  };

  const calculateNewValue = (clientX: number) => {
    if (!trackRef.current) return localValue;

    const { left, width } = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - left) / width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;

    if (dragging === "min") {
      return [Math.min(steppedValue, localValue[1] - step), localValue[1]] as [
        number,
        number
      ];
    } else if (dragging === "max") {
      return [localValue[0], Math.max(steppedValue, localValue[0] + step)] as [
        number,
        number
      ];
    }

    return localValue;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const newValue = calculateNewValue(e.clientX);
      setLocalValue(newValue);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging || !e.touches[0]) return;
      const newValue = calculateNewValue(e.touches[0].clientX);
      setLocalValue(newValue);
    };

    const handleMouseUp = () => {
      if (dragging) {
        onChange(localValue);
        setDragging(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging, localValue, onChange]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(
      min,
      Math.min(Number.parseInt(e.target.value) || min, localValue[1] - step)
    );
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(
      max,
      Math.max(Number.parseInt(e.target.value) || max, localValue[0] + step)
    );
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-[85%] mx-auto h-12 pt-6">
        <div
          ref={trackRef}
          className="absolute h-2 w-full rounded-full bg-gray-200"
        >
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${
                getPercentage(localValue[1]) - getPercentage(localValue[0])
              }%`,
            }}
          />
        </div>
        <div
          className="absolute top-4.5 h-5 w-5 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white active:cursor-grabbing"
          style={{ left: `${getPercentage(localValue[0])}%` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleTouchStart("min")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={localValue[1]}
          aria-valuenow={localValue[0]}
          tabIndex={0}
        />
        <div
          className="absolute top-4.5 h-5 w-5 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white active:cursor-grabbing"
          style={{ left: `${getPercentage(localValue[1])}%` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleTouchStart("max")}
          role="slider"
          aria-valuemin={localValue[0]}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
          tabIndex={0}
        />
      </div>
      <div className="flex items-center justify-around">
        <div className="w-20">
          <input
            type="number"
            value={localValue[0]}
            onChange={handleMinInputChange}
            className="h-8 border-2 rounded-xl p-2"
            min={min}
            max={localValue[1] - step}
          />
        </div>
        <span className="text-muted-foreground">to</span>
        <div className="w-20 ">
          <input
            type="number"
            value={localValue[1]}
            onChange={handleMaxInputChange}
            className="h-8 border-2 rounded-xl p-2"
            min={localValue[0] + step}
            max={max}
          />
        </div>
      </div>
    </div>
  );
}
