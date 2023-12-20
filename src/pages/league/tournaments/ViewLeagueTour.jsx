import { BiTrashAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { BsCheck2Circle } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../../layouts";
import UpdateStage from "./UpdateStage";
import ManageState from "./ManageState";
import Team from "../../../assets/Team.gif";
import DateFigure from "../../../components/FomatDate";
import PlayButton from "../../../components/PlayButton";
import { teamList } from "../../../redux/actions/userAction";
import {
  getLeagueTourTeams,
  viewLeaguTournament,
} from "../../../redux/actions/leagueAction";
import Heading from "../../../components/Heading";
import ManageRound from "./ManageRound";
import ManageGroups from "./ManageGroups";
import Pagination from "../../../components/Pagination";
import ViewTeam from "../../teams/ViewTeam";
import ManageRoundMatch from "./ManageRoundMatch";
import NextRound from "./NextRound";

const ViewLeagueTour = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setparams] = useState({
    page: 1,
    pageSize: 12,
  });
  const { state } = useLocation();
  const { viewtour, leagueTeams } = useSelector((state) => state.leagueReducer);
  const { result: teams, pagination } = leagueTeams;
  const { result, imageUrl } = viewtour;
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
    roundsModal: false,
    stageId: null,
  });
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
  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true });
  };

  const handleTabs = (value) => {
    setModals({ ...modals, activeTab: value ? value : "upcoming" });
  };

  // Overview Data
  const overview = [
    {
      name: "Name",
      value: result?.name,
    },
    {
      name: "Game Name",
      value: result?.gameName,
    },

    {
      name: "Tournament Type",
      value: result?.type,
    },
    {
      name: "Tournament Status",
      value: result?.runningStatus,
    },
    {
      name: "Remaining Slot",
      value: result?.totalSlots - teams?.length,
    },
    {
      name: `Entry Fee`,
      value: `₹ ${result?.entryFee}`,
    },
    {
      name: "Mode",
      value: result?.gameMode,
    },
    {
      name: "Slots",
      value: result?.totalSlots,
    },
    {
      name: "Prize pool",
      value: `₹ ${result?.prizePool}`,
    },
    {
      name: "Starting Time",
      value: <DateFigure time={result?.startDateTime} />,
    },
    {
      name: "End Time",
      value: <DateFigure time={result?.endDateTime} />,
    },
    {
      name: "Registration Starting Time",
      value: <DateFigure time={result?.registrationStartedAt} />,
    },
    {
      name: "Registration End Time",
      value: <DateFigure time={result?.registrationEndedAt} />,
    },
  ];

  useEffect(() => {
    dispatch(viewLeaguTournament(state));
  }, [dispatch, state]);
  useEffect(() => {
    dispatch(getLeagueTourTeams(params, state));
  }, [dispatch, state, params]);

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
                    {item?.name === "Entry Fee" ? (
                      <div className="flex flex-row items-center">
                        <span className="text-gray-400">Entry Fee</span>
                        <div className="flex flex-row items-center ml-[5px]">
                          {"("}
                          {result?.entryFeeType == "rupee" ? (
                            <span className="text-gray-400">{"₹"}</span>
                          ) : result?.entryFeeType === "coin" ? (
                            <img
                              alt="coin"
                              src={require("../../../assets/coin.png")}
                              style={{ height: 15, width: 15 }}
                            />
                          ) : (
                            ""
                          )}
                          {")"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">{item.name}</span>
                    )}
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
            {teams?.length === 0 && <div className="text-center">No Teams</div>}
            <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teams?.map((item) => {
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
                            ? `${leagueTeams?.teamImageUrl}${item?.teams?.image}`
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
            {teams?.length > 0 && (
              <Pagination
                handlePrev={handlePrev}
                from={(params.page - 1) * pagination?.pageSize}
                to={params.page * pagination?.pageSize}
                total={pagination?.totalItems}
                handleForw={handleForw}
              />
            )}
          </>
        );

      case "Rules & Information":
        return (
          <div className="grid gap-4">
            <div>
              <Heading title={<div className="text-base">Rules</div>} />
              <div
                className="text-sm text-gray-300 tracking-wider"
                dangerouslySetInnerHTML={{ __html: result?.rules }}
              />
            </div>

            <div>
              <Heading title={<div className="text-base">Information</div>} />
              <div
                className="text-sm text-gray-300 tracking-wider"
                dangerouslySetInnerHTML={{ __html: result?.information }}
              />
            </div>
          </div>
        );

      case "Stage":
        return (
          <>
            <UpdateStage
              openNextRoundModal={(e) => {
                setModals({ ...modals, stageId: e, roundsModal: true });
              }}
              tourId={state}
              openGroupModal={(e) => {
                setModals({ ...modals, roundData: e, groupModal: true });
              }}
              openTeamModal={(e) =>
                setModals({ ...modals, teamId: e, teamsModal: true })
              }
              openLobbyModal={(e) => {
                setModals({ ...modals, activeLobby: e, lobbyModal: true });
              }}
              openRoundModal={(e) =>
                setModals({ ...modals, stageData: e, roundModal: true })
              }
            />
          </>
        );
    }
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
                backgroundImage: `url("${imageUrl}${result?.banner}")`,
              }}
            >
              <span
                id="blackOverlay"
                className="w-full sm:p-4 p-2.5 h-full flex flex-col justify-between rounded-t-lg absolute bg-modal "
              >
                {/* Back Button */}
                <div className="sm:text-lg capitalize gap-2 sm:gap-2.5 items-center flex   text-white">
                  <IoIosArrowBack
                    onClick={() => navigate("/league/tournaments")}
                    className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
                  />
                  {result?.name}
                </div>

                {/* Prize Pool */}
                <div className="flex justify-between items-center text-white">
                  <div>
                    <div> ₹ {result?.prizePool}</div>
                    <div className="text-sm text-gray-100">Prize Pool</div>
                  </div>

                  {result?.streamingLink && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      <a
                        href={result?.streamingLink}
                        target="_blank"
                        className="text-sm text-gray-400 cursor-pointer"
                        rel="noreferrer"
                      >
                        <PlayButton size="sm:text-5xl text-2.5xl" />
                      </a>
                      <span style={{ fontSize: 12 }}>Watch Live Streaming</span>
                    </div>
                  )}
                </div>
              </span>
            </div>
          </section>

          {/* Form */}
          <div
            className={`sm:px-4 grid items-center  sm:grid-cols-2 px-3 my-2`}
          >
            <div></div>
            <div className="mt-3 flex gap-3 text-xs sm:ml-auto">
              <button
                onClick={() => handleOpenModal("isDeclare")}
                className="bg-button  px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
              >
                Manage Stage
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex p-3 sm:p-4 overflow-x-auto overflow-y-hidden  border-gray-200 whitespace-nowrap ">
            {["Overview", "Teams", "Rules & Information", "Stage"].map(
              (item) => {
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
              }
            )}
          </div>

          {/* All Content */}
          <div className="px-3 sm:px-4 pb-7">{tabs()}</div>
        </div>
      </section>

      {/* modals */}
      {modals.isDeclare && (
        <ManageState
          results={teams?.results}
          winners={teams?.results?.length}
          result={result}
          tour_id={state}
          handleCloseModal={() => setModals({ ...modals, isDeclare: false })}
        />
      )}
      {modals.roundModal && (
        <ManageRound
          activeStageData={modals.stageData}
          tour_id={state}
          handleCloseModal={() => setModals({ ...modals, roundModal: false })}
        />
      )}
      {modals.groupModal && (
        <ManageGroups
          activeRoundData={modals.roundData}
          tour_id={state}
          handleCloseModal={() => setModals({ ...modals, groupModal: false })}
        />
      )}
      {modals.roundsModal && (
        <NextRound
          stageId={modals.stageId}
          tourId={state}
          handleCloseModal={() =>
            setModals({ ...modals, stageId: null, roundsModal: false })
          }
        />
      )}
      {modals?.teamsModal && (
        <ViewTeam
          handleClose={() => setModals({ ...modals, teamsModal: false })}
          teamId={modals.teamId}
        />
      )}
      {modals?.lobbyModal && (
        <ManageRoundMatch
          activeRoundData={modals.activeLobby}
          handleCloseModal={() => setModals({ ...modals, lobbyModal: false })}
        />
      )}
    </div>
  );
};

export default Layout(ViewLeagueTour);
