import React, { useState, useEffect, useRef } from "react";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
  sizes?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  layout?: "fixed" | "intrinsic" | "responsive" | "fill";
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  loading,
  quality,
  sizes,
  onLoad,
  onError,
  onClick,
  className = "",
  placeholder = "empty",
  blurDataURL,
  objectFit,
  layout = "intrinsic",
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Generate optimized src if quality is provided
  const optimizedSrc = quality ? `${src}?q=${quality}` : src;

  // Handle srcSet for responsive images
  const generateSrcSet = () => {
    if (!width || !src) return undefined;

    // Example srcSet generator - in real implementation, you'd use your image optimization service
    const widths = [0.5, 1, 1.5, 2].map((scale) => Math.round(width * scale));
    return widths.map((w) => `${src}?w=${w} ${w}w`).join(", ");
  };

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    if (onLoad) onLoad(event);
  };

  // Calculate styles based on layout
  const getImageStyle = () => {
    let styles: React.CSSProperties = {};

    if (layout === "fill") {
      styles = {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: objectFit || "cover",
      };
    } else if (layout === "responsive") {
      styles = {
        width: "100%",
        height: "auto",
      };
    }

    return styles;
  };

  // Generate wrapper styles
  const getWrapperStyle = () => {
    if (layout === "fill") {
      return { position: "relative", width: "100%", height: "100%" };
    }

    if (layout === "responsive" && width && height) {
      return {
        position: "relative",
        paddingBottom: `${(height / width) * 100}%`,
      };
    }

    return {};
  };

  // For blur placeholder
  const placeholderStyle: React.CSSProperties =
    placeholder === "blur" && blurDataURL && !loaded
      ? {
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${blurDataURL})`,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(20px)",
          transition: "opacity 0.3s ease-in-out",
          opacity: loaded ? 0 : 1,
        }
      : {};

  // For responsive and fill layouts, wrap the image in a div
  if (layout === "fill" || layout === "responsive") {
    return (
      <div style={getWrapperStyle() as React.CSSProperties}>
        {placeholder === "blur" && blurDataURL && (
          <div
            style={placeholderStyle}
            aria-hidden="true"
          />
        )}
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={layout !== "fill" ? width : undefined}
          height={layout !== "fill" ? height : undefined}
          loading={priority ? "eager" : loading || "lazy"}
          onLoad={handleLoad}
          onError={onError}
          onClick={onClick}
          className={`${className} ${loaded ? "loaded" : "loading"}`}
          style={getImageStyle()}
          sizes={sizes}
          srcSet={generateSrcSet()}
          {...rest}
        />
      </div>
    );
  }

  // For fixed and intrinsic layouts, render just the image
  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : loading || "lazy"}
      onLoad={handleLoad}
      onError={onError}
      className={`${className} ${loaded ? "loaded" : "loading"}`}
      sizes={sizes}
      srcSet={generateSrcSet()}
      {...rest}
    />
  );
};

export default Image;
