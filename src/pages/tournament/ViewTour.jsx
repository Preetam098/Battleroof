import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BsCheck2Circle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FcApproval } from "react-icons/fc";

import Layout from "../../layouts";
import Team from "../../assets/Team.gif";
import PlayButton from "../../components/PlayButton";
import DateFigure from "../../components/FomatDate";
import { toast } from "react-hot-toast";
import { playerList, teamList } from "../../redux/actions/userAction";
import {
  deleteTeam,
  joinDeleteTeam,
  deleteTeamPlayer,
  settlementStatus,
  updateRoomId,
  viewTour,
  updateStreamingLink,
} from "../../redux/actions/tournamentAction";
import DeclareResult from "./DeclareResult";
import ButtonLoader from "../../components/ButtonLoader";
import ViewTeam from "../teams/ViewTeam";
import DeclareSlots from "./DeclareSlots";
import SettlementAmount from "./SettlementAmount";
import { BiTrashAlt } from "react-icons/bi";
import { IMAGE_BASEURL } from "../../utils/endpoints";

const ViewTour = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [roomDetails, setRoomDetails] = useState({});
  const [showDeclare, setShowDeclare] = useState(false);
  const [settlementModal, setSettlementModal] = useState(false);
  const [playerId, setPlayerId] = useState("");

  const [teamId, setTeamId] = useState();
  const [joinTournamentId, setJoinTournamentId] = useState();

  const { loading, viewtour, tournaments, isLoading } = useSelector(
    (state) => state.tournamentReducer
  );
  const { result, imageUrl } = viewtour;

  const { teams } = useSelector((state) => state.userReducer);
  console.log(teams, "teams");
  const [modals, setModals] = useState({
    confirmModal: false,
    activeTab: "Overview",
    playersModal: false,
    showSlots: false,
    teamDeleteConfirmation: false,
    teamPlayerConfirmation: false,
    streamingLinkModal: false,
  });

  const [streamingLink, setStreamingLink] = useState("");

  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true });
  };

  // handle change
  const handleChange = (event) =>
    setRoomDetails({
      ...roomDetails,
      [event.target.name]: event.target.value,
    });

  // handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateRoomId(state, roomDetails));
    event.target.reset();
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
      name: "Format",
      value: result?.format,
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
      name: `Entry Fee`,
      value: `₹ ${result?.entryFee}`,
    },
    {
      name: "Map",
      value: result?.map,
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
      name: "Total Teams",
      value: result?.teamCounts,
    },
    {
      name: "Room ID",
      value: result?.roomId,
    },
    {
      name: "Room Password",
      value: result?.roomPassword,
    },
    {
      name: "Starting Time",
      value: <DateFigure time={result?.startDateTime} />,
    },
    {
      name: "End Time",
      value: <DateFigure time={result?.endDateTime} />,
    },
  ];

  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false });
  };

  // handle settlement status
  const handleSettlement = () => {
    const payload = {
      tournamentId: state,
    };
    dispatch(settlementStatus(payload));
  };

  useEffect(() => {
    if (result) {
      const { roomPassword, roomId } = result;
      setRoomDetails({ roomPassword, roomId });
    }
  }, [result]);

  useEffect(() => {
    dispatch(viewTour(state));
    dispatch(teamList(`tournamentId=${state}`));
  }, [dispatch, state]);

  // Handle Tabs
  const tabs = () => {
    // eslint-disable-next-line default-case
    switch (modals.activeTab) {
      case "Overview":
        return (
          <>
            <div className="gap-4 md:gap-x-6 grid sm:grid-cols-2">
              {overview.map((item) => {
                return (
                  <div className="flex bg-gray-900 py-3 px-4 text-xs uppercase rounded-sm justify-between">
                    {item?.name === "Entry Fee" ? (
                      <div className="flex flex-row items-center">
                        <span className="text-gray-400">Entry Fee</span>
                        <div className="flex flex-row items-center ml-[5px]">
                          {"("}
                          {result?.entryFeeType === "rupee" ? (
                            <span className="text-gray-400">{"₹"}</span>
                          ) : result?.entryFeeType === "coin" ? (
                            <img
                              alt="coin"
                              src={require("../../assets/coin.png")}
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

            {result?.winnings.length > 0 && (
              <div
                className="w-full capitalize my-5 bg-gray-900 sm:w-1/2 p-3"
                style={{ borderRadius: 5 }}
              >
                <span className="text-color mt-3">Tournament Price Pool</span>
                <table className="w-full capitalize  bg-gray-900">
                  <thead className="text-sm text-left border-b text-gray-200">
                    <tr className="">
                      <td className="py-2">Ranks</td>
                      {result?.resultStatus === 1 && (
                        <td className="py-2">Teams</td>
                      )}
                      <td className="py-2">Prizes</td>
                    </tr>
                  </thead>
                  <tbody className="text-left">
                    {result?.winnings?.map((item) => {
                      const all = teams?.results?.map((it) => {
                        return (
                          it?.joinedtournament?.rank === item.rank && it.name
                        );
                      });
                      return (
                        <tr key={item.rank} className="text-xs text-gray-200">
                          <td className="py-2">#{item.rank}</td>
                          {result?.resultStatus === 1 && (
                            <td className="py-2 capitalize">
                              {all?.map((val) => (
                                <p key={val}>{val}</p>
                              ))}
                            </td>
                          )}
                          <td className="py-2 text-color">₹ {item.amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );

      case "Teams":
        return (
          <>
            {teams?.results?.length === 0 && (
              <div className="text-center">No Teams</div>
            )}
            <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teams?.results?.map((item) => {
                return (
                  <div
                    key={item._id}
                    // onClick={() => {
                    //   setTeamId(item._id)
                    //   handleOpenModal('playersModal')
                    // }}
                    className="overflow-hidden cursor-pointer rounded-sm  shadow-lg "
                  >
                    <div className="relative">
                      <img
                        className="object-cover h-44 w-full "
                        src={
                          item.image
                            ? `${IMAGE_BASEURL}public/uploads/teams/${item.image}`
                            : Team
                        }
                        alt={item.name}
                        onClick={() => {
                          setTeamId(item._id);
                          handleOpenModal("playersModal");
                        }}
                      />
                      {result?.runningStatus !== "completed" && (
                        <div
                          className="absolute top-2 right-2 bg-slate-400 h-6 w-6 items-center flex justify-center rounded z-30"
                          onClick={() => {
                            setTeamId(item?._id);
                            setJoinTournamentId(item?.joinedtournament?._id);
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
                      )}
                    </div>
                    <div className="px-3 bg-gray-300 py-2">
                      <h1 className="font-bold text-center text-gray-800 uppercase ">
                        {item.name}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case "Rules":
        return (
          <div className="grid gap-4">
            <div className="text-sm whitespace-normal  text-gray-300 tracking-wider">
              <span
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: result?.rules }}
              ></span>
            </div>
          </div>
        );

      // case "Slots":
      //   return <>Test</>;
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
                <div className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white">
                  <IoIosArrowBack
                    onClick={() => navigate("/tournaments")}
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
                </div>
              </span>
            </div>
          </section>

          {/* Form */}
          <div className={`sm:px-4 grid items-center sm:grid-cols-2 px-3 my-2`}>
            {result?.runningStatus === "running" ||
            result?.runningStatus === "completed" ? (
              <form
                onSubmit={handleSubmit}
                className="mt-3 w-full divide-x items-center text-xs flex rounded-sm text-white"
              >
                <input
                  type="text"
                  value={
                    roomDetails?.roomId === "null" ? "" : roomDetails?.roomId
                  }
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
                    roomDetails?.roomPassword === "null"
                      ? ""
                      : roomDetails?.roomPassword
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
              {(result?.runningStatus === "running" ||
                result?.runningStatus === "completed") && (
                <>
                  {/* streaming link */}
                  <button
                    type="button"
                    onClick={() => {
                      setStreamingLink(result?.streamingLink);
                      handleOpenModal("streamingLinkModal");
                    }}
                    className="bg-button px-4 text-white tracking-wider rounded-full py-2"
                  >
                    Streaming Link
                  </button>

                  {/* Declare Slots */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(teamList(`tournamentId=${state}`));
                      handleOpenModal("showSlots");
                    }}
                    className="bg-button   px-4 text-white tracking-wider rounded-full py-2"
                  >
                    {/* {result?.settlementStatus == 1 ? 'Settled' : */}
                    Declare Slots
                    {/* } */}
                  </button>

                  {/* Declare Result */}
                  <button
                    onClick={() => setShowDeclare(true)}
                    // disabled={
                    //   result?.runningStatus !== 'completed' ||
                    //   result?.settlementStatus == 1
                    // }
                    className="bg-button  px-4 text-white  tracking-wider rounded-full md:py-2.5 py-2"
                  >
                    {/* {result?.resultStatus == 1
                      ? "Declared"
                      : result?.runningStatus === "running"
                      ? "Running"
                      : "Declare Result"} */}
                    Declare Result
                  </button>
                </>
              )}

              {/* Settlement Button */}
              {result?.settlementStatus === 0 &&
                result?.runningStatus === "completed" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (result?.settlementStatus == 1) {
                        toast.success("Result already settled");
                      } else {
                        setSettlementModal(true);
                      }
                    }}
                    className="bg-button ml-auto  px-4 text-white  tracking-wider rounded-full py-2"
                  >
                    {result?.settlementStatus == 1
                      ? "Settled"
                      : "Settlement Amount"}
                  </button>
                )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex p-3 sm:p-4 overflow-x-auto overflow-y-hidden  border-gray-200 whitespace-nowrap ">
            {["Overview", "Teams", "Rules"]
              ?.filter((item) => {
                if (result?.runningStatus === "completed") {
                  return item;
                } else {
                  return item !== "Slots";
                }
              })
              .map((item) => {
                return (
                  <button
                    onClick={() => handleTabs(item)}
                    className={`inline-flex text-sm uppercase border-b-2 font-medium border-gray-700 items-center pb-2 text-center ${
                      modals?.activeTab === item
                        ? "text-color   border-color"
                        : " text-gray-500"
                    }  bg-transparent px-5 whitespace-nowrap focus:outline-none`}
                  >
                    {item}
                  </button>
                );
              })}
          </div>
          <div className="px-3 w-full sm:px-4 pb-7">{tabs()}</div>
        </div>
      </section>
      {/* ------------- Declare result modal --------------- */}
      {showDeclare && (
        <DeclareResult
          results={teams?.results}
          winners={teams?.results?.length}
          result={result}
          tour_id={state}
          handleCloseModal={() => setShowDeclare(false)}
        />
      )}
      {settlementModal && (
        <SettlementAmount
          result={result}
          teams={teams}
          tour_id={state}
          handleCloseModal={() => setSettlementModal(false)}
        />
      )}

      {modals.showSlots && (
        <DeclareSlots
          results={teams?.results}
          result={result}
          winners={teams?.results?.length}
          tour_id={state}
          handleCloseModal={() => handleCloseModal("showSlots")}
        />
      )}
      {/* confirmation modal */}
      {modals.confirmModal && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center">
                  <FcApproval className="text-3xl" />
                </div>

                <div className="mt-2 text-center">
                  <h3
                    className="font-medium leading-6 text-color capitalize"
                    id="modal-title"
                  >
                    Tournaments Settled
                  </h3>
                </div>
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
                <button
                  onClick={() => handleCloseModal("confirmModal")}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  // onClick={handleSettlement}
                  onClick={() => {
                    handleSettlement("confirmModal");
                    handleCloseModal("confirmModal");
                  }}
                  type="button"
                  disabled={loading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {loading ? <ButtonLoader /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* view players */}
      {modals.playersModal && (
        <ViewTeam
          handleClose={() => handleCloseModal("playersModal")}
          teamId={teamId}
          handleDelete={(player) => {
            setPlayerId(player?._id);
            setTeamId(player?.team_id);
            handleOpenModal("teamPlayerConfirmation");
          }}
        />
      )}

      {/* Delete confirmation model */}
      {modals.teamDeleteConfirmation && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center">
                  <BiTrashAlt className="text-3xl" style={{ color: "red" }} />
                </div>

                <div className="mt-2 text-center">
                  <h3
                    className="font-medium leading-6 text-color capitalize"
                    id="modal-title"
                  >
                    Are you sure you want to remove Team?
                  </h3>
                </div>
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
                <button
                  onClick={() => handleCloseModal("teamDeleteConfirmation")}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  // onClick={handleSettlement}
                  onClick={() => {
                    dispatch(joinDeleteTeam(joinTournamentId));
                    dispatch(teamList(`tournamentId=${state}`));
                    handleCloseModal("teamDeleteConfirmation");
                  }}
                  type="button"
                  disabled={loading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {loading ? <ButtonLoader /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Team Player confirmation model */}
      {modals.teamPlayerConfirmation && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center">
                  <BiTrashAlt className="text-3xl" style={{ color: "red" }} />
                </div>

                <div className="mt-2 text-center">
                  <h3
                    className="font-medium leading-6 text-color capitalize"
                    id="modal-title"
                  >
                    Are you sure you want to remove this Player?
                  </h3>
                </div>
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
                <button
                  onClick={() => handleCloseModal("teamPlayerConfirmation")}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  // onClick={handleSettlement}
                  onClick={() => {
                    dispatch(deleteTeamPlayer(playerId));
                    dispatch(playerList(teamId));
                    handleCloseModal("teamPlayerConfirmation");
                  }}
                  type="button"
                  disabled={loading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {loading ? <ButtonLoader /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Streaming link update modal */}
      {modals.streamingLinkModal && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mt-2">
                  <h3
                    className="font-medium leading-6 text-color capitalize"
                    id="modal-title"
                  >
                    Streaming Link
                  </h3>
                </div>
              </div>

              <div className="w-full">
                <input
                  autoComplete="off"
                  id="streamingLink"
                  name="streamingLink"
                  type="text"
                  value={streamingLink}
                  placeholder="Enter Streaming Link"
                  onChange={(event) => {
                    setStreamingLink(event.target.value);
                  }}
                  className="rounded bg-transparent text-sm px-2 py-1.5 w-full outline-none border mt-2"
                />
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
                <button
                  onClick={() => handleCloseModal("streamingLinkModal")}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    // api call for update link
                    dispatch(
                      updateStreamingLink(
                        result?._id,
                        {
                          streamingLink: streamingLink,
                        },
                        () => {
                          handleCloseModal("streamingLinkModal");
                        }
                      )
                    );
                  }}
                  type="button"
                  disabled={isLoading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {isLoading ? <ButtonLoader /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout(ViewTour);
