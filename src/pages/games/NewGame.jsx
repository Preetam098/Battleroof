import Select from "react-select";
import { BiTrashAlt } from "react-icons/bi";
import { AiFillPlusCircle } from "react-icons/ai";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";

import {
  addGame,
  getGameTypes,
  updateGame,
} from "../../redux/actions/gameAction";
import ButtonLoader from "../../components/ButtonLoader";
import SimpleReactValidator from "simple-react-validator";
import ShowError from "../../components/ShowError";

const NewGame = ({ handleCloseModal, editData, imageUrl }) => {
  const dispatch = useDispatch();
  const [BetAmount, setBetAmount] = useState(
    editData ? [...editData.betAmount] : [""]
  );
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [formInput, setFormInput] = useState({});
  const { loading, gameTypes } = useSelector((state) => state.gameReducer);
  const { results } = gameTypes;
  const [preview, setPreview] = useState({});
  const imagesRed = useRef("");
  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      number: {
        message: "The :attribute must be a number.",
        rule: function (val, params, validator) {
          return (
            validator.helpers.testRegex(val, /^\d+$/) &&
            params.indexOf(val) === -1
          );
        },
      },
      fileSize: {
        message: "The :attribute must be max 1MB.",
        rule: function (val, maxSize, validator) {
          return val && val.size <= 1048576;
        },
      },
    },
  });

  // handle Change
  const handleChange = (event) => {
    const { name, type, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    setIsEdit(true);
    if (type === "file") {
      setPreview({
        ...preview,
        [name]: URL.createObjectURL(event.target.files[0]),
      });
      setFormInput({ ...formInput, [name]: event.target.files[0] });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  // Options
  const options = results?.map((item) => {
    return { value: item, label: item.name };
  });

  // duplicate bet amount
  const addBetAmount = () => {
    const rowsInput = "";
    setBetAmount([...BetAmount, rowsInput]);
  };

  // delete bet amount
  const deleteBetAmount = (index) => {
    const rows = [...BetAmount];
    rows.splice(index, 1);
    setBetAmount(rows);
  };

  // handle bet amount Change
  const handleRuleChange = (index, evnt) => {
    const { value } = evnt.target;
    const rowsInput = [...BetAmount];
    rowsInput[index] = value;
    setIsEdit(true);
    setBetAmount(rowsInput);
  };

  // handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("betAmount", BetAmount);

    Object.keys(formInput).map((item) => {
      return payload.append(
        item,
        item === "gameTypes"
          ? JSON.stringify(formInput[item].map((val) => val.value))
          : formInput[item]
      );
    });

    if (validator.allValid()) {
      if (editData) {
        if (isEdit) {
          dispatch(updateGame(editData._id, payload, handleCloseModal));
        } else {
          handleCloseModal();
        }
      } else {
        dispatch(addGame(payload, handleCloseModal));
      }
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };
  const fetchImage = async (url, type) => {
    try {
      const response = await fetch(`${imageUrl}${url}`);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: "image/png" });
      // setImageFile(file);
      imagesRed.current = {
        ...imagesRed.current,
        [type]: file,
      };
    } catch (error) {
      console.error("Error fetching or converting image:", error);
    }
  };
  // UseEffects
  useEffect(() => {
    dispatch(getGameTypes());
    if (editData) {
      if (editData?.banner) {
        fetchImage(editData?.banner, "banner", formInput);
      }
      if (editData?.image) {
        fetchImage(editData?.image, "image", formInput);
      }
    }
  }, [dispatch, editData]);

  useEffect(() => {
    if (editData) {
      const { betAmount, gameTypes, _id, __v, createdAt, updatedAt, ...other } =
        editData;

      setBetAmount(betAmount);
      const data = gameTypes?.map((item) => {
        return { value: item, label: item.name };
      });

      setFormInput({
        ...formInput,
        ...other,
        gameTypes: data,
        ...imagesRed.current,
      });
    }
  }, [imagesRed.current, editData]);

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="pb-10 w-2/3 h-full overflow-auto xl:w-1/2 p-4 bg-secondary shadow-xl">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">{editData ? "Update" : "Add"} Game</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          {/* Name & Ad Reward */}
          <section className="flex md:items-start md:grid md:grid-cols-2 flex-col gap-2 ">
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

            <div className="grid gap-1">
              <label htmlFor="link" className="text-sm">
                Link
              </label>
              <input
                autoComplete="off"
                id="link"
                type="text"
                name="streamingLink"
                value={formInput?.streamingLink}
                onChange={handleChange}
                className="rounded py-1.5 px-2 outline-none border"
              />
            </div>
          </section>

          {/* Link */}

          {/* Types */}
          <div className="grid gap-1">
            <label htmlFor="status" className="text-sm">
              Types*
            </label>
            <Select
              name="gameTypes"
              isMulti
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#32d583",
                  primary: "#1e2a3a",
                },
              })}
              value={formInput?.gameTypes}
              onChange={(event) => {
                setErrors({ ...errors, gameTypes: "" });
                setIsEdit(true);
                setFormInput({ ...formInput, gameTypes: event });
              }}
              options={options}
            />
            {validator.message("gameTypes", formInput?.gameTypes, "required")}
            <ShowError data={errors.gameTypes} />
          </div>

          {/* Bet Amount */}
          <div className="grid items-start gap-1">
            <label htmlFor="rules" className="text-sm">
              Bet Amount
            </label>
            <div className="grid grid-cols-2 gap-4">
              {BetAmount.map((item, index) => {
                return (
                  <div key={index} className="w-full flex items-start gap-2">
                    <div>
                      <input
                        autoComplete="off"
                        id="rules"
                        type="text"
                        value={item}
                        onChange={(event) => handleRuleChange(index, event)}
                        className="rounded w-full bg-transparent py-1 mb-1 px-2 outline-none border"
                      />
                      {validator.message("betAmount", item, "number")}
                      <ShowError data={errors.betAmount} />
                    </div>
                    <div className="flex items-center pt-1.5 gap-2">
                      {BetAmount.length !== 1 && (
                        <BiTrashAlt
                          onClick={() => deleteBetAmount(index)}
                          className="text-color text-xl cursor-pointer"
                        />
                      )}
                      <AiFillPlusCircle
                        onClick={addBetAmount}
                        className="text-color text-xl cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="grid gap-1">
            <label className="text-sm">Image*</label>
            <div>
              <label
                htmlFor="images"
                className="text-xs flex flex-col gap-1 justify-center rounded border-dashed border-[1.5px] p-4 items-center"
              >
                {formInput?.image?.name && (
                  <img
                    src={
                      editData && !preview.image
                        ? `${imageUrl}${editData?.image}`
                        : preview?.image
                    }
                    alt="preview"
                    className="max-w-[170px] rounded"
                  />
                )}

                <MdOutlineCloudUpload className="text-xl mb-0.5" />
                {formInput?.image?.name
                  ? formInput?.image.name
                  : " Upload Image"}
              </label>
              <input
                autoComplete="off"
                id="images"
                type="file"
                name="image"
                accept="image/jpeg"
                onChange={handleChange}
                className="rounded py-1.5 px-2 hidden outline-none border"
              />
            </div>
            {validator.message("image", formInput?.image, "required|fileSize")}
            <ShowError data={errors.image} />
          </div>

          {/* Banner */}
          <div className="grid gap-1">
            <label className="text-sm">Banner*</label>
            <div>
              <label
                htmlFor="banner"
                className="text-xs flex flex-col gap-1 justify-center rounded border-dashed border-[1.5px] p-4 items-center"
              >
                {formInput?.banner?.name && (
                  <img
                    src={
                      editData && !preview.banner
                        ? `${imageUrl}${editData?.banner}`
                        : preview?.banner
                    }
                    alt="previewbanner"
                    className="max-w-[170px] rounded"
                  />
                )}

                <MdOutlineCloudUpload className="text-xl mb-0.5" />
                {formInput?.banner?.name
                  ? formInput?.banner.name
                  : " Upload Banner"}
              </label>
              <input
                autoComplete="off"
                id="banner"
                type="file"
                name="banner"
                accept="image/jpeg"
                onChange={handleChange}
                className="rounded py-1.5 px-2 hidden outline-none border"
              />
            </div>
            {validator.message(
              "banner",
              formInput?.banner,
              "required|fileSize"
            )}
            <ShowError data={errors.banner} />
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

export default NewGame;
