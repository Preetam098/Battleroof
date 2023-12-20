import { BiTrashAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../../layouts";

import Team from "../../../assets/Team.gif";
import DateFigure from "../../../components/FomatDate";

import {
  getTourStages,
  updateLobbyDetails,
  updateLobbyStatus,
  updateLobbyTeamsStatus,
  viewLeaguTournament,
  viewroundGroup,
} from "../../../redux/actions/leagueAction";

import ButtonLoader from "../../../components/ButtonLoader";
import DeclareResult from "./DeclareResult";
import { LuEdit } from "react-icons/lu";

const ViewRoundLobby = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const { lobbyData, loading, tourStage, viewtour } = useSelector(
    (state) => state.leagueReducer
  );
  const { data } = lobbyData;
  const [showDeclare, setshowDeclare] = useState(false);
  const [roomDetails, setRoomDetails] = useState({});
  const [modals, setModals] = useState({
    activeTab: "Overview",
    playersModal: false,
    teamDeleteConfirmation: false,
    stageModal: false,
    isDeclare: false,
    roundModal: false,
    stageData: {},
    groupModal: false,
    roundData: {},
    teamId: null,
    teamsModal: false,
    activeLobby: {},
    lobbyModal: false,
    updateRunningStatus: "",
  });

  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true });
  };

  const handleTabs = (value) => {
    setModals({ ...modals, activeTab: value ? value : "upcoming" });
  };
  const handleChange = (event) =>
    setRoomDetails({
      ...roomDetails,
      [event.target.name]: event.target.value,
    });

  // Overview Data
  const overview = [
    {
      name: "Name",
      value: data?.title,
    },
    {
      name: "Game Status",
      value: data?.runningStatus,
    },
    {
      name: "Room ID",
      value: data?.roomId || "-",
    },
    {
      name: "Room Password",
      value: data?.roomPassword || "-",
    },
    {
      name: "Result Status",
      value: data?.resultStatus ? "Declared" : "Not Decalared",
    },

    {
      name: "Starting Time",
      value: <DateFigure time={data?.startDateTime} />,
    },
    {
      name: "End Time",
      value: <DateFigure time={data?.endDateTime} />,
    },
  ];

  useEffect(() => {
    dispatch(viewroundGroup(state));
  }, [dispatch, state]);
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateLobbyDetails(state, roomDetails));
    event.target.reset();
  };
  useEffect(() => {
    if (data) {
      const { roomPassword, roomId } = data;
      setRoomDetails({ roomPassword, roomId });
      dispatch(getTourStages(data?.leagueTournamentId));
      dispatch(viewLeaguTournament(data?.leagueTournamentId));
    }
  }, [data, dispatch]);

  // Handle Tabs
  const tabs = () => {
    // eslint-disable-next-line default-case
    switch (modals.activeTab) {
      case "Overview":
        return (
          <>
            <div className="gap-4 grid sm:grid-cols-2">
              {overview.map((item) => {
                return (
                  <div className="flex bg-gray-900 py-3 px-4 text-xs uppercase rounded-sm justify-between">
                    <span className="text-gray-400">{item.name}</span>
                    <span className="capitalize">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </>
        );
      case "Teams":
        return (
          <>
            {data?.updatedStageGroupTeams?.length === 0 && (
              <div className="text-center">No Teams</div>
            )}
            <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data?.updatedStageGroupTeams?.map((item) => {
                return (
                  <div
                    key={item._id}
                    // onClick={() => {
                    //   handleOpenModal('playersModal')
                    // }}
                    className="overflow-hidden cursor-pointer rounded-sm  shadow-lg "
                  >
                    <div className="relative">
                      <img
                        className="object-cover h-44 w-full "
                        src={
                          item?.teams?.image
                            ? `${data?.teamImageUrl}${item?.teams?.image}`
                            : Team
                        }
                        alt={item?.teams?.name}
                        onClick={() => {
                          handleOpenModal("playersModal");
                        }}
                      />
                      <div
                        className="absolute top-2 right-2 bg-slate-400 h-6 w-6 items-center flex justify-center rounded z-30"
                        onClick={() => {
                          handleOpenModal("teamDeleteConfirmation");
                        }}
                      >
                        <span
                          title="Delete"
                          // onClick={handleDelete}
                          className="cursor-pointer text-lg"
                        >
                          <BiTrashAlt style={{ color: "red" }} />
                        </span>
                      </div>
                    </div>
                    <div className="px-3 bg-gray-300 py-2">
                      <h1 className="font-bold text-center text-gray-800 uppercase ">
                        {item?.teams?.name}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
    }
  };

  const handleRunningStatus = (event) => {
    dispatch(
      updateLobbyStatus(
        modals.updateRunningStatus,
        {
          runningStatus: event.target.value,
        },
        data?._id,
        () => {
          dispatch(viewroundGroup(state));
          setModals({ ...modals, updateRunningStatus: "" });
        }
      )
    );
  };
  const updateStatus = () => {
    const payload = data?.updatedStageGroupTeams?.map((item) => {
      return {
        promotedStatus: 1,
        teamId: item?.teamId,
      };
    });
    dispatch(updateLobbyTeamsStatus(data?._id, payload));
  };

  return (
    <div className="pb-6">
      <section className="tracking-wider h-full">
        <div className="w-full relative table-container overflow-y-scroll bg-secondary rounded shadow">
          {/* Banner */}
          <section className="relative rounded-t-lg block h-44 sm:h-52 md:h-60 lg:h-72">
            <div
              className="absolute top-0 rounded-t-lg w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url("${viewtour?.imageUrl}${
                  tourStage?.find((item) => item?.stageId === data?.stageId)
                    ?.banner
                }")`,
              }}
            >
              <span
                id="blackOverlay"
                className="w-full sm:p-4 p-2.5 h-full flex flex-col justify-between rounded-t-lg absolute bg-modal "
              >
                {/* Back Button */}
                <div className="sm:text-lg capitalize gap-2 sm:gap-2.5 items-center flex   text-white">
                  <IoIosArrowBack
                    onClick={() => navigate(-1)}
                    className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
                  />
                  {data?.title}
                </div>

                {/* Prize Pool */}
                <div className="flex justify-between items-center text-white">
                  <div>
                    <div>
                      {" "}
                      ₹{" "}
                      {
                        tourStage?.find(
                          (item) => item.stageId === data?.stageId
                        )?.prizePool
                      }
                    </div>
                    <div className="text-sm text-gray-100">Prize Pool</div>
                  </div>
                </div>
              </span>
            </div>
          </section>

          <div className={`sm:px-4 grid items-center sm:grid-cols-2 px-3 my-2`}>
            {data?.runningStatus === "running" ||
            data?.runningStatus === "completed" ? (
              <form
                onSubmit={handleSubmit}
                className="mt-3 w-full divide-x items-center text-xs flex rounded-sm text-white"
              >
                <input
                  type="text"
                  value={data?.roomId === "null" ? "" : data?.roomId}
                  name="roomId"
                  required
                  onChange={handleChange}
                  placeholder="Enter Room Id"
                  className="md:py-2.5 py-2 w-full bg-gray-600 text-white placeholder:text-xs pl-4 pr-8 outline-none  rounded-l-full"
                />
                <input
                  type="text"
                  required
                  value={
                    data?.roomPassword === "null" ? "" : data?.roomPassword
                  }
                  name="roomPassword"
                  onChange={handleChange}
                  placeholder=" Enter Password"
                  className="md:py-2.5 py-2 w-full bg-gray-600 text-white placeholder:text-xs pl-4 pr-8 outline-none "
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="sm:px-5 px-3 md:py-2.5 py-2 uppercase  bg-button rounded-r-full"
                >
                  {loading ? <ButtonLoader /> : "Update"}
                </button>
              </form>
            ) : (
              <div></div>
            )}

            <div div className="mt-3 flex gap-3 text-xs sm:ml-auto">
              {/* Declare result & slots */}
              <div className="flex capitalize items-center gap-2">
                {modals.updateRunningStatus === data?._id ? (
                  <select
                    value={data?.runningStatus}
                    onChange={handleRunningStatus}
                    className="bg-select rounded p-0.5 outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  data?.runningStatus
                )}

                <span
                  onClick={() =>
                    setModals({
                      ...modals,
                      updateRunningStatus:
                        modals.updateRunningStatus === data?._id
                          ? ""
                          : data?._id,
                    })
                  }
                  className="cursor-pointer text-sm text-color"
                >
                  <LuEdit />
                </span>
              </div>
              {data?.runningStatus === "completed" &&
                data?.updatedStageGroupTeams?.length > 0 && (
                  <button
                    onClick={updateStatus}
                    // disabled={data?.runningStatus !== "completed"}
                    className="bg-button  px-4 text-white disabled:bg-gray-200 disabled:text-black tracking-wider rounded-full md:py-2.5 py-2"
                  >
                    {loading ? <ButtonLoader /> : "Update Teams Status"}
                  </button>
                )}
              {(data?.runningStatus === "running" ||
                data?.runningStatus === "completed") && (
                <>
                  <button
                    onClick={() => setshowDeclare(true)}
                    // disabled={data?.runningStatus !== "completed"}
                    className="bg-button  px-4 text-white disabled:bg-gray-200 disabled:text-black tracking-wider rounded-full md:py-2.5 py-2"
                  >
                    Declare Result
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex p-3 sm:p-4 overflow-x-auto overflow-y-hidden  border-gray-200 whitespace-nowrap ">
            {["Overview", "Teams"].map((item) => {
              return (
                <button
                  onClick={() => handleTabs(item)}
                  className={`inline-flex text-sm uppercase border-b-2 font-medium border-gray-700 items-center pb-2 text-center ${
                    modals.activeTab === item
                      ? "text-color   border-color"
                      : " text-gray-500"
                  }  bg-transparent px-5 whitespace-nowrap focus:outline-none`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* All Content */}
          <div className="px-3 sm:px-4 pb-7">{tabs()}</div>
        </div>
      </section>

      {/* modals */}
      {console.log(data)}
      {showDeclare && (
        <DeclareResult
          results={data?.updatedStageGroupTeams}
          // winners={200}
          isDeclare={data?.resultStatus}
          result={[]}
          tour_id={state}
          handleCloseModal={() => setshowDeclare(false)}
        />
      )}
    </div>
  );
};

export default Layout(ViewRoundLobby);
