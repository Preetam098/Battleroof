import React, { useEffect } from "react";
import { MdExpandLess } from "react-icons/md";

const Pagination = (props) => {
  const { handlePrev, from, to, total, handleForw } = props;
  const end = to >= total ? total : to;

  useEffect(() => {
    if (from >= total) {
      handlePrev();
    }
  }, [total, from, handlePrev]);

  return (
    <div className=" p-3 sm:py-3 py-2.5 sm:text-sm border-t border-gray-700 text-xs bg-secondary w-full flex items-center gap-3 justify-end">
      <div className="">
        {total > 0 ? from + 1 : from || 0}
        {` - ${end || 0}`} of {total || 0}
      </div>
      <div className=" flex gap-1">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-6 h-6  rounded-full flex justify-center items-center cursor-pointer "
        >
          <MdExpandLess className="text-xl rotate-[270deg]" />
        </button>

        {/* next */}
        <button
          disabled={end === total}
          type="button"
          onClick={handleForw}
          className="w-6 h-6  rounded-full flex justify-center items-center cursor-pointer "
        >
          <MdExpandLess className="text-xl rotate-[90deg]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
