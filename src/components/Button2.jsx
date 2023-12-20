import React from "react";

const Button2 = ({ title, icon, event }) => {
  return (
    <div
      onClick={event}
      className="bg-secondary text-sm flex items-center gap-1 cursor-pointer tracking-wider py-1.5 md:py-2 px-3 md:px-4 rounded text-white"
    >
      {icon}
      {title}
    </div>
  );
};

export default Button2;
