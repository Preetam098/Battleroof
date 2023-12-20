import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { MdClose, MdEmail, MdOutlineCloudDownload } from "react-icons/md";
import { GoUnverified, GoVerified } from "react-icons/go";

import Layout from "../../layouts";
import UpdateUser from "./UpdateUser";
import {
  ExportUserCSV,
  deleteUser,
  getUsers,
  updateUserStatus,
  updateUserWallet,
} from "../../redux/actions/userAction";
import Button from "../../components/Button";
import Toggle from "../../components/Toggle";
import Heading from "../../components/Heading";
import ShowError from "../../components/ShowError";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import ShowOption from "../../components/ShowOption";
import TableImage from "../../components/TableImage";
import ButtonLoader from "../../components/ButtonLoader";
import ConfrimationModal from "../../components/ConfrimationModal";
import TableLoader from "../../components/Skeleton/TableLoader";
import NoData from "../../components/NoData";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import DateFigure from "../../components/FomatDate";
import { export_user_csv } from "../../utils/endpoints";
import { debounce } from "lodash";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import { calculateAge } from "../../utils/constants";
import PlayerList from "../savedTeam/PlayerList";
import { FaEye } from "react-icons/fa";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    walletModal: false,
    playListModal: false,
  });
  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      number: {
        message: "The :attribute must be a number.",
        rule: function (val, params, validator) {
          return (
            validator.helpers.testRegex(val, /^\d+$/) &&
            params.indexOf(val) === -1
          );
        },
      },
    },
  });
  const [errors, setErrors] = useState({});
  const [editData, setEditData] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const { users, loading } = useSelector((state) => state.userReducer);
  const { imageUrl, results, pagination } = users;

  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
  });

  // Handle Modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData();
    setModals({ ...modals, [name]: false });
  };

  // Api Handles
  const handleDeleteGame = () => {
    dispatch(deleteUser(editData._id, () => handleCloseModal("deleteModal")));
  };
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked };
    dispatch(updateUserStatus(event.target.id, payload));
  };
  const handleWallet = (event) => {
    event.preventDefault();
    const payload = {
      amount: parseInt(walletBalance),
    };

    if (validator.allValid()) {
      dispatch(
        updateUserWallet(editData._id, payload, () =>
          handleCloseModal("walletModal")
        )
      );
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(export_user_csv));
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

  // useEffect
  useEffect(() => {
    dispatch(getUsers(params));
    setTimeout(() => handleOpenModal("skeleton"), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params]);
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);
  return (
    <div className="tracking-wider overflow-auto pb-12 notification-container h-full">
      <Heading title="Users" />

      <section className="w-full relative  bg-secondary p-3 pb-0 my-2 sm:my-3 rounded shadow">
        <>
          {/* search & button */}
          <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
            <SearchBox
              placeholder="User"
              // value={searchValue}
              handleChange={handleDebouncedChange}
            />

            <Button
              title={`Export`}
              event={downloadDataInCsv}
              icon={<MdOutlineCloudDownload className="text-xl" />}
            />
          </div>
          {/* Table Data */}
          {modals.skeleton ? (
            <>
              {results?.length === 0 ? (
                <NoData />
              ) : (
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
                            Email
                          </th>
                          <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                            Age
                          </th>
                          <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                            DOB
                          </th>
                          <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                            Phone
                          </th>
                          <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                            Device
                          </th>

                          <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                            Wallet
                          </th>

                          <th className="p-3 px-4 title-font tracking-wider font-medium text-sm ">
                            Status
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
                      <tbody className="text-xs relative h-full overflow-y-auto">
                        {results?.map((item, index) => {
                          const {
                            _id,
                            mobileNumber,
                            name,
                            dob,
                            email,
                            status,
                            profilePicture,
                            walletAmount,
                            createdAt,
                            deviceType,
                            isEmailVerified,
                          } = item;
                          return (
                            <tr
                              key={_id}
                              className={`${index % 2 !== 0 && "table-head"} `}
                            >
                              <td className="px-4 py-1">
                                <TableImage
                                  src={
                                    profilePicture
                                      ? `${imageUrl}${profilePicture}`
                                      : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                                  }
                                />
                              </td>
                              <td className="px-4 py-1 text-color">
                                {name || "-"}
                              </td>
                              <td className="px-4 py-1 ">
                                <div className="flex gap-2.5 break-words items-start">
                                  {email ? (
                                    <div className="text-break w-32">
                                      {email}
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                  {email && (
                                    <div>
                                      {isEmailVerified ? (
                                        <GoVerified
                                          title="Email Verified"
                                          className="text-color text-lg"
                                        />
                                      ) : (
                                        <GoUnverified
                                          title="Email Unverified"
                                          className="text-red-700 text-lg"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-1">
                                {dob ? calculateAge(dob) : "-"}
                              </td>
                              <td className="px-4">
                                {dob ? (
                                  <DateFigure
                                    time={dob}
                                    format={"Do MMMM YYYY"}
                                  />
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td className="px-4 py-1">{mobileNumber}</td>
                              <td className="px-4 py-1 capitalize">
                                {deviceType}
                              </td>
                              <td className="px-4 py-1">
                                {/* <div className="flex items-center gap-2 mb-1">
                                  Reward :{" "}
                                  <div className="flex items-center flex-row">
                                    <img
                                      alt="icon"
                                      src={require("../../assets/coin.png")}
                                      style={{ height: 15, width: 15 }}
                                    />
                                    <span className="text-xs text-color capitalize ml-[5px]">
                                      {` ${Number(rewaredAmount).toFixed(0)}`}
                                    </span>
                                  </div>
                                </div> */}
                                <div className="flex items-center gap-2">
                                  {/* Wallet :{" "} */}
                                  <span className="text-xs text-color capitalize ">
                                    {`₹ ${Number(walletAmount).toFixed(2)}`}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-1">
                                <Toggle
                                  _id={_id && _id}
                                  value={status}
                                  handleChange={handleStatusUpdate}
                                />
                              </td>
                              <td className="px-4 text-center  sm:relative ">
                                <ShowOption
                                  handleView={() =>
                                    navigate("/user-profile", {
                                      state: { data: item, imageUrl },
                                    })
                                  }
                                  handleDelete={() => {
                                    setEditData(item);
                                    handleOpenModal("deleteModal");
                                  }}
                                  handleWallet={() => {
                                    setEditData(item);
                                    handleOpenModal("walletModal");
                                  }}
                                  // handleEdit={() => {
                                  //   setEditData(item);
                                  //   handleOpenModal("formModal");
                                  // }}
                                  // handleViewTeam={() => {
                                  //   navigate(`/${_id}/teams`, {
                                  //     state: {
                                  //       title: `User name : ${name}`,
                                  //       query: `userId=${_id}`,
                                  //     },
                                  //   });
                                  // }}

                                  handleViewTeam={() => {
                                    // navigate(`/${_id}/tdmPlayers`, {
                                    //   state: {
                                    //     title: `User name : ${name}`,
                                    //     query: `${_id}`, // _id,
                                    //   },
                                    // });
                                    handleOpenModal("playListModal");
                                    console.log(item);
                                  }}
                                  handleTransaction={() => {
                                    navigate(`/${_id}/transactions`);
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
          ) : (
            <TableLoader />
          )}
        </>
      </section>

      {/*--------  Modals -------- */}
      {modals.formModal && (
        <UpdateUser
          editData={editData}
          imageUrl={imageUrl}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal("deleteModal")}
          handleConfirm={handleDeleteGame}
          title="Player"
          loading={loading}
        />
      )}
      {modals.playListModal && (
        <PlayerList
          teamId={""}
          handleClose={() => handleCloseModal("playListModal")}
        />
      )}
      {modals.walletModal && (
        <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
          <form
            onSubmit={handleWallet}
            className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle mx-4 w-full sm:max-w-sm sm:p-6"
          >
            <div>
              {/* Top */}
              <div className="flex justify-between items-center">
                <span className="text-color">Update Wallet</span>
                <MdClose
                  className="text-xl cursor-pointer"
                  onClick={() => handleCloseModal("walletModal")}
                />
              </div>

              <div className="grid gap-1.5 mt-10 text-sm">
                <p className="mt-1 text-sm ">Add Amount</p>
                <input
                  autoComplete="off"
                  type="text"
                  className="border-color border outline-none w-full rounded text-sm tracking-wider placeholder:text-xs p-2"
                  value={walletBalance}
                  name="amount"
                  onChange={(event) => {
                    setErrors({
                      ...errors,
                      [event.target.name]: "",
                    });
                    setWalletBalance(event.target.value);
                  }}
                  placeholder="Enter Amount"
                />
                {validator.message("amount", walletBalance, "required|number")}
                <ShowError data={errors.amount} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3 ">
              <button
                type="submit"
                disabled={loading}
                className="bg-button w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
              >
                {loading ? <ButtonLoader /> : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Layout(Users);
