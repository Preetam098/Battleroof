import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/actions/authAction";
import ShowError from "../../components/ShowError";
import SimpleReactValidator from "simple-react-validator";

const UpdateProfile = ({ handleCloseModal, data }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState();
  const [formInput, setFormInput] = useState({ ...data });
  const { loading } = useSelector((state) => state.authReducer);

  // handleChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    if (name === "profilePicture") {
      setFormInput({ ...formInput, [name]: event.target.files[0] });
      setFile(URL.createObjectURL(event.target.files[0]));
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };
  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      fileSize: {
        message: "The :attribute must be max 1MB.",
        rule: function (val) {
          return val && val.size <= 1048576;
        },
      },
    },
  });

  // handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault();
    const { mobileNumber, name, profilePicture } = formInput;
    const payload = new FormData();
    payload.append("name", name);
    payload.append("mobileNumber", mobileNumber);
    payload.append("profilePicture", profilePicture);

    if (validator.allValid()) {
      dispatch(updateProfile(payload, handleCloseModal));
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
          <span className="text-color">Update Profile</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
          {/* Profile Picture */}
          <div className="mb-4">
            <div className="relative w-36 h-36 border-2 p-0.5 border-color rounded-full mx-auto">
              <img
                src={
                  file
                    ? file
                    : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                }
                alt=""
                className="w-full h-full object-cover object-top rounded-full mx-auto"
              />
              <label
                htmlFor="images"
                className="absolute bottom-2 text-lg cursor-pointer right-0 icon-bg w-7 h-7 flex justify-center items-center rounded-full"
              >
                +
              </label>
            </div>
            <input
              autoComplete="off"
              id="images"
              type="file"
              name="profilePicture"
              accept="image/jpeg"
              onChange={handleChange}
              className="rounded py-1.5 px-2 hidden outline-none border"
            />
            {validator.message(
              "profilePicture",
              formInput?.profilePicture,
              "fileSize"
            )}
            <ShowError data={errors.banner} />
          </div>

          {/* Name */}
          <div className="grid gap-1 text-sm">
            <label htmlFor="name">Name*</label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              name="name"
              value={formInput?.name}
              onChange={handleChange}
              className="rounded p-2 px-3 outline-none border"
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1 text-sm">
            <label htmlFor="Phone" className="text-sm">
              Phone*
            </label>
            <input
              autoComplete="off"
              id="Phone"
              type="text"
              name="mobileNumber"
              value={formInput?.mobileNumber}
              onChange={handleChange}
              className="rounded p-2 px-3 outline-none border"
            />
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

export default UpdateProfile;
