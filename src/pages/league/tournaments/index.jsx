import React, { useState, useEffect } from "react";
import Layout from "../../../layouts";
import Heading from "../../../components/Heading";
import SearchBox from "../../../components/SearchBox";
import Button from "../../../components/Button";
import { BsArrowDown, BsArrowUp, BsPlus } from "react-icons/bs";
import TableLoader from "../../../components/Skeleton/TableLoader";
import {
  deleteLeagueTournament,
  deleteStage,
  getLeagueTour,
  updateLeagueTourStatus,
  updateLeagurTourRunningStatus,
  updateStageStatus,
} from "../../../redux/actions/leagueAction";
import { useDispatch, useSelector } from "react-redux";
import Toggle from "../../../components/Toggle";
import ShowOption from "../../../components/ShowOption";
import ConfrimationModal from "../../../components/ConfrimationModal";
import Pagination from "../../../components/Pagination";
import NewLeagueTour from "./NewLeagueTour";
import Badge from "../../../components/Badge";
import TableImage from "../../../components/TableImage";
import { FcExpired } from "react-icons/fc";
import DateFigure from "../../../components/FomatDate";
import { LuEdit } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { ExportUserCSV } from "../../../redux/actions/userAction";
import { league_csv_export } from "../../../utils/endpoints";

const LeagueTournaments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refetch, setrefetch] = useState(false);
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
  });

  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    videoModal: false,
    ppModal: false,
    activeTab: "all",
    updateRunningStatus: false,
  });
  const [editData, setEditData] = useState();
  const { tourData, fetchLoader } = useSelector((state) => state.leagueReducer);
  const { results, imageUrl, pagination } = tourData;

  // handle modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData("");
    setModals({ ...modals, [name]: false });
  };

  // Remove Status
  const handleDeleteLeagueTour = () => {
    dispatch(
      deleteLeagueTournament(editData._id, () =>
        handleCloseModal("deleteModal")
      ),
      params
    );
  };

  // Status Update
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateLeagueTourStatus(event.target.id, payload, params));
  };

  // Hnalde Update running status
  const handleRunningStatus = (event) => {
    dispatch(
      updateLeagurTourRunningStatus(
        modals.updateRunningStatus,
        {
          runningStatus: event.target.value,
        },
        () => setModals({ ...modals, updateRunningStatus: "" }),
        params
      )
    );
  };

  // Other Handles

  // handle tabs
  const handleTabs = (value) => {
    // setGameModeFilter('')
    setModals({ ...modals, activeTab: value ? value : "all" });
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
  useEffect(() => {
    dispatch(getLeagueTour(params));
  }, [dispatch, params, refetch]);
  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(league_csv_export));
  };
  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="League Tournaments" />
      <section className="w-full relative bg-secondary p-3 pb-0 mt-1.5 sm:mt-3 rounded shadow ">
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="League Tounament"
            handleChange={(event) => {
              setparams({
                ...params,
                search: event.target.value,
              });
            }}
          />
          <span className="grid sm:flex grid-cols-2 gap-2">
            <Button
              title={`Export`}
              icon={<BsPlus className="text-xl" />}
              event={downloadDataInCsv}
            />
            <Button
              title={`Add League Tournament`}
              icon={<BsPlus className="text-xl" />}
              event={() => handleOpenModal("formModal")}
            />
          </span>
        </div>

        {/* Table */}
        {fetchLoader ? (
          <TableLoader />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex overflow-x-auto mb-3 overflow-y-hidden  border-gray-200 whitespace-nowrap ">
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
            </div>
            <div className="table-container">
              <table className="w-full down  text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg ">
                      Banner
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Tournament
                    </th>{" "}
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Game
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Type
                    </th>
                    {/* <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Link
                        </th> */}
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
                {results?.length > 0 ? (
                  <tbody className="text-xs relative h-full overflow-y-auto">
                    {results?.map((item, index) => {
                      const {
                        name,
                        entryFee,
                        type,
                        prizePool,
                        _id,
                        gameMode,
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
                          </td>
                          <td className="px-4 py-3">{gameName}</td>
                          <td className="px-4 py-1.5 sm:py-2">{type}</td>

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
                                    src={require("../../../assets/coin.png")}
                                    style={{ height: 15, width: 15 }}
                                  />
                                  <span className="text-xs text-color capitalize ml-[5px]">
                                    {` ${Number(entryFee).toFixed(0)}`}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {" "}
                              Prize Pool : {/* {entryFeeType === 'rupee' ? ( */}
                              <span className="text-xs text-color capitalize ">
                                {`₹ ${Number(prizePool).toFixed(2)}`}
                              </span>
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
                                src={require("../../../assets/coin.png")}
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
                                // if (game != undefined && game.trim() != "") {
                                //   localStorage.setItem("selectGame", game);
                                // }

                                navigate(
                                  `/league/tournaments/${name.replace(
                                    " ",
                                    "-"
                                  )}`,
                                  { state: _id }
                                );
                              }}
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
                ) : (
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td
                        className="w-full text-center mx-auto py-12"
                        colspan="10"
                      >
                        <img
                          className="w-32 h-32 mx-auto"
                          src="https://res.cloudinary.com/daqsjyrgg/image/upload/v1690261234/di7tvpnzsesyo7vvsrq4.svg"
                          alt=" empty states"
                        />
                        <p className=" font-medium text-lg text-center">
                          No league tournament available.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                )}
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
        )}
      </section>

      {/*--------  Modals -------- */}
      {modals.formModal && (
        <NewLeagueTour
          editData={editData}
          imageUrl={imageUrl}
          params={params}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteLeagueTour}
          title="League Tournament"
        />
      )}
    </div>
  );
};

export default Layout(LeagueTournaments);
