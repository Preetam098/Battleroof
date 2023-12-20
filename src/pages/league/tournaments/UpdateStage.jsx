import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStageRounds,
  getTourStages,
  getroundGroup,
  updateLobbyStatus,
} from "../../../redux/actions/leagueAction";
import DateFigure from "../../../components/FomatDate";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { FaAngleDown } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";
import Team from "../../../assets/Team.gif";
import ViewTeam from "../../teams/ViewTeam";
import { useNavigate } from "react-router-dom";
import { LuEdit } from "react-icons/lu";
import { updateRunningStatus } from "../../../redux/actions/tournamentAction";
import moment from "moment/moment";
const Roundtabs = ({
  defaultRoundTab,
  roundTeams,
  groupData,
  leagueTeams,
  openTeamModal,
  openLobbyModal,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="gap-4 grid sm:grid-cols-2 mb-3">
        {Object.keys(defaultRoundTab || {})
          ?.filter(
            (item) =>
              item === "endDate" ||
              item === "startDate" ||
              item === "name" ||
              item === "map" ||
              item === "format"
            // item === "rules"
          )
          ?.map((val, index) => {
            return (
              <div
                key={index}
                className="flex bg-gray-900 py-3 px-4 text-xs  rounded-sm justify-between"
              >
                <span className="text-gray-400 capitalize">{val}</span>

                {val === "startDate" || val === "endDate" ? (
                  <DateFigure time={defaultRoundTab[val]} />
                ) : (
                  <span className="capitalize">
                    {defaultRoundTab[val] || "-"}
                  </span>
                )}
              </div>
            );
          })}
      </div>
      {roundTeams?.data?.length === 0 ? (
        <div className="text-center py-3">No Groups</div>
      ) : (
        <>
          {groupData?.map((item, index) => {
            return (
              <Accordion key={index} transition transitionTimeout={200}>
                <AccordionItem header={item} key={index}>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigate(`${item?.title.replace(" ", "-")}`, {
                            state: item?._id,
                          });
                        }}
                        className="bg-button  px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
                      >
                        View Lobby
                      </button>
                      <button
                        disabled={moment().isSameOrAfter(item?.startDateTime)}
                        onClick={() => openLobbyModal(item)}
                        className="bg-button disabled:bg-gray-100 disabled:text-black disabled:opacity-40 disabled:cursor-not-allowed   px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
                      >
                        Update Lobby
                      </button>
                    </div>

                    <div className="w-full grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {item?.stageGroupTeams?.map((team) => {
                        return (
                          <div
                            key={team._id}
                            onClick={() => {
                              openTeamModal(team?.teamId);
                            }}
                            className="overflow-hidden cursor-pointer rounded-sm shadow-lg relative"
                          >
                            {/** Ribbon Component */}
                            <div className="absolute top-0 right-0 bg-gray-900 text-white py-1 px-3 z-10">
                              <span className="text-sm">
                                {item?.runningStatus === "completed" ? (
                                  <>
                                    {item?.promotedStatus === 1
                                      ? "Promoted"
                                      : "Eliminated"}
                                  </>
                                ) : (
                                  <>
                                    {item?.runningStatus === "running" ? (
                                      <>
                                        {item?.promotedStatus === 1
                                          ? "Promoted"
                                          : "Playing"}
                                      </>
                                    ) : (
                                      "Not started"
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="relative">
                              <img
                                className="object-cover h-44 w-full"
                                src={
                                  team?.teams?.image
                                    ? `${leagueTeams?.teamImageUrl}${team?.teams?.image}`
                                    : Team
                                }
                                alt={team?.teams?.name}
                                onClick={() => {
                                  // handleOpenModal("playersModal");
                                }}
                              />
                            </div>
                            <div className="px-3 bg-gray-300 py-2">
                              <h1 className="font-bold text-center text-gray-800 uppercase">
                                {team?.teams?.name}
                              </h1>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            );
          })}
        </>
      )}
    </>
  );
};
const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          {header?.title}

          <div className="ml-4 text-sm capitalize inline-flex items-center font-bold leading-sm  px-3 py-1 bg-gray-900 text-color rounded-full">
            {header?.runningStatus}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <FaAngleDown
            className={`ml-auto transition-transform duration-200 ease-out ${
              isEnter && "rotate-180"
            }`}
          />
        </div>
      </div>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full p-4 text-left hover-text-color ${
          isEnter && "bg-gray-900"
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-4" }}
  />
);
const UpdateStage = ({
  tourId,
  openRoundModal,
  openGroupModal,
  openTeamModal,
  openLobbyModal,
  openNextRoundModal,
}) => {
  const dispatch = useDispatch();
  const { tourStage, stageRound, roundTeams, leagueTeams } = useSelector(
    (state) => state.leagueReducer
  );

  useEffect(() => {
    // dispatch(getStages());
    dispatch(getTourStages(tourId));
  }, [dispatch, tourId]);
  const [groupData, setgroupData] = useState([]);
  const [defaultTab, setdefaultTab] = useState({});
  const [defaultRoundTab, setdefaultRoundTab] = useState({});
  useEffect(() => {
    setdefaultTab((tourStage && tourStage[0]) || {});
  }, [tourStage, dispatch, tourId]);
  useEffect(() => {
    if (defaultTab?.stageId) {
      dispatch(getStageRounds(tourId, defaultTab.stageId));
    }
  }, [defaultTab, tourId, dispatch]);
  useEffect(() => {
    setdefaultRoundTab((stageRound && stageRound[0]) || {});
  }, [stageRound]);
  useEffect(() => {
    if (defaultRoundTab?._id) {
      dispatch(getroundGroup(defaultRoundTab?._id));
    }
  }, [defaultRoundTab, dispatch]);
  useEffect(() => {
    if (roundTeams?.data?.length > 0) {
      setgroupData(roundTeams?.data);
    }
  }, [roundTeams?.data]);

  const tabs = () => {
    switch (defaultTab) {
      default:
        return (
          <>
            <div className="gap-4 grid sm:grid-cols-2">
              {Object.keys(defaultTab)
                ?.filter(
                  (item) =>
                    item === "endDate" ||
                    item === "startDate" ||
                    item === "winnerTeams" ||
                    item === "prizePool" ||
                    item === "round"

                  // item === "rules"
                )
                ?.map((val, index) => {
                  return (
                    <div
                      key={index}
                      className="flex bg-gray-900 py-3 px-4 text-xs  rounded-sm justify-between"
                    >
                      <span className="text-gray-400 capitalize">{val}</span>

                      {val === "startDate" || val === "endDate" ? (
                        <DateFigure time={defaultTab[val]} />
                      ) : (
                        <span className="capitalize">{defaultTab[val]}</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        );
    }
  };

  return (
    <div className="mb-7">
      {tourStage?.length > 0 ? (
        <>
          <ol className="flex items-center w-full  space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
            {tourStage?.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => setdefaultTab(item)}
                  className={`flex cursor-pointer items-center ${
                    defaultTab?.stage?.name === item?.stage?.name
                      ? "text-color   border-color"
                      : "text-gray-500"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border rounded-full shrink-0 ${
                      defaultTab?.stage?.name === item?.stage?.name
                        ? "text-color   border-color"
                        : "text-gray-500"
                    } `}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium ">{item?.stage?.name}</span>
                  {index !== tourStage.length - 1 && (
                    <svg
                      className="w-3 h-3 ml-2 sm:ml-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 12 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m7 9 4-4-4-4M1 9l4-4-4-4"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ol>
          <div div className="mt-3 flex justify-end gap-3 text-xs sm:ml-auto">
            {tourStage &&
              tourStage[tourStage?.length - 1]?._id !== defaultTab?._id && (
                <button
                  onClick={() => {
                    openNextRoundModal(defaultTab?._id);
                  }}
                  className="bg-button  disabled:bg-gray-100 disabled:text-black disabled:opacity-40 disabled:cursor-not-allowed   px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
                >
                  Update Round Teams
                </button>
              )}

            <button
              onClick={() => openRoundModal(defaultTab)}
              className="bg-button  px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
            >
              Manage Round
            </button>
          </div>
          <div className="pt-3 pb-7">{tabs()}</div>
          {/* <h3>Rules:</h3> */}
          <div className="flex bg-gray-900 py-3 px-4 text-xs  rounded-sm justify-between">
            <span className="text-gray-400 capitalize">Rules</span>
          </div>
          <div className="py-3 px-4">
            <span
              dangerouslySetInnerHTML={{
                __html: defaultTab?.rules,
              }}
            />
          </div>
          {stageRound?.length > 0 && (
            <>
              <ol className="flex items-center w-full  space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
                {stageRound?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => setdefaultRoundTab(item)}
                      className={`flex cursor-pointer items-center ${
                        defaultRoundTab?._id === item?._id
                          ? "text-color   border-color"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border rounded-full shrink-0 ${
                          defaultRoundTab?._id === item?._id
                            ? "text-color   border-color"
                            : "text-gray-500"
                        } `}
                      >
                        {index + 1}
                      </span>
                      <p className="capitalize font-medium"> {item?.name}</p>
                      {index !== stageRound.length - 1 && (
                        <svg
                          className="w-3 h-3 ml-2 sm:ml-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 12 10"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m7 9 4-4-4-4M1 9l4-4-4-4"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ol>
              <div
                div
                className="mt-3 flex justify-end gap-3 text-xs sm:ml-auto"
              >
                <button
                  onClick={() => openGroupModal(defaultRoundTab)}
                  className="bg-button  px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
                >
                  Manage Group
                </button>
              </div>
              <div className="pt-3 pb-7">
                <Roundtabs
                  defaultRoundTab={defaultRoundTab}
                  roundTeams={roundTeams}
                  groupData={groupData}
                  leagueTeams={leagueTeams}
                  openTeamModal={openTeamModal}
                  openLobbyModal={openLobbyModal}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center">No Stage</div>
      )}
    </div>
  );
};

export default UpdateStage;
