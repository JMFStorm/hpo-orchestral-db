import React from "react";

const LoadingIcon = ({ sizePixels }) => {
  const borderWidth = sizePixels / 4;
  return (
    <div className="loader-wrap">
      <div
        style={{
          width: sizePixels,
          height: sizePixels,
          border: `${borderWidth}px solid #f3f3f3`,
          borderTop: `${borderWidth}px solid #3498db`,
        }}
        className="loader"
      ></div>
    </div>
  );
};

export default LoadingIcon;
