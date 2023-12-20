import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import Heading from "../../components/Heading";
import Pagination from "../../components/Pagination";
import { FcApproval } from "react-icons/fc";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import {
  appvoveRequest,
  withdrawRequest,
} from "../../redux/actions/userAction";
import ButtonLoader from "../../components/ButtonLoader";
import TableImage from "../../components/TableImage";
import Team from "../../assets/Team.gif";
import { BiTrashAlt } from "react-icons/bi";
import TableLoader from "../../components/Skeleton/TableLoader";
import DateFigure from "../../components/FomatDate";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

const Requests = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("All");
  const [params, setparams] = useState({
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
    paymentStatus: "All",
  });
  const { withdraw_list, loading, fetchLoader } = useSelector(
    (state) => state.userReducer
  );
  const { data, pagination } = withdraw_list;
  const [itemId, setItemId] = useState("");

  const [modals, setModals] = useState({
    deleteModal: false,
    qrImageModal: false,
  });

  // handle Open modal
  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true });
  };
  // handle Close modal
  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false });
    setItemId("");
  };

  const handleApprove = () => {
    const payload = [{ transactionId: itemId }];
    dispatch(
      appvoveRequest(payload, () => {
        setItemId("");
        handleCloseModal("");
      })
    );
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
    dispatch(withdrawRequest(params));
  }, [dispatch, params]);

  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="Withdraw Requests" />

      {/* Table Content */}
      <section className="w-full relative  bg-secondary p-3 pb-0 mt-2 sm:mt-3 rounded shadow">
        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto mb-3 overflow-y-hidden  border-gray-200 whitespace-nowrap ">
          {["All", "Success", "Pending", "Reject"].map((item) => {
            return (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  setparams({
                    ...params,
                    paymentStatus: item,
                  });
                }}
                className={`inline-flex  items-center h-8 -mb-px text-center ${
                  active !== item
                    ? "hover:text-emerald-500 text-gray-500"
                    : "text-color  border-b-2 border-color"
                }  bg-transparent px-1 whitespace-nowrap`}
              >
                {item}{" "}
                <span className="sm:inline-flex hidden pl-1">Requests</span>
              </button>
            );
          })}
        </div>
        {fetchLoader ? (
          <TableLoader />
        ) : (
          <>
            <div className="table-container">
              <table className="w-full down text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg ">
                      Name
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Mobile No
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head ">
                      Transaction Id
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      UPI
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      QR
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Amount
                    </th>{" "}
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Type
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                      Status
                    </th>
                    <th className="p-3 px-4 title-font tracking-wider font-medium text-sm text-gray-900  table-head  flex-row items-center flex ">
                      <span className="title-font tracking-wider font-medium text-sm mr-3">
                        Date
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
                    <th className="p-3 w-32 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tr-lg ">
                      Action
                    </th>
                  </tr>
                </thead>
                {pagination?.totalItems === 0 ? (
                  <div className="flex justify-center text-sm w-full text-white py-4">
                    <span>No data found</span>
                  </div>
                ) : (
                  <tbody className="text-xs relative h-full overflow-y-auto">
                    {data?.map((item, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 !== 0 && "table-head"}`}
                      >
                        <td className="px-4">{item?.name}</td>
                        <td className="px-4">{item?.mobile}</td>
                        <td className="px-4">{item?.transactionId}</td>
                        <td className="px-4">{item?.upi}</td>
                        <td className="px-1 py-1">
                          <div
                            onClick={() => {
                              setItemId(item?._id);
                              handleOpenModal("qrImageModal");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <TableImage
                              src={item?.qrCode ? item?.qrCode : Team}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-1.5 sm:py-2">
                          {item?.amount > 0 && (
                            <span style={{ fontSize: 14, color: "#fff" }}>
                              ₹{" "}
                            </span>
                          )}
                          {item.amount}
                        </td>
                        <td className="px-4 py-3">{item.type}</td>
                        <td className="px-4 py-3">{item.paymentStatus}</td>
                        <td className="px-4 py-3">
                          <DateFigure time={item.createdAt} />
                        </td>
                        <td className="px-4 py-1.5 sm:py-2">
                          <button
                            onClick={() => {
                              setItemId(item._id);
                              handleOpenModal("deleteModal");
                            }}
                            disabled={item.paymentStatus === "Success"}
                            className={`${
                              item.paymentStatus === "Success"
                                ? "text-color"
                                : "bg-button px-2 py-1 rounded"
                            }`}
                          >
                            {item.paymentStatus === "Success"
                              ? "Approved"
                              : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}
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
        )}
      </section>
      {modals.deleteModal && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center">
                  <FcApproval className="text-3xl" />
                </div>

                <div className="mt-2 text-center">
                  <h3
                    className=" font-medium leading-6 text-color capitalize "
                    id="modal-title"
                  >
                    Approve Withdraw Request
                  </h3>
                </div>
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3 ">
                <button
                  onClick={() => handleCloseModal("deleteModal")}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  // onClick={handleApprove}
                  onClick={() => {
                    handleApprove();
                    handleCloseModal("deleteModal");
                  }}
                  type="button"
                  disabled={loading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {loading ? <ButtonLoader /> : "Approve"}
                </button>
              </div>
            </div>
          </div>

          {/* <ConfrimationModal
            handleCancel={() => handleCloseModal("deleteModal")}
            handleConfirm={handleApprove}
            title="Withdrawal Approval"
            loading={loading}
          /> */}
        </>
      )}

      {modals?.qrImageModal && (
        <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
          <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div>
              <h3
                className="font-medium leading-6 text-color capitalize"
                id="modal-title"
              >
                QR Code
              </h3>
              <div className="mt-2 text-center align-middle flex justify-center">
                <img
                  src={data[0]?.qrCode ? data[0]?.qrCode : Team}
                  style={{ height: 200, width: 200, marginTop: 15 }}
                />
              </div>
              {data[0]?.amount > 0 && (
                <p style={{ marginTop: 20 }}>Amount : ₹{data[0]?.amount}</p>
              )}
            </div>

            <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
              <button
                onClick={() => handleCloseModal("qrImageModal")}
                type="button"
                className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout(Requests);
