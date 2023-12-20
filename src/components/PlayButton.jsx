import React from "react";
import { AiFillPlayCircle } from "react-icons/ai";

const PlayButton = ({ event, size }) => {
  return (
    <AiFillPlayCircle
      onClick={event}
      className={`${size ? size : "text-xl"} text-color cursor-pointer`}
    />
  );
};

export default PlayButton;
