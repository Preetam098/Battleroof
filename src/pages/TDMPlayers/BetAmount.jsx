import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

import Team from "../../assets/Team.gif";
import Layout from "../../layouts";
import { gamePlayerList } from "../../redux/actions/gameAction";
import SearchBox from "../../components/SearchBox";
import { MdOutlineCloudDownload } from "react-icons/md";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import TableLoader from "../../components/Skeleton/TableLoader";

const BetAmount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, query, gameItem, gameImageUrl } = useLocation().state;
  const [Skeleton, setSkeleton] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { gamePlayerLists } = useSelector((state) => state.gameReducer);

  // Other Handles
  const filteredData = gameItem?.betAmount?.filter(
    (item) =>
      item.name && item.name?.toLowerCase().includes(searchValue?.toLowerCase())
  );
  const downloadDataInCsv = () => {
    var data = [];
    var rows = document.querySelectorAll("table.down tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }

      data.push(row.join(","));
    }

    // Create downloadAble
    const a = document.createElement("a");
    const file = new Blob([data.join("\n")], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    a.download = "Data.csv";
    a.click();
  };

  // Pagination Logic
  const perPageItems = 10;
  const totalItems = gameItem?.betAmount?.length;
  const trimStart = (currentPage - 1) * perPageItems;
  const trimEnd = trimStart + perPageItems;
  const handlePrev = () => currentPage !== 1 && setCurrentPage(currentPage - 1);
  const handleForw = () =>
    trimEnd <= totalItems && setCurrentPage(currentPage + 1);

  // useEffect
  useEffect(() => {
    dispatch(gamePlayerList(query));
    setTimeout(() => setSkeleton(true), 800);
  }, [dispatch, query]);

  return (
    <section className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      {/* Top */}
      <div className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
        />
        Bet Amount by <div className=" text-sm"> {title} </div>
      </div>
      <section className="w-full relative bg-secondary p-3 pb-0 my-2 sm:my-3 rounded shadow ">
        {gameItem?.betAmount?.length === 0 ? (
          <div className="text-center py-22">No Team Found</div>
        ) : (
          <>
            {/* search & button */}
            {/* <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-3 sm:items-center sm:justify-between">
              <SearchBox
                placeholder="Team"
                value={searchValue}
                handleChange={(event) => setSearchValue(event.target.value)}
              />

              <Button
                title={`Export`}
                event={downloadDataInCsv}
                icon={<MdOutlineCloudDownload className="text-xl" />}
              />
            </div> */}

            {/* Table Content */}
            {Skeleton ? (
              <>
               <div className="table-container">
                  <table className="w-full down text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 w-10 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg ">
                          Sr.No
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Game Image
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Game Name
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Bet Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs capitalize relative h-full overflow-y-auto">
                      {(searchValue ? filteredData : gameItem?.betAmount)
                        ?.slice(trimStart, trimEnd)
                        .map((item, index) => {
                          return (
                            <tr
                              className={`${index % 2 !== 0 && "table-head"} `}
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                navigate(`/${gameItem?._id}/gamePlayers`, {
                                    state: {
                                      title: `User name : ${gameItem?.name} (${item})`,
                                      query: gameItem?._id,
                                      gameBetAmount: item,
                                    },
                                  });
                              }}
                            >
                              <td className="px-4 py-2 text-color">{index + 1}</td>
                              <td className="px-4 py-2">
                                <img
                                  src={gameItem?.image ? `${gameImageUrl}${gameItem?.image}` : Team}
                                  alt=""
                                  className="sm:w-9 sm:h-9 w-8 h-8 rounded-full object-cover object-top"
                                />
                              </td>
                              <td className="px-4 py-2 text-color">{gameItem?.name}</td>
                              <td className="px-4 py-2 text-color">{item}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  handlePrev={handlePrev}
                  from={trimStart}
                  to={trimEnd}
                  total={totalItems}
                  handleForw={handleForw}
                />
              </>
            ) : (
              <TableLoader />
            )}
          </>
        )}
      </section>
    </section>
  );
};

export default Layout(BetAmount);
