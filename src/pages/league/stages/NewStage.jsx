import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import ShowError from "../../../components/ShowError";
import SimpleReactValidator from "simple-react-validator";
import ButtonLoader from "../../../components/ButtonLoader";
import { addStage, updateStage } from "../../../redux/actions/leagueAction";

const NewStage = ({ handleCloseModal, editData }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [formInput, setFormInput] = useState({});
  const { loading } = useSelector((state) => state.leagueReducer);

  const validator = new SimpleReactValidator();

  // handle Change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    setIsEdit(true);
    setFormInput({ ...formInput, [name]: value });
  };

  // handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validator.allValid()) {
      if (editData) {
        if (isEdit) {
          dispatch(updateStage(editData._id, formInput, handleCloseModal));
        } else {
          handleCloseModal();
        }
      } else {
        dispatch(addStage(formInput, handleCloseModal));
      }
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  // UseEffects
  useEffect(() => {
    if (editData) {
      setFormInput({ ...formInput, ...editData });
    }
  }, [editData]);

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="pb-10 w-2/3 h-full overflow-auto xl:w-1/2 p-4 bg-secondary shadow-xl">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            {editData ? "Update" : "Add"} Stage
          </span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          {/* Name*/}
          <div className="grid gap-1">
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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2 px-4 mt-2 rounded text-white"
          >
            {loading ? <ButtonLoader /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewStage;
