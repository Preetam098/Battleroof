import React from "react";

const TableLoader = () => {
  return (
    <div className="table-container rounded-lg pb-5">
      <table className="w-full text-left rounded-full whitespace-nowrap">
        <thead>
          <tr className="table-head w-full h-11 ">
            <th className="rounded-lg px-4 flex items-center py-1 gap-20">
              <th className="sm:w-11 sm:h-11 w-10 h-10  bg-gray-600 rounded-full"></th>
              <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
              <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
              <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
              <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
            </th>
          </tr>
        </thead>
        <tbody className="text-xs relative h-full overflow-y-auto">
          {Array(4)
            .fill()
            .map((item, index) => {
              return (
                <tr
                  key={index}
                  className={`${index % 2 !== 0 && "table-head"} h-10 `}
                >
                  <td className="px-4 flex gap-20 items-center py-1">
                    <div className="sm:w-11 sm:h-11 w-10 h-10  bg-gray-600 rounded-full"></div>
                    <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
                    <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
                    <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>
                    <div className="w-20 sm:w-24 h-6 rounded-full bg-gray-600"></div>{" "}
                    <div className="ml-auto flex gap-2 items-center rounded-full ">
                      <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoader;
