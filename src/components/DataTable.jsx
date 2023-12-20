import React from "react";

const DataTable = (props) => {
  const { columns, data } = props;
  return (
    <div className="table-container">
      <table className="w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="rounded-t-2xl">
            {columns.map((item) => {
              return (
                <th
                  key={item}
                  id={item.selector}
                  className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm bg-[rgb(226,225,239)]  "
                >
                  {item.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-xs relative h-full overflow-y-auto">
          {data.map((item, i) => {
            return (
              <tr
                key={i}
                className={`${i % 2 !== 0 && "bg-[rgb(248,248,252)]"} border-b`}
              >
                {Object.keys(item).map((val) => {
                  return val !== "id" && <td>{item[val]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
