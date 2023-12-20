import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineCloudDownload } from "react-icons/md";

import {
  deleteGame,
  getGames,
  updateGameStatus,
} from "../../redux/actions/gameAction";

import NewGame from "./NewGame";
import Layout from "../../layouts";
import Toggle from "../../components/Toggle";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import SearchBox from "../../components/SearchBox";
import TableImage from "../../components/TableImage";
import Pagination from "../../components/Pagination";
import ShowOption from "../../components/ShowOption";
import PlayButton from "../../components/PlayButton";
import ConfrimationModal from "../../components/ConfrimationModal";
import VideoPopUp from "../../components/VideoPopUp";
import TableLoader from "../../components/Skeleton/TableLoader";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import PlacementPoints from "./PlacementPoints";
import { ExportUserCSV } from "../../redux/actions/userAction";
import { game_export } from "../../utils/endpoints";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import { debounce } from "lodash";

const Games = () => {
  const dispatch = useDispatch();

  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    videoModal: false,
    ppModal: false,
  });
  const [editData, setEditData] = useState();

  const { results, imageUrl, pagination } = useSelector(
    (state) => state.gameReducer.games
  );
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
  });
  // handle modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData();
    setModals({ ...modals, [name]: false });
  };

  // Api Handles
  const handleDeleteGame = () => {
    dispatch(deleteGame(editData._id, () => handleCloseModal("deleteModal")));
  };
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateGameStatus(event.target.id, payload));
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
    dispatch(getGames(params));
    setTimeout(() => handleOpenModal("skeleton"), 800);
  }, [dispatch, params]);

  // sorting logic

  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(game_export));
  };
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);

  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Games" />

      <section className="w-full relative bg-secondary p-3 pb-0 mt-1.5 sm:mt-3 rounded shadow ">
        {/* search & button */}

        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox placeholder="Games" handleChange={handleDebouncedChange} />
          <span className="grid sm:flex grid-cols-2 gap-2">
            <Button
              title={`Export`}
              icon={<BsPlus className="text-xl" />}
              event={downloadDataInCsv}
            />
            <Button
              title={`Add Game`}
              icon={<BsPlus className="text-xl" />}
              event={() => handleOpenModal("formModal")}
            />
          </span>
        </div>

        {/* Table Data */}
        {results?.length === 0 ? (
          <div className="text-center py-14">No Game Found</div>
        ) : (
          <>
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down  text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tl-lg ">
                          Image
                        </td>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head flex-row items-center flex ">
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
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Banner
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Link
                        </td>

                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Status
                        </td>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head flex-row items-center flex ">
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

                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg ">
                          Action
                        </td>
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {results?.map((item, i) => {
                        const {
                          _id,
                          name,
                          status,
                          streamingLink,
                          image,
                          banner,
                          createdAt,
                        } = item;

                        return (
                          <tr
                            key={_id}
                            className={`${i % 2 !== 0 && "table-head"}`}
                          >
                            <td className="px-4 py-1">
                              <TableImage src={`${imageUrl}${image}`} />
                            </td>
                            <td className="px-4 py-1">{name}</td>
                            <td className="px-1 py-1 ">
                              <TableImage
                                bannerBool
                                src={`${imageUrl}${banner}`}
                              />
                            </td>
                            <td className="px-4 py-1">
                              <div
                                onClick={() => {
                                  window.open(streamingLink);
                                }}
                              >
                                <PlayButton />
                              </div>
                            </td>

                            <td className="px-4 py-1">
                              <Toggle
                                _id={_id && _id}
                                value={status}
                                handleChange={handleStatusUpdate}
                              />
                            </td>
                            <td className="px-4 py-1">
                              <DateFigureWithUTC time={createdAt} />
                            </td>

                            <td className="px-4 text-center relative ">
                              <ShowOption
                                handleDelete={() => {
                                  setEditData(item);
                                  handleOpenModal("deleteModal");
                                }}
                                handleEdit={() => {
                                  setEditData(item);
                                  handleOpenModal("formModal");
                                }}
                                handlePlacement={() => {
                                  setEditData(item);
                                  handleOpenModal("ppModal");
                                }}
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

      {/*--------  Modals -------- */}
      {modals.formModal && (
        <NewGame
          editData={editData}
          imageUrl={imageUrl}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}
      {modals.ppModal && (
        <PlacementPoints
          editData={editData}
          handleCloseModal={() => handleCloseModal("ppModal")}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteGame}
          title="Game"
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

export default Layout(Games);
