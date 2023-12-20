import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";

import Layout from "../../layouts";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import SearchBox from "../../components/SearchBox";
import ShowOption from "../../components/ShowOption";
import {
  deleteNotification,
  getNotifications,
  pushNotification,
  notificationStatusChange,
} from "../../redux/actions/notificationAction";
import ConfrimationModal from "../../components/ConfrimationModal";
import TableImage from "../../components/TableImage";

import ButtonLoader from "../../components/ButtonLoader";
import Pagination from "../../components/Pagination";
import ShowError from "../../components/ShowError";
import Team from "../../assets/Team.gif";
import Toggle from "../../components/Toggle";
import { STATUS_NOTIFICATION_SUCCESS } from "../../redux/actions";
import TableLoader from "../../components/Skeleton/TableLoader";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { ExportUserCSV } from "../../redux/actions/userAction";
import { notification_csv_export } from "../../utils/endpoints";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import { debounce } from "lodash";

const Notification = () => {
  const dispatch = useDispatch();
  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      fileSize: {
        message: "The :attribute must be max 1MB.",
        rule: function (val, maxSize, validator) {
          return val && val.size <= 1048576;
        },
      },
    },
  });
  const [editData, setEditData] = useState();
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [formInput, setFormInput] = useState({});
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
  });

  const { loading, fetchLoading, notification_status } = useSelector(
    (state) => state.notificationReducer
  );
  const {
    data: notiDta,
    imageUrl,
    commonStatus,
    pagination,
  } = useSelector((state) => state.notificationReducer.notification);

  useEffect(() => {
    dispatch({
      type: STATUS_NOTIFICATION_SUCCESS,
      payload: commonStatus === 1,
    });
  }, [commonStatus]);

  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState({});

  const handleChange = (event) => {
    const { name, type, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    setIsEdit(true);
    if (type === "file") {
      setPreview({
        ...preview,
        [name]: URL.createObjectURL(event.target.files[0]),
      });
      setFormInput({ ...formInput, [name]: event.target.files[0] });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  // Handle Modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData();
    setShowConfirm(false);
    setFormInput({});
    setErrors({});
  };

  // Api Handles
  const handleDeleteNotification = () => {
    dispatch(deleteNotification(editData._id, handleCloseModal));
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

  // Handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validator.allValid()) {
      dispatch(pushNotification(formInput, handleCloseModal));
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  useEffect(() => {
    dispatch(getNotifications(params));
  }, [dispatch, params]);

  const handleStatusChange = (event) => {
    const payload = { status: event.target.checked === true ? 1 : 0 };
    dispatch(notificationStatusChange(payload));
  };

  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(notification_csv_export));
  };
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);
  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Notifications" />

      <section className="w-full relative pb-0 bg-secondary p-3 mt-2 sm:mt-3 rounded shadow">
        {/* search & button */}
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-3 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="Notification"
            handleChange={handleDebouncedChange}
          />

          <div className="flex items-center justify-center gap-3 row">
            <div className=" flex items-center justify-center ">
              <Toggle
                // _id={_id && _id}
                value={notification_status}
                handleChange={handleStatusChange}
              />
            </div>
            <Button title={`Export`} event={downloadDataInCsv} />
            <Button title={`Push Notification`} event={handleOpenModal} />
          </div>
        </div>

        {/* Table Data */}
        {notiDta?.length === 0 || commonStatus === 0 ? (
          <div className="text-center py-5">No Data Found</div>
        ) : (
          <>
            {fetchLoading ? (
              <TableLoader />
            ) : (
              <>
                <div className="table-container">
                  <table className="w-full down text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg ">
                          Title
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Description
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Link
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head  ">
                          Image
                        </th>

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg flex-row items-center flex ">
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

                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tr-lg ">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {notiDta?.map((item, index) => {
                        const {
                          title,
                          _id,
                          description,
                          image,
                          createdAt,
                          link,
                        } = item;
                        return (
                          <tr
                            key={_id}
                            className={`${index % 2 !== 0 && "table-head"} `}
                          >
                            <td className="px-4 py-3  text-color">{title}</td>
                            <td className="px-4 py-3 ">{description}</td>
                            <td className="px-4 py-3 ">{link ? link : "-"}</td>
                            <td className="px-4 py-1">
                              <TableImage
                                src={image ? `${imageUrl}${image}` : Team}
                              />
                            </td>
                            <td className="px-4 py-1">
                              <DateFigureWithUTC time={createdAt} />
                            </td>
                            <td className="px-4 py-3  ">
                              <ShowOption
                                handleDelete={() => {
                                  setEditData(item);
                                  setShowConfirm(true);
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
          </>
        )}
      </section>

      {/*--------  Modals -------- */}
      {openModal && (
        <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
          <form
            onSubmit={handleSubmit}
            className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle mx-4 w-full sm:max-w-sm sm:p-6"
          >
            <div>
              {/* Top */}
              <div className="flex justify-between items-center">
                <span className="text-color">Push Notification</span>
                <MdClose
                  className="text-xl cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              <div className="grid gap-3 mt-6 text-sm">
                <div className="gap-1.5 grid">
                  <label htmlFor="title" className="mt-1 text-sm  ">
                    Title
                  </label>
                  <input
                    autoComplete="off"
                    id="title"
                    name="title"
                    type="text"
                    value={formInput?.title}
                    onChange={handleChange}
                    className="border-color border outline-none w-full rounded text-sm tracking-wider placeholder:text-xs p-2"
                  />
                  {validator.message("title", formInput?.title, "required", {
                    className: "text-danger",
                  })}
                  <ShowError data={errors.title} />
                </div>
                <div className="gap-1.5 grid">
                  <label htmlFor="desc" className="mt-1 text-sm  ">
                    Description
                  </label>
                  <textarea
                    id="desc"
                    name="description"
                    rows={4}
                    value={formInput?.description}
                    onChange={handleChange}
                    className="border-color bg-transparent border outline-none w-full rounded text-sm tracking-wider placeholder:text-xs p-2"
                  />
                  {validator.message(
                    "description",
                    formInput?.description,
                    "required",
                    { className: "text-danger" }
                  )}
                  <ShowError data={errors.description} />
                </div>
                <div className="gap-1.5 grid">
                  <label htmlFor="title" className="mt-1 text-sm  ">
                    Link
                  </label>
                  <input
                    autoComplete="off"
                    id="link"
                    name="link"
                    type="text"
                    value={formInput?.link}
                    onChange={handleChange}
                    className="border-color border outline-none w-full rounded text-sm tracking-wider placeholder:text-xs p-2"
                  />
                  {validator.message("link", formInput?.link, "url", {
                    className: "text-danger",
                  })}
                  <ShowError
                    data={errors.link ? "The link must be a valid link." : ""}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm">Image</label>
                  <div>
                    <label
                      htmlFor="images"
                      className="text-xs flex flex-col gap-1 justify-center rounded border-dashed border-[1.5px] p-4 items-center"
                    >
                      {formInput?.image?.name && (
                        <img
                          src=""
                          alt="preview"
                          className="max-w-[170px] rounded"
                        />
                      )}

                      <MdOutlineCloudUpload className="text-xl mb-0.5" />
                      {formInput?.image?.name
                        ? formInput?.image.name
                        : " Upload Image"}
                    </label>
                    <input
                      autoComplete="off"
                      id="images"
                      type="file"
                      name="image"
                      accept="image/jpeg"
                      onChange={handleChange}
                      className="rounded py-1.5 px-2 hidden outline-none border"
                    />
                  </div>
                  {validator.message("image", formInput?.image, "fileSize")}
                  <ShowError data={errors.image} />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3 ">
              <button
                type="submit"
                disabled={loading}
                className="bg-button w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
              >
                {loading ? <ButtonLoader /> : "Push"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showConfirm && (
        <ConfrimationModal
          handleCancel={handleCloseModal}
          handleConfirm={handleDeleteNotification}
          title="Notification"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Layout(Notification);
