import { BsArrowDown, BsArrowUp, BsPlus } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineCloudDownload } from "react-icons/md";
import { LuEdit } from "react-icons/lu";
import moment from "moment/moment";
import {
  deleteTournament,
  getTournaments,
  updateRunningStatus,
  updateTourStatus,
} from "../../redux/actions/tournamentAction";
import { getGames } from "../../redux/actions/gameAction";

import NewTour from "./NewTour";
import Layout from "../../layouts";
import AddLeague from "./AddLeague";
import Badge from "../../components/Badge";
import Toggle from "../../components/Toggle";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import ShowOption from "../../components/ShowOption";
import TableImage from "../../components/TableImage";
import ConfrimationModal from "../../components/ConfrimationModal";
import { useNavigate } from "react-router-dom";
import PlayButton from "../../components/PlayButton";
import VideoPopUp from "../../components/VideoPopUp";
import TableLoader from "../../components/Skeleton/TableLoader";
import { FcExpired } from "react-icons/fc";
import DateFigure from "../../components/FomatDate";
import { ExportUserCSV } from "../../redux/actions/userAction";
import { tournament_csv_export } from "../../utils/endpoints";
import { debounce } from "lodash";

const Tournaments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    videoModal: false,
    activeTab: "upcoming",
    updateRunningStatus: "",
    leagueModal: false,
  });
  const [editData, setEditData] = useState();
  const [game, setGame] = useState();
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "startDateTime",
    order: "desc",
    runningStatus: "upcoming",
  });
  const [refetch, setrefetch] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("selectGame")) {
      setGame(localStorage.getItem("selectGame"));
      localStorage.setItem("selectGame", "");
    }
  }, []);

  const { tournaments } = useSelector((state) => state.tournamentReducer);
  const { results, imageUrl, pagination } = tournaments;
  const { games } = useSelector((state) => state.gameReducer);

  // Handle Modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData();
    setModals({ ...modals, [name]: false });
  };

  // Api Handles
  const handleDeleteTour = () => {
    dispatch(
      deleteTournament(editData._id, params, () =>
        handleCloseModal("deleteModal")
      )
    );
  };
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateTourStatus(event.target.id, payload, params));
  };

  // Other Handles

  const handleTabs = (value) => {
    // setGameModeFilter('')
    setModals({ ...modals, activeTab: value ? value : "upcoming" });
  };

  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(tournament_csv_export));
  };

  // Pagination Logic

  const handlePrev = () =>
    params.page !== 1 &&
    setparams({
      ...params,
      page: params.page - 1,
    });
  const handleForw = () =>
    params.page <= pagination?.totalPages &&
    setparams({
      ...params,
      page: params.page + 1,
    });

  // Hnalde Update running status
  const handleRunningStatus = (event) => {
    dispatch(
      updateRunningStatus(
        modals.updateRunningStatus,
        {
          runningStatus: event.target.value,
        },
        params,
        () => setModals({ ...modals, updateRunningStatus: "" })
      )
    );
  };

  // useEffect
  useEffect(() => {
    dispatch(getTournaments(params));
    dispatch(getGames());
    setTimeout(() => handleOpenModal("skeleton"), 800);
  }, [dispatch, params, refetch]);

  // sorting logic
  const entryFee = [
    {
      id: 1,
      name: "Coin",
    },
    {
      id: 2,
      name: "Rupee",
    },
  ];

  const gameMode = [
    {
      id: 1,
      name: "Solo",
    },
    {
      id: 2,
      name: "Squad",
    },
    {
      id: 3,
      name: "Duo",
    },
  ];

  const [entryFeeFilter, setEntryFeeFilter] = useState({});
  // const [gameModeFilter, setGameModeFilter] = useState({})
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);
  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Tournaments" />

      {/* Table Content */}
      <section className="w-full relative pb-0 bg-secondary p-3 mt-2 sm:mt-3 rounded shadow ">
        {/* search & button */}
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-3 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="Tournament"
            handleChange={(event) => {
              setGame("");
              handleDebouncedChange(event);
            }}
          />

          <div className="sm:flex grid grid-cols-2 gap-2">
            <select
              value={entryFeeFilter}
              id="type"
              onChange={(event) => {
                // setSearchValue("");
                setEntryFeeFilter(event.target.value);
                if (event.target.value !== "") {
                  setparams({
                    ...params,
                    entryFeeType: event.target.value.toLocaleLowerCase(),
                  });
                } else {
                  delete params?.entryFeeType;
                  setrefetch(!refetch);
                }
                // handleSortEntryFee(event.target.value);
              }}
              className=" outline-none bg-select border border-color rounded py-1 px-2 appearance-none tracking-wider text-sm"
            >
              <option value="">Entry Fee Type</option>
              {entryFee?.map((game) => (
                <option key={game} value={game.name}>
                  {game.name}
                </option>
              ))}
            </select>
            <select
              value={game}
              id="type"
              onChange={(event) => {
                // setSearchValue("");
                setGame(event.target.value);
                if (event.target.value !== "") {
                  setparams({
                    ...params,
                    gameId: event.target.value,
                  });
                } else {
                  delete params?.gameId;
                  setrefetch(!refetch);
                }
              }}
              className=" outline-none bg-select border border-color rounded py-1 px-2 appearance-none tracking-wider text-sm"
            >
              <option value="">Select Game</option>
              {games.results &&
                games.results.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.name}
                  </option>
                ))}
            </select>
            <Button
              title={`Add Tournament`}
              icon={<BsPlus />}
              event={() => handleOpenModal("formModal")}
            />
            {results?.length !== 0 && (
              <Button
                title={`Export`}
                icon={<MdOutlineCloudDownload />}
                event={downloadDataInCsv}
              />
            )}
            {/* <Button
              title={`Add League Tournament`}
              icon={<BsPlus />}
              event={() => handleOpenModal('leagueModal')}
            /> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-3 overflow-y-hidden  border-gray-200 whitespace-nowrap ">
          <button
            onClick={() => {
              handleTabs("upcoming");
              setparams({
                ...params,
                runningStatus: "upcoming",
              });
            }}
            className={`inline-flex items-center h-10 px-2 py-2 -mb-px text-center ${
              modals.activeTab === "upcoming"
                ? "text-color  border-b-2 border-color"
                : "hover:text-emerald-500 text-gray-500"
            }  bg-transparent sm:px-4 -px-1  whitespace-nowrap focus:outline-none`}
          >
            Upcoming
          </button>

          <button
            onClick={() => {
              handleTabs("running");
              setparams({
                ...params,
                runningStatus: "running",
              });
            }}
            className={`inline-flex items-center h-10 px-2 py-2 -mb-px text-center ${
              modals.activeTab === "running"
                ? "text-color  border-b-2 border-color"
                : "hover:text-emerald-500 text-gray-500"
            }  bg-transparent sm:px-4 -px-1  whitespace-nowrap focus:outline-none`}
          >
            Running
          </button>

          <button
            onClick={() => {
              handleTabs("completed");
              setparams({
                ...params,
                runningStatus: "completed",
              });
            }}
            className={`inline-flex items-center h-10 px-2 py-2 -mb-px text-center ${
              modals.activeTab === "completed"
                ? "text-color  border-b-2 border-color"
                : "hover:text-emerald-500 text-gray-500"
            }  bg-transparent sm:px-4 -px-1  whitespace-nowrap focus:outline-none`}
          >
            Completed
          </button>
          <button
            onClick={() => {
              handleTabs("all");
              delete params.runningStatus;
              setrefetch(!refetch);
            }}
            className={`inline-flex items-center h-10 px-2 py-2 -mb-px text-center ${
              modals.activeTab === "all"
                ? "text-color  border-b-2 border-color"
                : "hover:text-emerald-500 text-gray-500"
            }  bg-transparent sm:px-4 -px-1  whitespace-nowrap focus:outline-none`}
          >
            All
          </button>
        </div>

        {results?.length === 0 ? (
          <div className="text-center py-16">No Record Found</div>
        ) : (
          <>
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg ">
                          Banner
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Tournament
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          TournamentID
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Game
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Type
                        </th>
                        {/* <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Link
                        </th> */}
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Map
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Entry Fee
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "entryFee",
                                order: "desc",
                              });
                            }}
                          >
                            <BsArrowUp />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "entryFee",
                                order: "asc",
                              });
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Entry Fee Type
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Running Status
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Status
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Time
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "startDateTime",
                                order: "desc",
                              });
                            }}
                          >
                            <BsArrowUp />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "startDateTime",
                                order: "asc",
                              });
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tr-lg ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {results?.map((item, index) => {
                        const {
                          name,
                          entryFee,
                          type,
                          prizePool,
                          _id,
                          gameMode,
                          map,
                          banner,
                          gameName,
                          totalSlots,
                          runningStatus,
                          status,
                          entryFeeType,
                          teamCounts,
                        } = item;

                        const isExpired =
                          new Date().getTime() >
                          new Date(item.endDateTime).getTime();

                        return (
                          <tr
                            key={_id}
                            className={`${index % 2 !== 0 && "table-head"} `}
                          >
                            <td className="px-4  text-gray-900">
                              <TableImage
                                src={`${imageUrl}${banner}`}
                                alt={name}
                              />
                            </td>
                            <td className="px-4 capitalize py-1.5 sm:py-3">
                              <div className=" flex items-center mb-2 gap-2">
                                {name}{" "}
                                {isExpired && <FcExpired className="text-lg" />}
                              </div>
                              <div className="flex items-center gap-1.5">
                                Mode :
                                <Badge title={gameMode} />
                              </div>
                              <div className="flex items-center gap-1.5">
                                Slots :
                                <Badge title={totalSlots} />
                              </div>
                              <div className="flex items-center gap-1.5">
                                Total Teams :
                                <Badge title={teamCounts} />
                              </div>
                            </td>
                            <td className="px-4 py-3">{_id}</td>
                            <td className="px-4 py-3">{gameName}</td>
                            <td className="px-4 py-1.5 sm:py-2">{type}</td>
                            {/* <td className="px-4 py-1.5 sm:py-2">
                                <PlayButton
                                  event={() => {
                                    setEditData(item);
                                    handleOpenModal("videoModal");
                                  }}
                                />
                              </td> */}
                            <td className="px-4 py-1.5 sm:py-2">{map}</td>
                            <td className="px-4 py-1.5 sm:py-2">
                              <div className="flex items-center gap-2">
                                {" "}
                                Entry :
                                {entryFeeType === "rupee" ? (
                                  <span className="text-xs text-color capitalize ">
                                    {`₹ ${Number(entryFee).toFixed(2)}`}
                                  </span>
                                ) : entryFeeType === "coin" ? (
                                  <div className="flex items-center flex-row">
                                    <img
                                      alt="coin"
                                      src={require("../../assets/coin.png")}
                                      style={{ height: 15, width: 15 }}
                                    />
                                    <span className="text-xs text-color capitalize ml-[5px]">
                                      {` ${Number(entryFee).toFixed(0)}`}
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* <Badge title={`₹ ${entryFee} `} /> */}
                              </div>
                              <div className="flex items-center gap-2">
                                {" "}
                                Prize Pool :{" "}
                                {/* {entryFeeType === 'rupee' ? ( */}
                                <span className="text-xs text-color capitalize ">
                                  {`₹ ${Number(prizePool).toFixed(2)}`}
                                </span>
                                {/* ) : entryFeeType === 'coin' ? ( */}
                                {/* <div className="flex items-center flex-row">
                                      <img
                                        src={require('../../assets/coin.png')}
                                        style={{ height: 15, width: 15 }}
                                      />
                                      <span className="text-xs text-color capitalize ml-[5px]">
                                        {` ${Number(prizePool).toFixed(0)}`}
                                      </span>
                                    </div> */}
                                {/* ) : ( */}
                                {/* )} */}
                                {/* <Badge
                                    title={`₹ ${
                                      entryFeeType == 'rupee'
                                        ? Number(prizePool).toFixed(2)
                                        : Number(prizePool).toFixed(0)
                                    } `}
                                  /> */}
                              </div>
                            </td>
                            <td
                              className="px-4 py-1.5 sm:py-2 text-color capitalize"
                              align="center"
                            >
                              {entryFeeType === "rupee" ? (
                                <span style={{ fontSize: 16, color: "#fff" }}>
                                  ₹
                                </span>
                              ) : entryFeeType === "coin" ? (
                                <img
                                  alt="coin"
                                  src={require("../../assets/coin.png")}
                                  style={{ height: 25, width: 25 }}
                                />
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="px-4  py-1.5 sm:py-2">
                              <div className="flex capitalize items-center gap-2">
                                {modals.updateRunningStatus === _id ? (
                                  <select
                                    value={runningStatus}
                                    onChange={handleRunningStatus}
                                    className="bg-select rounded p-0.5 outline-none"
                                  >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="running">Running</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                ) : (
                                  runningStatus
                                )}

                                <span
                                  onClick={() =>
                                    setModals({
                                      ...modals,
                                      updateRunningStatus:
                                        modals.updateRunningStatus === _id
                                          ? ""
                                          : _id,
                                    })
                                  }
                                  className="cursor-pointer text-sm text-color"
                                >
                                  <LuEdit />
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-1.5 sm:py-2 text-color capitalize">
                              <Toggle
                                _id={_id && _id}
                                value={status}
                                handleChange={handleStatusUpdate}
                              />
                            </td>
                            <td className="px-4 flex flex-col items-center text-[9px] py-1.5 sm:py-2">
                              <DateFigure time={item.startDateTime} />
                              <span> To</span>
                              <DateFigure time={item.endDateTime} />
                            </td>
                            <td className="px-4 text-center">
                              <ShowOption
                                handleDelete={() => {
                                  handleOpenModal("deleteModal");
                                  setEditData(item);
                                }}
                                handleView={() => {
                                  if (game != undefined && game.trim() != "") {
                                    localStorage.setItem("selectGame", game);
                                  }

                                  navigate(
                                    `/tournaments/${name.replace(" ", "-")}`,
                                    { state: _id }
                                  );
                                }}
                                // handleViewTeam={() => {
                                //   navigate(`/${_id}/teams`, {
                                //     state: {
                                //       title: `Tournament name : ${name}`,
                                //       query: `tournamentId=${_id}`,
                                //     },
                                //   });
                                // }}
                                handleEdit={
                                  runningStatus === "upcoming"
                                    ? () => {
                                        setEditData(item);
                                        handleOpenModal("formModal");
                                      }
                                    : ""
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  handlePrev={handlePrev}
                  from={(params.page - 1) * pagination?.pageSize}
                  to={params.page * pagination?.pageSize}
                  total={pagination?.totalItems}
                  handleForw={handleForw}
                />
              </>
            ) : (
              <TableLoader />
            )}
          </>
        )}
      </section>

      {/* Add & Update Modal */}
      {modals.formModal && (
        <NewTour
          editData={editData}
          imageUrl={imageUrl}
          params={params}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}

      {/* {modals.leagueModal && (
        <AddLeague handleCloseModal={() => handleCloseModal("leagueModal")} />
      )} */}

      {/* Delete Modal */}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteTour}
          title="Tournament"
        />
      )}

      {/* Video Popup */}
      {modals.videoModal && (
        <VideoPopUp
          src={editData?.streamingLink}
          handleCancel={() => handleCloseModal("videoModal")}
        />
      )}
    </div>
  );
};

export default Layout(Tournaments);
