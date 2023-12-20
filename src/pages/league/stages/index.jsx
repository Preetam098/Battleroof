import React, { useState, useEffect } from "react";
import Layout from "../../../layouts";
import Heading from "../../../components/Heading";
import SearchBox from "../../../components/SearchBox";
import Button from "../../../components/Button";
import { BsArrowDown, BsArrowUp, BsPlus } from "react-icons/bs";
import TableLoader from "../../../components/Skeleton/TableLoader";
import NewStage from "./NewStage";
import {
  deleteStage,
  getStages,
  updateStageStatus,
} from "../../../redux/actions/leagueAction";
import { useDispatch, useSelector } from "react-redux";
import Toggle from "../../../components/Toggle";
import ShowOption from "../../../components/ShowOption";
import ConfrimationModal from "../../../components/ConfrimationModal";
import Pagination from "../../../components/Pagination";
import { ExportUserCSV } from "../../../redux/actions/userAction";
import { league_stage_csv_export } from "../../../utils/endpoints";
import { debounce } from "lodash";

const Stages = () => {
  const dispatch = useDispatch();
  const [params, setparams] = useState({
    page: 1,
    pageSize: 10,
    sort: "name",
    order: "desc",
    search: "",
  });
  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    videoModal: false,
    ppModal: false,
  });
  const [editData, setEditData] = useState();
  const [searchValue, setSearchValue] = useState();
  const { stageData, fetchLoader } = useSelector(
    (state) => state.leagueReducer
  );
  const { data, pagination } = stageData;

  // handle modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData("");
    setModals({ ...modals, [name]: false });
  };

  // Remove Status
  const handleDeleteStage = () => {
    dispatch(deleteStage(editData._id, () => handleCloseModal("deleteModal")));
  };

  // Status Update
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateStageStatus(event.target.id, payload));
  };

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
    dispatch(getStages(params));
  }, [dispatch, params]);
  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(league_stage_csv_export));
  };
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);
  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Stages" />
      <section className="w-full relative bg-secondary p-3 pb-0 mt-1.5 sm:mt-3 rounded shadow ">
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox placeholder="Stage" handleChange={handleDebouncedChange} />
          <span className="grid sm:flex grid-cols-2 gap-2">
            <Button
              title={`Export`}
              icon={<BsPlus className="text-xl" />}
              event={downloadDataInCsv}
            />
            <Button
              title={`Add Stage`}
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
            <div className="table-container">
              <table className="w-full down  text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="p-3 px-4 flex items-center title-font tracking-wider font-medium text-sm table-head rounded-tl-lg ">
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
                      Status
                    </td>

                    <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg ">
                      Action
                    </td>
                  </tr>
                </thead>
                <tbody className="text-xs relative h-full overflow-y-auto">
                  {data?.map((item, i) => {
                    return (
                      <tr
                        key={item._id}
                        className={`${i % 2 !== 0 && "table-head"}`}
                      >
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          <Toggle
                            value={item.status}
                            _id={item._id}
                            handleChange={handleStatusUpdate}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <ShowOption
                            handleEdit={() => {
                              setEditData(item);
                              handleOpenModal("formModal");
                            }}
                            handleDelete={() => {
                              setEditData(item);
                              handleOpenModal("deleteModal");
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
        )}
      </section>

      {/*--------  Modals -------- */}
      {modals.formModal && (
        <NewStage
          editData={editData}
          imageUrl={""}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteStage}
          title="Stage"
        />
      )}
    </div>
  );
};

export default Layout(Stages);
