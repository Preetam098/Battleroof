import React from "react";

const SearchBox = ({ value, handleChange, placeholder }) => {
  return (
    <div className="rounded-full border-color flex w-full sm:w-60 items-center border  p-1.5 pl-4 ">
      <input
        autoComplete="off"
        type="text"
        className=" outline-none  bg-transparent placeholder:text-xs tracking-wider text-sm w-full"
        placeholder={`Search ${placeholder}s...`}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
