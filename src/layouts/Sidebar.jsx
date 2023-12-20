import React, { Fragment, useState } from "react";
import Logo from "../assets/Logo.png";
import {
  MdBackup,
  MdClose,
  MdOutlineGames,
  MdOutlineSpaceDashboard,
  MdDashboardCustomize,
} from "react-icons/md";
import { VscSettings } from "react-icons/vsc";

import { TbGoGame } from "react-icons/tb";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { PiGameController, PiGitPullRequestLight } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { GoSponsorTiers } from "react-icons/go";
import { AiFillSetting } from "react-icons/ai";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { AiOutlineTransaction } from "react-icons/ai";
import { RiTeamLine } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";

const Sidebar = ({ handleToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState({
    League:
      location.pathname === "/league/stages" ||
      location.pathname === "/league/tournaments" ||
      location.pathname.startsWith("/league")
        ? true
        : false,
    Wallet:
      location.pathname === "/transactions" ||
      location.pathname === "/withdraw-requets"
        ? true
        : false,
    ManageGames:
      location.pathname === "/game-types" ||
      location.pathname === "/games" ||
      location.pathname === "/tournaments" ||
      location.pathname.startsWith("/tournaments")
        ? true
        : false,
  });

  // handleDropdown
  const handleDropdown = (e) => {
    console.log(e);
    setDropdown({
      ...dropdown,
      [e.name?.split(" ").join("")]: !dropdown[e.name?.split(" ").join("")],
    });
  };
  // handleNavigate
  const handleNavigate = (path) => navigate(path);

  // navlinks
  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <MdOutlineSpaceDashboard />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <FiUsers />,
    },
    {
      name: "Manage Games",
      icon: <VscSettings />,
      other: [
        {
          name: "Games Types",
          icon: <TbGoGame />,
          path: "/game-types",
        },

        {
          name: "Games",
          icon: <PiGameController />,
          path: "/games",
        },
        {
          name: "Tournaments",
          path: "/tournaments",
          icon: <MdOutlineGames />,
        },
      ],
    },

    // {
    //   name: "TDM Challenges",
    //   path: "/tdmPlayers",
    //   icon: <GiTabletopPlayers />,
    // },

    {
      name: "League",
      icon: <MdOutlineGames />,
      other: [
        {
          name: "Stages",
          path: "/league/stages",
          icon: <MdDashboardCustomize />,
        },
        {
          name: "League Tournaments",
          path: "/league/tournaments",
          icon: <MdOutlineGames />,
        },
        // { name: "Tournaments Stages", path: "/league/tournaments" },
      ],
    },

    // {
    //   name: "TDM Challenges",
    //   path: "/tdmPlayers",
    //   icon: <GiTabletopPlayers />,
    // },

    // {
    //   name: "League",
    //   icon: <MdOutlineGames />,
    //   other: [
    //     {
    //       name: "Stages",
    //       path: "/league/stages",
    //       icon: <MdDashboardCustomize />,
    //     },
    //     {
    //       name: "League Tournaments",
    //       path: "/league/tournaments",
    //       icon: <MdOutlineGames />,
    //     },
    //     // { name: "Tournaments Stages", path: "/league/tournaments" },
    //   ],
    // },

    {
      name: "Saved Team",
      path: "/saved-team",
      icon: <RiTeamLine />,
    },

    {
      name: "Notifications",
      path: "/notification",
      icon: <MdOutlineNotificationsActive />,
    },

    {
      name: "Wallet",
      icon: <FaWallet />,
      other: [
        {
          name: "Transactions",
          path: "/transactions",
          icon: <AiOutlineTransaction />,
        },
        {
          name: "Withdraw requests",
          path: "/withdraw-requets",
          icon: <PiGitPullRequestLight />,
        },
        // { name: "Tournaments Stages", path: "/league/tournaments" },
      ],
    },

    {
      name: "Support",
      path: "/support",
      icon: <BiSupport />,
    },

    {
      name: "Sponsor",
      path: "/sponsor",
      icon: <GoSponsorTiers />,
    },

    {
      name: "Backup",
      path: "/backup",
      icon: <MdBackup />,
    },
    {
      name: "Setting",
      path: "/setting",
      icon: <AiFillSetting />,
    },
  ];

  return (
    <div className="md:z-auto table-container w-full z-40">
      {/* Logo & Close Button */}
      <div className="flex items-center mb-8 justify-between">
        <div
          onClick={() => {
            window.location.reload();
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={Logo} alt="ApkiStore" className="w-28 block" />
        </div>
        <MdClose
          onClick={handleToggle}
          className="text-xl md:hidden cursor-pointer"
        />
      </div>

      {/* Links */}
      <section className="">
        {navLinks.map((item) => {
          return (
            <Fragment key={item.name}>
              <div
                onClick={() =>
                  item.other ? handleDropdown(item) : handleNavigate(item.path)
                }
                style={{
                  background: location.pathname === item.path && "#101829",
                  padding: 10,
                  borderRadius: 5,
                }}
                className="flex w-full lg:text-base text-sm cursor-pointer items-center relative gap-2 "
              >
                <div
                  className={`${
                    location.pathname === item.path && "text-color"
                  } hover-text-color flex items-center gap-2 `}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.other && (
                  <span className="cursor-pointer text-xs">
                    {dropdown[item.name?.split(" ").join("")] ? (
                      <BsChevronUp />
                    ) : (
                      <BsChevronDown />
                    )}
                  </span>
                )}
              </div>

              {/* Nested Links */}
              {item.other && dropdown[item.name?.split(" ").join("")] && (
                <div className="flex text-sm flex-col gap-2 p-2 px-10 pt-0 rounded mb-3">
                  {item.other.map((ite) => {
                    return (
                      <div key={ite.name} className="flex items-center gap-1.5">
                        {/* <MdRadioButtonUnchecked className="text-sm" /> */}
                        <Link
                          key={ite.name}
                          to={ite.path}
                          className={`${
                            (location.pathname === ite.path ||
                              location.pathname.startsWith(ite.path)) &&
                            "text-color"
                          } hover-text-color cursor-pointer flex items-center gap-2 px-[10px] py-[5px]`}
                          style={{
                            background:
                              (location.pathname === ite.path ||
                                location.pathname.startsWith(ite.path)) &&
                              "#101829",

                            borderRadius: 5,
                          }}
                        >
                          {item.icon && (
                            <span className="text-base">{ite.icon}</span>
                          )}
                          {ite.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </Fragment>
          );
        })}
      </section>
    </div>
  );
};

export default Sidebar;
