import React from "react";
import Slider from "react-slider";

const PriceRange = ({ filter, setFilter }) => {
  const GAP = 1000;

  // Handles slider change with gap enforcement
  const handleChange = (values) => {
    let [min, max] = values;

    if (max - min < GAP) {
      if (min === filter.min) {
        min = max - GAP;
      } else {
        max = min + GAP;
      }
    }

    setFilter({ ...filter, min, max });
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Price Range</h2>

      <Slider
        min={0}
        max={10000}
        value={[filter.min, filter.max]}
        onChange={handleChange}
        className="w-full h-3"
        renderTrack={(props, state) => {
          const style =
            state.index === 1
              ? "bg-indigo-600 h-3 rounded-full" // filled part
              : "bg-gray-300 h-3 rounded-full"; // unfilled part
          return <div {...props} className={style} />;
        }}
        renderThumb={(props) => (
          <div
            {...props}
            className="w-5 h-5 bg-indigo-600 rounded-full shadow-md cursor-pointer"
          />
        )}
      />

      <div className="flex justify-between text-sm text-gray-700">
        <span>Min: Rs. {filter.min}</span>
        <span>Max: Rs. {filter.max}</span>
      </div>
    </div>
  );
};

export default PriceRange;
