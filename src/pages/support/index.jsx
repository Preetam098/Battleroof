import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import { useDispatch, useSelector } from "react-redux";
import { addSupport, getSupportView } from "../../redux/actions/userAction";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../components/ButtonLoader";

const Support = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.authReducer);
  const [formInput, setFormInput] = useState({});

  // handle change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput({ ...formInput, [name]: value });
  };

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = formInput;
    dispatch(
      addSupport(payload, () => {
        navigate("/dashboard");
      })
    );
  };

  // useEffect
  useEffect(() => {
    dispatch(getSupportView((e) => setFormInput(e)));
  }, [dispatch]);

  return (
    <div className="w-full h-full relative table-container bg-secondary  rounded shadow">
      {/* Banner */}
      <section className="relative rounded-t-lg block h-40">
        <div className="absolute top-0 rounded-t-lg w-full h-full bg-center bg-cover">
          <span
            id="blackOverlay"
            className="w-full sm:p-4 p-2.5 h-full flex flex-col justify-between rounded-t-lg absolute bg-modal "
          >
            {/* Back Button */}
            <div
              onClick={() => navigate("/dashboard")}
              className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex text-white"
            >
              <IoIosArrowBack className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl" />
              {"Support"}
            </div>
          </span>
        </div>
      </section>

      {/* Content */}
      <div className="flex relative flex-col  justify-center p-5 pt-12 rounded-b-xl">
        {/* Form */}
        <form onSubmit={handleSubmit} className="my-7 ">
          <section className="max-w-md grid gap-2.5 mx-auto">
            {/* Mobile Number */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="phoneNumber">Mobile Number</label>
              <input
                autoComplete="off"
                id="supportMobile"
                name="supportMobile"
                maxLength={10}
                value={formInput?.supportMobile}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* Email */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="email">Email</label>
              <input
                autoComplete="off"
                id="supportEmail"
                type="email"
                name="supportEmail"
                value={formInput?.supportEmail}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>
            <div className="grid gap-1 text-sm">
              <label htmlFor="email">Discord</label>
              <input
                autoComplete="off"
                id="discord"
                type="text"
                name="discord"
                value={formInput?.discord}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2 px-4 rounded text-white"
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Layout(Support);
