import React from "react";
import { MdClose } from "react-icons/md";

const SearchBar = ({ handleOpenModal }) => {
  return (
    <div className="w-full flex tracking-wider items-center gap-3">
      <input
        autoComplete="off"
        type="text"
        className="w-full tracking-wider bg-transparent text-sm outline-none"
        placeholder="Explore Battle Roof..."
      />
      <div
        onClick={() => handleOpenModal("Search")}
        className="bg-color flex justify-center items-center text-2xl sm:text-3xl font-bold w-7 h-7 sm:w-9 sm:h-9 icon-bg text-color rounded-full p-1.5 sm:p-2.5 cursor-pointer"
      >
        <MdClose />
      </div>
    </div>
  );
};

export default SearchBar;
