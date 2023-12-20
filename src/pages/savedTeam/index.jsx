import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layouts";
import Heading from "../../components/Heading";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import ShowOption from "../../components/ShowOption";
import TableImage from "../../components/TableImage";
import ConfrimationModal from "../../components/ConfrimationModal";
import TableLoader from "../../components/Skeleton/TableLoader";
import NoData from "../../components/NoData";
import moment from "moment";
import { BsArrowUp, BsArrowDown, BsPlus } from "react-icons/bs";
import { allTeamList } from "../../redux/actions/tournamentAction";
import PlayerList from "./PlayerList";
import { getGames } from "../../redux/actions/gameAction";
import Button from "../../components/Button";
import { ExportUserCSV } from "../../redux/actions/userAction";
import { teams_csv_export } from "../../utils/endpoints";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import { debounce } from "lodash";

const SavedTeam = () => {
  const dispatch = useDispatch();
  const { allTeam, loading } = useSelector((state) => state.tournamentReducer);
  const { games } = useSelector((state) => state.gameReducer);
  const data = allTeam?.data;
  const pagination = allTeam?.pagination;
  const [teamId, setTeamId] = useState();

  const [modals, setModals] = useState({
    deleteModal: false,
    skeleton: false,
    playListModal: false,
  });
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
    // gameId: "",
  });
  const [game, setGame] = useState();
  const [refetch, setrefetch] = useState(false);
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
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false });
  };
  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(teams_csv_export));
  };
  useEffect(() => {
    dispatch(allTeamList(params));
    dispatch(getGames());
    setTimeout(() => handleOpenModal("skeleton"), 800);
  }, [params, dispatch, refetch]);
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);
  return (
    <div className="tracking-wider overflow-auto pb-12 notification-container h-full">
      <Heading title="Saved Teams" />

      <section className="w-full relative  bg-secondary p-3 pb-0 my-2 sm:my-3 rounded shadow">
        {allTeam?.length === 0 ? (
          <NoData />
        ) : (
          <>
            {/* search & button */}
            <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
              <SearchBox
                placeholder="Team"
                handleChange={handleDebouncedChange}
              />
              <div className="grid sm:flex grid-cols-2 gap-2">
                <Button
                  title={`Export`}
                  icon={<BsPlus className="text-xl" />}
                  event={downloadDataInCsv}
                />
                <select
                  value={game}
                  id="type"
                  onChange={(event) => {
                    setGame(event.target.value);
                    if (event.target.value !== "") {
                      setparams({
                        ...params,
                        gameId: event.target.value,
                      });
                    } else {
                      setrefetch(!refetch);
                      delete params.gameId;
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
              </div>
            </div>
            {/* Table Data */}
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down text-left whitespace-nowrap">
                    <thead className=" table-head ">
                      <tr>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm  rounded-tl-lg ">
                          Profile
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Name
                          </span>

                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "name",
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
                                sort: "name",
                                order: "asc",
                              });
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                          TeamID
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                          Game Name
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                          Game Mode
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                          Referral Code
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm  ">
                          Action
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm  rounded-tr-lg flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Time
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setparams({
                                ...params,
                                sort: "createdAt",
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
                                sort: "createdAt",
                                order: "asc",
                              });
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    {data?.length === 0 ? (
                      <NoData />
                    ) : (
                      <tbody className="text-xs relative h-full overflow-y-auto">
                        {data?.map((item, index) => {
                          const {
                            _id,
                            ref_code,
                            name,
                            gameName,
                            gameMode,
                            image,
                            createdAt,
                          } = item;
                          return (
                            <tr
                              key={_id}
                              className={`${index % 2 !== 0 && "table-head"} `}
                            >
                              <td className="px-4 py-1">
                                <TableImage
                                  src={
                                    image
                                      ? image
                                      : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                                  }
                                />
                              </td>
                              <td className="px-4 py-1 text-color">
                                {name || "-"}
                              </td>
                              <td className="px-4 py-1 text-color">{_id}</td>
                              <td className="px-4 py-1">{gameName || "-"}</td>
                              <td className="px-4 py-1">{gameMode || "-"}</td>
                              <td className="px-4 py-1">{ref_code}</td>

                              <td className="px-4 text-center sm:relative ">
                                <ShowOption
                                  handleViewTeam={() => {
                                    setTeamId(item._id);
                                    handleOpenModal("playListModal");
                                  }}
                                />
                              </td>
                              <td className="px-4 py-1">
                                <DateFigureWithUTC time={createdAt} />
                              </td>
                            </tr>
                          );
                        })}
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
            ) : (
              <TableLoader />
            )}
          </>
        )}
      </section>

      {/*--------  Modals -------- */}

      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          // handleConfirm={handleDeleteGame}
          title="Team"
          loading={loading}
        />
      )}

      {modals.playListModal && (
        <PlayerList
          teamId={teamId}
          handleDelete={(player) => {
            // setPlayerId(player?._id)
            setTeamId(player?.team_id);
            handleOpenModal("teamPlayerConfirmation");
          }}
          handleClose={() => handleCloseModal("playListModal")}
        />
      )}
    </div>
  );
};

export default Layout(SavedTeam);
