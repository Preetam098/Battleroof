import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { getTransactionListByUserId } from "../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import TableImage from "../../components/TableImage";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import DateFigure from "../../components/FomatDate";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import { GoUnverified, GoVerified } from "react-icons/go";
import { calculateAge } from "../../utils/constants";

const View = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data, imageUrl } = state;
  const dispatch = useDispatch();
  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
    type: "",
  });
  const { transactionList } = useSelector((state) => state.userReducer);
  const { data: transactions, pagination } = transactionList;

  useEffect(() => {
    dispatch(getTransactionListByUserId(data?._id, params));
  }, [dispatch, params, data]);

  let transactionArray = [
    {
      id: 0,
      label: "Dob",
      value: data?.dob ? (
        <DateFigure time={data?.dob} format={"Do MMMM YYYY"} />
      ) : (
        "-"
      ),
    },

    {
      id: 7,
      label: "Age",
      value: data?.dob ? calculateAge(data?.dob) : "-",
    },
    {
      id: 5,
      label: "Device Type",
      value: data?.deviceType ? data?.deviceType : "-",
    },
    { id: 6, label: "Upi", value: data?.upi ? data?.upi : "-" },

    { id: 1, label: "Credited", value: data?.bankCreditedAmount },
    { id: 2, label: "Winnings", value: data?.winningAmount },
    { id: 3, label: "Rewarded", value: data?.rewaredAmount },
    { id: 4, label: "Wallet", value: data?.walletAmount },
    {
      id: 8,
      label: "QR",
      value: data?.qrCode ? <TableImage src={data?.qrCode} /> : "-",
    },
  ];

  const transactionType = [
    "Credited",
    "Winnings",
    "Rewarded",
    "Refund",
    "Withdraw Request",
    "EntryFee",
  ];

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

  return (
    <div>
      <div className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white">
        <IoIosArrowBack
          onClick={() => navigate("/users")}
          className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
        />
        User Profile
      </div>
      {/* Content */}
      <section className="my-4 p-3 sm:p-8 grid gap-2 rounded bg-secondary">
        <figure className="sm:w-28 sm:h-28 w-20 h-20 border-2 border-color mx-auto table-head p-1 rounded-full">
          <img
            src={
              data?.profilePicture
                ? `${imageUrl}${data?.profilePicture}`
                : "https://img.freepik.com/free-icon/user_318-159711.jpg"
            }
            alt=""
            className="w-full h-full object-contain object-center rounded-full"
          />
        </figure>
        <div className="mx-auto text-sm items-center flex justify-center flex-col p-2">
          <div>
            <p>{data?.name}</p>
            {/* {data?.dob !== null ? <p>{calculateAge(data?.dob)} </p> : null} */}
          </div>
          <p className="text-gray-400">{data?.mobileNumber}</p>
          {(data?.email !== null || data?.email !== "") && (
            <div className="flex items-center gap-3">
              <p className="text-gray-400">{data?.email}</p>

              {data?.isEmailVerified ? (
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
        <div className="mx-auto max-w-2xl text-xs sm:text-sm gap-2 sm:gap-5 grid grid-cols-4">
          {transactionArray.map((item, index) => {
            return (
              <div className="table-head text-center p-3 rounded" key={index}>
                <p> {item?.label}</p>

                <div className="flex row items-center justify-center">
                  <p className="capitalize text-gray-400 flex row items-center justify-center">
                    {item?.label === "Rewarded" ? (
                      <div className="flex items-center flex-row">
                        <img
                          alt="coin"
                          src={require("../../assets/coin.png")}
                          style={{ height: 15, width: 15, marginRight: 5 }}
                        />
                      </div>
                    ) : (
                      <>
                        {item?.label === "Credited" ||
                          item?.label === "Winnings" ||
                          (item?.label === "Wallet" && (
                            <span className="text-xs text-color capitalize mr-2">
                              ₹
                            </span>
                          ))}
                      </>
                    )}
                    {item?.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="bg-secondary p-4 mb-4">
        <form className="mb-4 gap-4 justify-end flex">
          {/* from */}
          <div className="flex gap-3 items-center">
            <label htmlFor="type" className="text-gray-400">
              Filter By Type :
            </label>
            <select
              id="type"
              onChange={(event) => {
                setparams({
                  ...params,
                  type: event.target.value,
                });
              }}
              className=" outline-none bg-select border border-color rounded py-1 px-2 appearance-none tracking-wider text-sm"
            >
              <option value="">Select Type</option>
              {transactionType.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>
        </form>
        <div className="table-container">
          <table className="w-full down text-left whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tl-lg">
                  Image
                </th>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Name
                </th>

                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Phone
                </th>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Email
                </th>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head ">
                  Transaction Id
                </th>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Amount
                </th>

                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Type
                </th>
                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                  Upi
                </th>

                <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head flex-row items-center flex">
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-xs relative h-full overflow-y-auto">
              {transactions?.map((item, index) => {
                const {
                  _id,
                  transactionId,
                  amount,
                  type,
                  user,
                  paymentStatus,
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
                          user?.image
                            ? user?.image
                            : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                        }
                      />
                    </td>
                    <td className="px-4">{user?.name ? user?.name : "-"}</td>

                    <td className="px-4">
                      {user?.mobileNumber ? user?.mobileNumber : "-"}
                    </td>
                    <td className="px-4">{user?.email ? user?.email : "-"}</td>
                    <td className="px-4">{transactionId}</td>
                    <td className="px-4 py-1.5 sm:py-2 ">
                      <div className="flex items-center flex-row">
                        {type === "Rewarded" ? (
                          <div className="flex items-center flex-row">
                            <img
                              alt="coin"
                              src={require("../../assets/coin.png")}
                              style={{
                                height: 15,
                                width: 15,
                                marginRight: 5,
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs capitalize mr-2">₹</span>
                        )}

                        {amount}
                      </div>
                    </td>
                    <td className="px-4 py-3">{type}</td>
                    <td className="px-4 py-3">{user?.upi ? user?.upi : "-"}</td>
                    <td className="px-4 py-3">
                      <DateFigureWithUTC time={createdAt} />
                    </td>
                    <td className="px-4 py-1.5 sm:py-2 text-color">
                      {paymentStatus}
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
      </div>
    </div>
  );
};

export default Layout(View);
