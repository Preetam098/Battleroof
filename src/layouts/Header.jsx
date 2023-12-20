import Logo from "../assets/Logo.png";
import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { HiOutlineMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { MdOutlineNotificationsActive } from "react-icons/md";
import SearchBar from "./Components/SearchBar";
import UpdateProfile from "./Components/UpdateProfile";
import UpdatePassword from "./Components/UpdatePassword";

const Header = ({ handleToggle, toggle }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState();
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);

  const { email, role, ...data } = JSON.parse(localStorage.getItem("Admin"));

  // handleOpenModal
  const handleOpenModal = (value) =>
    setShowModal(showModal === value ? "" : value);

  return (
    <div className="p-2 sm:py-2.5 sm:px-4 rounded bg-secondary shadow tracking-wider flex items-center">
      {showModal === "Search" ? (
        <SearchBar handleOpenModal={handleOpenModal} />
      ) : (
        <>
          <HiOutlineMenu
            onClick={handleToggle}
            className="text-2xl cursor-pointer text-color"
          />

          {/* Logo */}
          <img
            src={Logo}
            alt="ApkiStore"
            className={`w-24 ${
              toggle ? "flex md:hidden" : "hidden md:flex"
            }  ml-4 sm:ml-8`}
          />

          {/* Icons */}
          <section className="flex sm:relative items-center ml-auto gap-3 sm:gap-5">
            <div
              onClick={() => handleOpenModal("Search")}
              className="icon-bg flex justify-center items-center text-2xl sm:text-3xl font-bold w-7 h-7 sm:w-9 sm:h-9 text-color rounded-full p-1.5 sm:p-2.5 cursor-pointer"
            >
              <GoSearch />
            </div>
            <button
              type="button"
              onClick={() => navigate("/notification")}
              className="icon-bg flex justify-center items-center text-2xl sm:text-3xl font-bold w-7 h-7 sm:w-9 sm:h-9 text-color rounded-full p-1.5 sm:p-2.5 cursor-pointer"
            >
              <MdOutlineNotificationsActive />
            </button>

            {/* Profile */}
            <section className="flex gap-2 sm:gap-3 items-center">
              <div className="sm:flex items-end hidden flex-col">
                <span className="font-bold text-color capitalize">{role}</span>
                <span className="text-sm ">{email}</span>
              </div>
              <div className="icon-bg z-10 flex justify-center items-center text-3xl font-bold w-7 h-7 sm:w-9 sm:h-9 text-color rounded-full">
                <img
                  onClick={() => handleOpenModal("Profile")}
                  src="https://img.freepik.com/free-icon/user_318-159711.jpg"
                  alt=""
                  className="w-full h-full cursor-pointer object-cover object-top rounded-full"
                />
              </div>
              {/* Profile Drawer */}
              {showModal === "Profile" && (
                <div className="rounded p-3  gap-1.5 w-44 z-30 absolute top-14 sm:top-16 right-3   bg-secondary text-sm  grid text-left shadow">
                  {/* <span
                    onClick={() => {
                      navigate("/setting/profile");
                      handleOpenModal("Profile");
                    }}
                    className="cursor-pointer"
                  >
                    My Profile
                  </span> */}

                  <span
                    onClick={() => {
                      setUpdateProfile(true);
                      handleOpenModal("Profile");
                    }}
                    className="cursor-pointer"
                  >
                    Update Profile
                  </span>
                  <span
                    onClick={() => {
                      setUpdatePassword(true);
                      handleOpenModal("Password");
                    }}
                    className="cursor-pointer"
                  >
                    Update Password
                  </span>
                  <span
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                    className="cursor-pointer"
                  >
                    Sign Out
                  </span>
                </div>
              )}
            </section>
          </section>

          {/* Update Profile */}
          {updateProfile && (
            <UpdateProfile
              data={data}
              handleCloseModal={() => setUpdateProfile(false)}
            />
          )}

          {/* Update Password */}
          {updatePassword && (
            <UpdatePassword handleCloseModal={() => setUpdatePassword(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
