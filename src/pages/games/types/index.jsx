import React, { useEffect, useState } from "react";
import Layout from "../../../layouts";
import SearchBox from "../../../components/SearchBox";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import { BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGameType,
  getGameTypes,
  updateGameTypeStatus,
} from "../../../redux/actions/gameAction";
import TableImage from "../../../components/TableImage";
import Toggle from "../../../components/Toggle";
import ShowOption from "../../../components/ShowOption";
import { MdOutlineCloudDownload } from "react-icons/md";
import Pagination from "../../../components/Pagination";
import NewType from "./NewType";
import ConfrimationModal from "../../../components/ConfrimationModal";
import TableLoader from "../../../components/Skeleton/TableLoader";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

import DateFigureWithUTC from "../../../components/FormatDateWithUtc";

const GameTypes = () => {
  const dispatch = useDispatch();
  const { gameTypes, loading } = useSelector((state) => state.gameReducer);
  const { results, imageUrl } = gameTypes;

  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
  });
  const [editData, setEditData] = useState();
  const [searchValue, setSearchValue] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // handle Open modal
  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true });
  };
  // handle Close modal
  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false });
    setEditData();
  };

  // Api Handles
  const handleDeleteGame = () => {
    dispatch(
      deleteGameType(editData._id, () => handleCloseModal("deleteModal"))
    );
  };
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateGameTypeStatus(event.target.id, payload));
  };

  // Other Handles
  const filteredData = results?.filter(
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
  const totalItems = (searchValue ? filteredData : results)?.length;
  const trimStart = (currentPage - 1) * perPageItems;
  const trimEnd = trimStart + perPageItems;
  const handlePrev = () => currentPage !== 1 && setCurrentPage(currentPage - 1);
  const handleForw = () =>
    trimEnd <= totalItems && setCurrentPage(currentPage + 1);

  useEffect(() => {
    dispatch(getGameTypes());
    setTimeout(() => handleOpenModal("skeleton"), 800);
  }, [dispatch]);

  // sorting
  const [gameList, setGameList] = useState();

  useEffect(() => {
    if (results?.length > 0) {
      setGameList(
        results?.sort((a, b) => {
          return b.createdAt?.localeCompare(a.createdAt, undefined, {
            sensitivity: "base",
          });
        })
      );
    }
  }, []);

  const handleSort = () => {
    const sortedWords = results
      .filter((item) => item?.name)
      .slice()
      .sort((a, b) => {
        return a.name?.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });

    results.filter((item) => item?.name === null);
    setGameList(sortedWords);
  };

  const reverseHandleSort = () => {
    const sortedWords = results
      .filter((item) => item?.name)
      .slice()
      .sort((a, b) => {
        return b.name?.localeCompare(a.name, undefined, {
          sensitivity: "base",
        });
      });

    results.filter((item) => item?.name === null);
    setGameList(sortedWords);
  };
  const handleDateSort = () => {
    const sortedWords = results
      .filter((item) => item?.createdAt)
      .slice()
      .sort((a, b) => {
        return a.createdAt?.localeCompare(b.createdAt, undefined, {
          sensitivity: "base",
        });
      });

    results.filter((item) => item?.createdAt === null);
    setGameList(sortedWords);
  };

  const reverseHandleDateSort = () => {
    const sortedWords = results
      .filter((item) => item?.createdAt)
      .slice()
      .sort((a, b) => {
        return b.createdAt?.localeCompare(a.createdAt, undefined, {
          sensitivity: "base",
        });
      });

    results.filter((item) => item?.createdAt === null);
    setGameList(sortedWords);
  };

  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Game Types" />

      <section className="w-full relative pb-0 bg-secondary p-3 mt-2 sm:mt-3 rounded shadow ">
        {/* search & button */}
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="Game Types"
            value={searchValue}
            handleChange={(event) => setSearchValue(event.target.value)}
          />
          <span className="grid sm:flex grid-cols-2 gap-2">
            {results?.length !== 0 && (
              <Button
                title={`Export`}
                icon={<MdOutlineCloudDownload className="text-xl" />}
                event={downloadDataInCsv}
              />
            )}
            <Button
              title={`Add Game Type`}
              icon={<BsPlus className="text-xl" />}
              event={() => handleOpenModal("formModal")}
            />
          </span>
        </div>

        {/* Table Data */}
        {results?.length === 0 ? (
          <div className="text-center py-14">No Game Type Found</div>
        ) : (
          <>
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down  text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tl-lg ">
                          Image
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Name
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              reverseHandleSort();
                            }}
                          >
                            <BsArrowUp />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              handleSort();
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Status
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Time
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              reverseHandleDateSort();
                            }}
                          >
                            <BsArrowUp />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              handleDateSort();
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {(searchValue
                        ? filteredData
                        : gameList?.length > 0
                        ? gameList
                        : results
                      )
                        ?.slice(trimStart, trimEnd)
                        .map((item, i) => {
                          const { _id, name, status, image, createdAt } = item;
                          return (
                            <tr
                              key={_id}
                              className={`${i % 2 !== 0 && "table-head"}`}
                            >
                              <td
                                className="px-4 py-1  max-w-[50px]  "
                                key={image}
                              >
                                <TableImage src={`${imageUrl}${image}`} />
                              </td>
                              <td className="px-4 py-1">{name}</td>

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
      {/*--------  Modals -------- */}
      {modals.formModal && (
        <NewType
          editData={editData}
          imageUrl={imageUrl}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteGame}
          title="Game Type"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Layout(GameTypes);
