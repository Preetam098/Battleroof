import React, { memo } from "react";

const Button = ({ title, icon, event, className, ...rest }) => {
  return (
    <button
      {...rest}
      type="button"
      onClick={event}
      className={`${className} bg-button justify-center text-xs sm:text-sm flex items-center gap-2 cursor-pointer tracking-wider p-1.5 sm:px-4 rounded text-white`}
    >
      {title}
    </button>
  );
};

export default memo(Button);
