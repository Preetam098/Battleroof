import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../redux/actions/authAction";
import SimpleReactValidator from "simple-react-validator";
import ShowError from "../../components/ShowError";

const UpdatePassword = ({ handleCloseModal }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formInput, setFormInput] = useState({});
  const { loading } = useSelector((state) => state.authReducer);

  const validator = new SimpleReactValidator({});

  // handleChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput({ ...formInput, [name]: value });
  };

  // handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validator.allValid()) {
      dispatch(updatePassword(formInput, handleCloseModal));
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-96 pb-10 md:w-1/2 h-full overflow-auto lg:w-1/3 p-4 bg-secondary shadow-xl">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Update Password</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
          {/* Name */}
          <div className="grid gap-1 text-sm">
            <label htmlFor="old_password">Old Password*</label>
            <input
              autoComplete="off"
              id="old_password"
              type="text"
              name="old_password"
              value={formInput?.old_password}
              onChange={handleChange}
              className="rounded p-2 px-3 outline-none border"
            />
            {validator.message(
              "old_password",
              formInput?.old_password,
              "required"
            )}
            <ShowError data={errors.old_password} />
          </div>

          {/* password */}
          <div className="grid gap-1 text-sm">
            <label htmlFor="password" className="text-sm">
              New Password
            </label>
            <input
              autoComplete="off"
              id="password"
              type="text"
              name="password"
              value={formInput?.password}
              onChange={handleChange}
              className="rounded p-2 px-3 outline-none border"
            />
            {validator.message("password", formInput?.password, "required")}
            <ShowError data={errors.password} />
          </div>

          {/* confirm_password */}
          <div className="grid gap-1 text-sm">
            <label htmlFor="confirm_password" className="text-sm">
              Confirm Password
            </label>
            <input
              autoComplete="off"
              id="confirm_password"
              type="text"
              name="confirm_password"
              value={formInput?.confirm_password}
              onChange={handleChange}
              className="rounded p-2 px-3 outline-none border"
            />
            {validator.message(
              "confirm_password",
              formInput?.confirm_password,
              "required"
            )}
            <ShowError data={errors.confirm_password} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2 px-4 mt-2 rounded text-white"
          >
            {loading ? "please wait..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
