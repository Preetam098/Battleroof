import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { updateUser } from "../../redux/actions/userAction";
import ButtonLoader from "../../components/ButtonLoader";
import SimpleReactValidator from "simple-react-validator";
import ShowError from "../../components/ShowError";

const UpdateUser = ({ handleCloseModal, imageUrl, editData }) => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState();
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [formInput, setFormInput] = useState({ name: "", ...editData });
  const { loading } = useSelector((state) => state.userReducer);

  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      number: {
        message: "The :attribute must be a valid phone number.",
        rule: function (val, params, validator) {
          return (
            validator.helpers.testRegex(val, /^\d+$/) &&
            params.indexOf(val) === -1
          );
        },
      },
    },
  });

  // handle Change
  const handleChange = (event) => {
    const { name, type, value } = event.target;
    setIsEdit(true);
    setErrors({ ...errors, [name]: "" });
    if (type === "file") {
      setPreview(URL.createObjectURL(event.target.files[0]));
      setFormInput({ ...formInput, [name]: event.target.files[0] });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  // handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.keys(formInput).map((item) => {
      return payload.append(item, formInput[item]);
    });

    if (validator.allValid()) {
      if (isEdit) {
        dispatch(updateUser(editData._id, payload, handleCloseModal));
      } else {
        handleCloseModal();
      }
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-96 pb-10 md:w-2/3 h-full overflow-auto xl:w-1/3 p-4 bg-secondary shadow-xl">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Update User</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          {/* Name */}
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm">
              Name*
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              name="name"
              value={formInput?.name}
              onChange={handleChange}
              className="rounded py-1.5 px-2 outline-none border"
            />
            {validator.message("name", formInput?.name, "required")}
            <ShowError data={errors.name} />
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <label htmlFor="mobileNumber" className="text-sm">
              Phone*
            </label>
            <input
              autoComplete="off"
              id="mobileNumber"
              type="text"
              name="mobileNumber"
              value={formInput?.mobileNumber}
              onChange={handleChange}
              className="rounded py-1.5 px-2 outline-none border"
            />
            {validator.message(
              "mobileNumber",
              formInput?.mobileNumber,
              "required|number|min:10|max:15"
            )}
            <ShowError data={errors.mobileNumber} />
          </div>

          {/* Image */}
          <div className="grid gap-1.5">
            <label className="text-sm">Profile Picture*</label>
            <div>
              <label
                htmlFor="profilePicture"
                className="text-xs flex flex-col gap-1.5 justify-center rounded border-dashed border-[1.5px] p-4 items-center"
              >
                 {formInput.profilePicture?.name &&
                <img
                  src={
                    editData && !preview
                      ? `${imageUrl}${editData?.profilePicture}`
                      : preview
                  }
                  alt="user"
                  className="max-w-[170px] rounded"
                />
                }
                <MdOutlineCloudUpload className="text-xl mb-0.5" />
                {formInput.profilePicture?.name
                  ? formInput?.profilePicture.name
                  : " Upload Profile"}
              </label>
              <input
                autoComplete="off"
                id="profilePicture"
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="rounded py-1.5 px-2 hidden outline-none border"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2.5 px-4 mt-2 rounded text-white"
          >
            {loading ? <ButtonLoader /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
