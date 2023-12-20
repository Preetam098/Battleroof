import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layouts";
import Heading from "../../components/Heading";
import Pagination from "../../components/Pagination";
import { ExportUserCSV, transactionLogs } from "../../redux/actions/userAction";
import NoData from "../../components/NoData";
import TableImage from "../../components/TableImage";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import TableLoader from "../../components/Skeleton/TableLoader";
import Button from "../../components/Button";
import { transaction_csv_export } from "../../utils/endpoints";
import DateFigureWithUTC from "../../components/FormatDateWithUtc";
import SearchBox from "../../components/SearchBox";
import { debounce, drop } from "lodash";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Transaction = () => {
  const dispatch = useDispatch();
  const { transactions, fetchLoader } = useSelector(
    (state) => state.userReducer
  );

  const { data, pagination } = transactions;
  const [dropValue, setDropValue] = useState();

  const groupedData = {};
  data?.forEach((item) => {
    const key = item.userId;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });

  const resultArray = Object.values(groupedData);

  const [params, setparams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    sort: "createdAt",
    order: "desc",
    type: "",
  });

  const allTypes = [
    "Credited",
    "Winnings",
    "Rewarded",
    "Refund",
    "Withdraw Request",
    "EntryFee",
  ];

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
    dispatch(transactionLogs(params));
  }, [dispatch, params]);

  const downloadDataInCsv = () => {
    dispatch(ExportUserCSV(transaction_csv_export));
  };
  const handleDebouncedChange = debounce((event) => {
    setparams({
      ...params,
      search: event.target.value,
    });
  }, 500);

  return (
    <div className="tracking-wider notification-container pb-12 overflow-auto h-full">
      <Heading title="Transactions" />

      <section className="w-full relative bg-secondary p-3 pb-0 my-2 sm:my-3 rounded shadow">
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="User"
            // value={searchValue}
            handleChange={handleDebouncedChange}
          />

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
              <option value="">All Transactions</option>
              {allTypes.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <Button title={`Export`} event={downloadDataInCsv} />
          </div>
        </div>

        {fetchLoader ? (
          <TableLoader />
        ) : (
          <>
            {resultArray?.length === 0 ? (
              <NoData />
            ) : (
              <>
                <div className="table-container">
                  <table className="w-full down text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 px-4 pl-8 title-font tracking-wider font-medium text-gray-900 text-sm table-head  rounded-tl-lg ">
                          Image
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head flex row">
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
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Phone
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          email
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Transaction Id
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Amount
                        </th>{" "}
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head">
                          Type
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head flex-row items-center flex ">
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
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-gray-900 text-sm table-head rounded-tr-lg ">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {resultArray?.map((userTxn, index) => {
                        return (
                          dropValue === userTxn[0]._id
                            ? userTxn
                            : userTxn.slice(0, 1)
                        )?.map((item, ind) => {
                          const {
                            image,
                            _id,
                            transactionId,
                            amount,
                            type,
                            paymentStatus,
                            createdAt,
                            name,
                            mobile,
                            email,
                            amountType,
                          } = item;
                          return (
                            <tr
                              key={_id}
                              className={`${index % 2 !== 0 && "table-head"} ${
                                ind != 0 && "text-[10px]"
                              } `}
                            >
                              <td className="pr-4 flex items-center py-2">
                                <div className="pl-1.5">
                                  {ind == 0 && userTxn.length > 1 ? (
                                    <>
                                      {item._id == dropValue ? (
                                        <FaChevronUp
                                          className="cursor-pointer text-color"
                                          onClick={() =>
                                            setDropValue(
                                              item._id == dropValue
                                                ? ""
                                                : item._id
                                            )
                                          }
                                        />
                                      ) : (
                                        <FaChevronDown
                                          className="cursor-pointer text-color"
                                          onClick={() =>
                                            setDropValue(
                                              item._id == dropValue
                                                ? ""
                                                : item._id
                                            )
                                          }
                                        />
                                      )}
                                    </>
                                  ) : (
                                    <div className="invisible">H</div>
                                  )}
                                </div>
                                <div className="pl-3">
                                  <TableImage
                                    src={
                                      image
                                        ? image
                                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                                    }
                                  />
                                </div>
                              </td>
                              <td className="px-4">{name ? name : "-"}</td>
                              <td className="px-4">{mobile ? mobile : "-"}</td>
                              <td className="px-4">{email ? email : "-"}</td>
                              <td className="px-4">{transactionId}</td>
                              <td
                                className="px-4 py-1.5 sm:py-2"
                                style={{
                                  alignItems: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                  paddingTop: 18,
                                }}
                              >
                                {amountType === "rupee" ? (
                                  <span
                                    style={{
                                      fontSize: 14,
                                      color: "#fff",
                                      marginRight: 5,
                                    }}
                                  >
                                    ₹{" "}
                                  </span>
                                ) : (
                                  <img
                                    alt="coin"
                                    src={require("../../assets/coin.png")}
                                    style={{
                                      height: 14,
                                      width: 14,
                                      marginRight: 5,
                                    }}
                                  />
                                )}
                                {amount}
                              </td>
                              <td className="px-4 py-3">{type}</td>
                              <td className="px-4 py-3">
                                <DateFigureWithUTC time={createdAt} />
                              </td>
                              <td className="px-4 py-1.5 sm:py-2 text-color">
                                {paymentStatus}
                              </td>
                            </tr>
                          );
                        });
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
    </div>
  );
};

export default Layout(Transaction);
