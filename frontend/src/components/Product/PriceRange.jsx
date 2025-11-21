import React from "react";
import Slider from "react-slider";

const PriceRange = ({ filter, setFilter }) => {
  const GAP = 1000;

  const handleChange = (values) => {
    let [min, max] = values;
    /* never below zero */
    min = Math.max(0, min);
    max = Math.max(0, max);

    if (max - min < GAP) {
      if (min === filter.min) min = max - GAP;
      else max = min + GAP;
    }
     min = Math.max(0, min);
     max = Math.max(0, max);

    setFilter({ ...filter, min, max });
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col gap-4">
      <Slider
        min={0}
        max={100000}
        value={[filter.min, filter.max]}
        onChange={handleChange}
        className="relative h-3"

        renderTrack={(props, state) => {
          const { key, ...rest } = props;
          let trackClass = "absolute h-3 rounded-full";
          if (state.index === 1) trackClass += " bg-indigo-600";
          else trackClass += " bg-gray-300";
          // if (state.index === 2) trackClass += " bg-transparent";

          return <div key={key} {...rest} className={trackClass} />;
        }}
        renderThumb={(props) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="w-5 h-5 bg-indigo-600 rounded-full shadow-md cursor-pointer -mt-1"
            />
          );
        }}
      />

      <div className="flex justify-between text-sm text-gray-700">
        <span>Min: Rs. {filter.min}</span>
        <span>Max: Rs. {filter.max}</span>
      </div>
    </div>
  );
};

export default PriceRange;
