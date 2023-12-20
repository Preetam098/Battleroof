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
import ShowOption from "../../components/ShowOption";
import TableLoader from "../../components/Skeleton/TableLoader";

const GamePlayers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, query, gameBetAmount } = useLocation().state;

  const [Skeleton, setSkeleton] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { gamePlayerLists } = useSelector((state) => state.gameReducer);
  const [playerList, setPlayerList] = useState([]);
  useEffect(() => {
    if (gamePlayerLists !== undefined) {
      setPlayerList(gamePlayerLists.player);
    }
  }, [gamePlayerLists]);

  // Handle Update Rank

  // Other Handles
  const filteredData = playerList?.filter(
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
  const totalItems = playerList?.length;
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

  const betAmountData = playerList.filter((v) => v.betAmount === gameBetAmount);

  return (
    <section className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      {/* Top */}
      <div className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
        />
        Game Player By <div className=" text-sm"> {title} </div>
      </div>
      <section className="w-full relative bg-secondary p-3 pb-0 my-2 sm:my-3 rounded shadow ">
        {betAmountData?.length === 0 ? (
          <div className="text-center py-22">No Data Found</div>
        ) : (
          <>
            {/* search & button */}
            <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-3 sm:items-center sm:justify-between">
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
            </div>

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

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Player 1 Name
                        </th>
                        {/* <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Player 1 Image
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Player 2 Name
                        </th>
                        {/* <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Player 2 Image
                        </th> */}
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Game Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs capitalize relative h-full overflow-y-auto">
                      {(searchValue ? filteredData : playerList)
                        ?.slice(trimStart, trimEnd)
                        .map((item, index) => {
                          const {
                            _id,
                            game,
                            gameStatus,
                            playerName,
                            betAmount,
                            user,
                          } = item;

                          const competitor = item?.competitor;
                          return betAmountData.length > 0 ? (
                            <tr
                              key={_id}
                              className={`${index % 2 !== 0 && "table-head"} `}
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                navigate(
                                  `/game-players-details/${game?.name}`,
                                  {
                                    state: {
                                      title: `User name : ${game?.name}`,
                                      query: `${_id}`, // _id,
                                      gameItem: item,
                                    },
                                  }
                                );
                              }}
                            >
                              <td className="px-4 py-2 text-color">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2">
                                <img
                                  src={
                                    game?.gameImage
                                      ? `${game?.gameImage}`
                                      : Team
                                  }
                                  alt=""
                                  className="sm:w-9 sm:h-9 w-8 h-8 rounded-full object-cover object-top"
                                />
                              </td>
                              <td className="px-4 py-2 text-color">
                                {game?.name}
                              </td>
                              <td className="px-4 py-2 text-color">
                                {betAmount}
                              </td>{" "}
                              <td className="px-4 py-2 text-color">
                                {playerName}
                              </td>
                              <td className="px-4 py-2 text-color">
                                <img
                                  src={
                                    user?.profilePicture
                                      ? `https://api.battleroof.app/public/uploads/users/${user?.profilePicture}`
                                      : Team
                                  }
                                  alt=""
                                  className="sm:w-9 sm:h-9 w-8 h-8 rounded-full object-cover object-top"
                                />
                              </td>
                              <td className="px-4 py-2 text-color">
                                {competitor?.name}
                              </td>
                              <td className="px-4 py-2 text-color">
                                <img
                                  src={
                                    competitor?.profilePicture
                                      ? `https://api.battleroof.app/public/uploads/users/${competitor?.profilePicture}`
                                      : Team
                                  }
                                  alt=""
                                  className="sm:w-9 sm:h-9 w-8 h-8 rounded-full object-cover object-top"
                                />
                              </td>
                              <td className="px-4 py-2 text-color">
                                {gameStatus}
                              </td>
                              {/* <td className="px-4 text-center  sm:relative ">
                                <ShowOption
                                  handleView={() => {
                                      navigate(`/game-players-details/${game?.name}`, {
                                          state: {
                                            title: `User name : ${game?.name}`,
                                            query: `${_id}`, // _id, 
                                          },
                                        });
                                      }}
                                />
                              </td> */}
                            </tr>
                          ) : null;
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

export default Layout(GamePlayers);
