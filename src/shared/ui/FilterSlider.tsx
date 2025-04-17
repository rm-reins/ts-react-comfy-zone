import { useState, useRef, useEffect, useCallback } from "react";

type ThumbType = "min" | "max" | null;

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
}

function useRangeSlider(
  min: number,
  max: number,
  value: [number, number],
  step: number,
  onChange: (value: [number, number]) => void
) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [dragging, setDragging] = useState<ThumbType>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
    [min, max]
  );

  const calculateNewValue = useCallback(
    (clientX: number): [number, number] => {
      if (!trackRef.current) return localValue;

      const { left, width } = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - left) / width));
      const rawValue = min + percent * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      if (dragging === "min") {
        return [Math.min(steppedValue, localValue[1] - step), localValue[1]];
      } else if (dragging === "max") {
        return [localValue[0], Math.max(steppedValue, localValue[0] + step)];
      }

      return localValue;
    },
    [dragging, localValue, min, max, step]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setLocalValue(calculateNewValue(e.clientX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      setLocalValue(calculateNewValue(e.touches[0].clientX));
    };

    const handleEnd = () => {
      onChange(localValue);
      setDragging(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, localValue, calculateNewValue, onChange]);

  const handleThumbDown = useCallback(
    (thumb: ThumbType) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setDragging(thumb);
    },
    []
  );

  const handleInputChange = useCallback(
    (isMin: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove leading zeros and parse
      const inputValue = e.target.value.replace(/^0+/, "") || "0";
      const parsedValue = parseInt(inputValue, 10);

      if (isMin) {
        const newMin = Math.max(
          min,
          Math.min(parsedValue || min, localValue[1] - step)
        );
        setLocalValue([newMin, localValue[1]]);
      } else {
        const newMax = Math.min(
          max,
          Math.max(parsedValue || max, localValue[0] + step)
        );
        setLocalValue([localValue[0], newMax]);
      }
    },
    [localValue, min, max, step]
  );

  // To prevent focus loss on value input
  const handleInputBlur = useCallback(() => {
    onChange(localValue);
  }, [onChange, localValue]);

  return {
    localValue,
    trackRef,
    getPercentage,
    handleThumbDown,
    handleInputChange,
    handleInputBlur,
  };
}

export function PriceRangeSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
}: PriceRangeSliderProps) {
  const {
    localValue,
    trackRef,
    getPercentage,
    handleThumbDown,
    handleInputChange,
    handleInputBlur,
  } = useRangeSlider(min, max, value, step, onChange);

  return (
    <div className="space-y-4">
      <div className="relative w-[85%] mx-auto h-12 pt-6">
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute h-2 w-full rounded-full bg-gray-200"
        >
          {/* Selected range */}
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

        {/* Min thumb */}
        <div
          className="absolute top-4.5 h-5 w-5 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white active:cursor-grabbing"
          style={{ left: `${getPercentage(localValue[0])}%` }}
          onMouseDown={handleThumbDown("min")}
          onTouchStart={handleThumbDown("min")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={localValue[1]}
          aria-valuenow={localValue[0]}
          tabIndex={0}
        />

        {/* Max thumb */}
        <div
          className="absolute top-4.5 h-5 w-5 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white active:cursor-grabbing"
          style={{ left: `${getPercentage(localValue[1])}%` }}
          onMouseDown={handleThumbDown("max")}
          onTouchStart={handleThumbDown("max")}
          role="slider"
          aria-valuemin={localValue[0]}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
          tabIndex={0}
        />
      </div>

      {/* Input fields */}
      <div className="flex items-center justify-around">
        <div className="w-20">
          <input
            id="price-min-input"
            name="price-min"
            type="number"
            value={localValue[0]}
            onChange={handleInputChange(true)}
            onBlur={handleInputBlur}
            className="h-8 w-full border-2 rounded-xl p-2"
            min={min}
            max={localValue[1] - step}
            aria-label="Minimum value"
          />
        </div>
        <span className="text-muted-foreground">to</span>
        <div className="w-20">
          <input
            id="price-max-input"
            name="price-max"
            type="number"
            value={localValue[1]}
            onChange={handleInputChange(false)}
            onBlur={handleInputBlur}
            className="h-8 w-full border-2 rounded-xl p-2"
            min={localValue[0] + step}
            max={max}
            aria-label="Maximum value"
          />
        </div>
      </div>
    </div>
  );
}
