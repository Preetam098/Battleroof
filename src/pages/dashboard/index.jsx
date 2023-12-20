import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import { FiUsers } from "react-icons/fi";
import { PiGameControllerLight } from "react-icons/pi";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { MdOutlineGames } from "react-icons/md";
import ReactApexcharts from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeviceCount,
  getRecordCount,
  getRegistrationCount,
  getTotalAmount,
  getTransactionList,
} from "../../redux/actions/userAction";
import { AiFillCreditCard, AiFillTrophy } from "react-icons/ai";
import { BsAndroid2, BsFillAwardFill } from "react-icons/bs";
import { RiRefundFill } from "react-icons/ri";
import { MdBookmarkRemove } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaApple } from "react-icons/fa";
import { filterTypes, getStartAndEndDates } from "../../utils/constants";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [defaultDateFilter, setdefaultDateFilter] = useState(
    JSON.stringify(getStartAndEndDates("This Week"))
  );
  const [graphData, setgraphData] = useState([]);
  const { recordCount, registrationCount, deviceCount, loading } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    dispatch(getTransactionList());
    dispatch(getRecordCount());
    dispatch(getTotalAmount(""));
    dispatch(getDeviceCount());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getRegistrationCount(JSON.parse(defaultDateFilter)));
  }, [dispatch, defaultDateFilter]);

  useEffect(() => {
    setgraphData(
      registrationCount?.map((item) => {
        return {
          count: item.count,
          date: `${
            item?._id?.month < 10 ? `0${item?._id?.month}` : item?._id?.month
          }/${item?._id?.day < 10 ? `0${item?._id?.day}` : item?._id?.day}/${
            item?._id?.year
          } GMT`,
        };
      })
    );
  }, [registrationCount]);

  const dummy = [
    {
      icon: <FiUsers />,
      title: "Users",
      value: `${recordCount?.player_count || 0}`,
    },
    {
      icon: <PiGameControllerLight />,
      title: "Games",
      value: `${recordCount?.game_count || 0}`,
    },
    {
      icon: <MdOutlineGames />,
      title: "Total Tournaments",
      value: `${recordCount?.tournament_count || 0}`,
    },
    {
      icon: <TbCurrencyRupeeNepalese />,
      title: "Completed Tournaments",
      value: `${recordCount?.completed_tournament_count || 0}`,
    },
  ];
  const deviceType = [
    {
      icon: <BsAndroid2 />,
      title: "Android Users",
      value: `${deviceCount?.android || 0}`,
    },
    {
      icon: <FaApple />,
      title: "Iphone Users",
      value: `${deviceCount?.ios || 0}`,
    },
  ];

  const transactionType = [
    {
      name: "User Wallet Balance",
      icons: <AiFillCreditCard />,
      value: recordCount?.userWalletAmount || 0,
      rupee: true,
    },
    {
      name: "Winning Distributed",
      icons: <AiFillTrophy />,
      value: recordCount?.userWinningAmount || 0,
      rupee: true,
    },
    {
      name: "Unsettled Tournament Count",
      icons: <BsFillAwardFill />,
      value: recordCount?.unsettled_tournament_count || 0,
      rupee: false,
    },
    {
      name: "Profit",
      icons: <RiRefundFill />,
      value: recordCount?.totalProfit || 0,
      rupee: true,
    },
    {
      name: "Block User",
      icons: <MdBookmarkRemove />,
      value: recordCount?.blocked_count || 0,
      rupee: false,
    },
    {
      name: "Active User",
      icons: <GiTakeMyMoney />,
      value: recordCount?.active_count || 0,
      rupee: false,
    },
  ];

  return (
    <div className="tracking-wider mb-6">
      <section className="grid lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-4">
        {/* Congrats */}
        {/* <div className="bg-secondary relative min-h-[150px] rounded">
          <div className="p-4 flex flex-col ">
            <h3>Congratulations 🎉 Admin</h3>
            <p className="text-gray-400 text-sm">You won a gold medal</p>
            <div className="mt-10">
              <Button title="View" />
            </div>
          </div>
          <figure className="absolute top-0 right-4">
            <img
              src="https://demos.pixinvent.com/vuexy-vuejs-admin-template-vue2/demo-1/img/badge.0fa134b5.svg"
              alt=""
            />
          </figure>
        </div> */}
        {/* Statistics */}
        <div className="   xl:col-span-2 rounded">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-2 ">
            {dummy.map((item) => {
              return (
                <div
                  key={item.title}
                  className="flex bg-secondary rounded items-center p-4 gap-3"
                >
                  <div className=" sm:text-xl text-color p-3 flex justify-center items-center rounded-full icon-bg">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="sm:text-base text-sm">{item.value}</span>
                    <span className="sm:text-sm text-xs text-gray-400">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-4">
        {/* transactions history */}
        <div className="bg-secondary relative  rounded">
          <div className=" bg-secondary p-4 xl:col-span-6 rounded mt-0">
            <h3 className=" flex justify-between ">
              <span>Total Balance</span>
              <span className="text-xs text-gray-400">{""}</span>
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-2 py-8">
              {transactionType.map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="sm:text-xl text-color p-3 flex justify-center items-center rounded-full icon-bg">
                      {item.icons}
                    </div>
                    <div className="flex flex-col">
                      <span className="sm:text-base text-sm">
                        {item?.rupee === true &&
                        item?.value >= 0 &&
                        item?.value != null ? (
                          <span style={{ fontSize: 16, color: "#fff" }}>
                            ₹{" "}
                          </span>
                        ) : null}

                        {item?.value}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="grid lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-4">
        <div className=" bg-secondary p-4 xl:col-span-2 rounded">
          <h3 className=" flex items-center justify-between ">
            <span>Statistics</span>
            <span className="text-xs text-gray-400">Updated 1 month ago</span>
          </h3>
        </div>
      </section>
      <section className=" gap-4 mt-4 mb-8 p-4 rounded flex-col  flex lg:flex-row w-full bg-secondary lg:items-center ">
        <div className="w-full lg:w-3/4">
          <div className="flex gap-3 items-center">
            <label htmlFor="type" className="text-gray-400">
              Filter By Date :
            </label>
            <select
              id="type"
              onChange={(event) => {
                setdefaultDateFilter(event.target.value);
              }}
              className=" outline-none bg-select border border-color rounded py-1 px-2 appearance-none tracking-wider text-sm"
            >
              {/* <option value="">All Transactions</option> */}
              {filterTypes?.map((item) => {
                return (
                  <option key={item} value={JSON.stringify(item.value)}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>
          {!loading ? (
            <ReactApexcharts
              type="bar"
              height={450}
              options={{
                chart: {
                  parentHeightOffset: 0,
                  toolbar: { show: true },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    distributed: true,
                    columnWidth: "35%",
                    startingShape: "rounded",
                    dataLabels: { position: "top" },
                  },
                },
                legend: { show: false },
                tooltip: {
                  enabled: true,
                  theme: "dark",

                  y: {
                    formatter: undefined,
                    title: {
                      formatter: (seriesName) => "Users",
                    },
                  },
                },
                dataLabels: {
                  offsetY: -15,
                  formatter: (val) => `${val}`,
                  style: {
                    fontWeight: 500,
                    colors: ["#32d583"],
                    // fontSize: theme.typography.body1.fontSize
                  },
                },
                // colors,
                states: {
                  hover: {
                    filter: { type: "none" },
                  },
                  active: {
                    filter: { type: "none" },
                  },
                },
                grid: {
                  show: false,
                  padding: {
                    top: 20,
                    // left: -5,
                    // right: -8,
                    // bottom: -12,
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: graphData?.map((item) => item.date) || [],
                  axisTicks: { show: false },
                  axisBorder: { color: "#32d583" },
                  labels: {
                    style: {
                      colors: "#32d583",
                    },
                  },
                },
                yaxis: {
                  labels: {
                    offsetX: -15,
                    formatter: (val) => `${val}`,
                    style: {
                      colors: "#32d583",
                    },
                  },
                },
                responsive: [
                  {
                    breakpoint: "350px",
                    options: {
                      plotOptions: {
                        bar: { columnWidth: "60%" },
                      },
                      grid: {
                        padding: { right: 20 },
                      },
                    },
                  },
                ],
              }}
              series={[{ data: graphData?.map((item) => item.count) }]}
            />
          ) : (
            <div class="animate-pulse  ">
              <div
                style={{
                  height: 450,
                }}
                class="flex space-x-4 items-baseline m-6"
              >
                <div class="flex-1 h-24 bg-gray-200 rounded"></div>
                <div class="flex-1 h-36 bg-gray-200 rounded"></div>
                <div class="flex-1 h-48 bg-gray-200 rounded"></div>
                <div class="flex-1 h-64 bg-gray-300 rounded"></div>
                <div class="flex-1 h-72 bg-gray-200 rounded"></div>
                <div class="flex-1 h-64 bg-gray-300 rounded"></div>
                <div class="flex-1 h-48 bg-gray-200 rounded"></div>
                <div class="flex-1 h-36 bg-gray-200 rounded"></div>
                <div class="flex-1 h-72 bg-gray-300 rounded"></div>
                <div class="flex-1 h-36 bg-gray-200 rounded"></div>
                <div class="flex-1 h-48 bg-gray-200 rounded"></div>
                <div class="flex-1 h-64 bg-gray-300 rounded"></div>
                <div class="flex-1 h-72 bg-gray-200 rounded"></div>
                <div class="flex-1 h-64 bg-gray-300 rounded"></div>
                <div class="flex-1 h-48 bg-gray-200 rounded"></div>
                <div class="flex-1 h-36 bg-gray-200 rounded"></div>
                <div class="flex-1 h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </div>
        <div className=" gap-6 xl:gap-2  flex flex-col md:flex-row lg:flex-col w-full   lg:w-1/4 justify-between ">
          {deviceType.map((item) => {
            return (
              <div
                key={item.title}
                className="flex bg-[#101829] rounded w-full items-center p-4 gap-3"
              >
                <div className=" sm:text-xl text-color p-3 flex justify-center items-center rounded-full bg-secondary">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="sm:text-base text-sm">{item.value}</span>
                  <span className="sm:text-sm text-xs text-gray-400">
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Layout(Dashboard);
