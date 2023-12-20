import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";

import {
  addTournament,
  updateTour,
} from "../../redux/actions/tournamentAction";
import { getGames } from "../../redux/actions/gameAction";
import ButtonLoader from "../../components/ButtonLoader";
import ShowError from "../../components/ShowError";
import ReactQuill from "react-quill";
///form hook

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
const NewTour = ({ handleCloseModal, editData, imageUrl, params }) => {
  const schema = yup.object({
    name: yup.string().required("Tournament Name is required."),
    gameId: yup.string().required("Game Name is required."),
    gameMode: yup.string().required("Game Mode is required."),
    format: yup.string().required("Game Format is required."),
    map: yup.string().required("Game Map is required."),
    totalSlots: yup
      .number()
      .typeError("Slot must be a number")
      .nullable()
      .test({
        name: "custom-validation",
        test: function (value) {
          const gameMode = this.parent.gameMode;
          if (gameMode === null) {
            return this.createError({
              path: "totalSlots",
              message: "Select Game Mode first.",
            });
          }
          if (gameMode === "solo" && value > 100) {
            return this.createError({
              path: "totalSlots",
              message: "Solo mode should have at most 100 slots",
            });
          } else if (gameMode === "duo" && value > 50) {
            return this.createError({
              path: "totalSlots",
              message: "Duo  mode should have at most 50 slots",
            });
          } else if (gameMode === "squad" && value > 25) {
            return this.createError({
              path: "totalSlots",
              message: "Squad  mode should have at most 25 slots",
            });
          }

          return true;
        },
      })
      .required("Slots are required")
      .test(
        "Is positive?",
        "The number must be greater than 0!",
        (value) => value > 0
      ),
    entryFeeType: yup.string().required("Entry Fee Type is required."),
    entryFee: yup
      .number()
      .typeError("Entery Fee must be a number")
      .nullable()
      .required("Entry Fee is required.")
      .test(
        "Is positive?",
        "The number must be greater than -1!",
        (value) => value > -1
      ),
    commission: yup.string().required("Commission is required."),
    type: yup.string().required("Tournament type is required."),
    totalWinners: yup
      .number()
      .typeError("Total winners must be a number.")
      .nullable()
      .required("Total winners is required.")
      .test(
        "Is positive?",
        "The number must be greater than 0!",
        (value) => value > 0
      ),
    startDateTime: yup
      .date()
      .typeError("Invalid date format")
      .required("Start date time is required")
      .test(
        "is-valid-date",
        "Start date cannot be before today",
        function (value) {
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison

          // Convert the start date to a Date object
          const startDate = new Date(value);

          // Perform the comparison
          return startDate >= today;
        }
      ),
    endDateTime: yup
      .date()
      .typeError("Invalid date format")
      .required("End date time is required")
      .test(
        "end-date-validation",
        "End date cannot be before start date",
        function (value) {
          // Convert the start date to a Date object
          const startDate = this.parent.startDateTime;
          const endDate = new Date(value);
          // Perform the comparison
          return endDate >= startDate;
        }
      ),
    rules: yup.string().required("Rules are required."),
    banner: yup
      .mixed()
      .required("Image are required.")
      .test("fileType", "Only JPEG images are allowed", (value) => {
        if (!value) return true; // Empty value is handled by the 'required' validation
        return value && value.type === "image/jpeg";
      })
      .test("fileSize", "File size must be less than 1MB", (value) => {
        if (!value) return true; // Empty value is handled by the 'required' validation
        return value && value.size <= 1024 * 1024; // 1MB in bytes
      }),
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit: submitForm,
    formState: { errors: formErrors },

    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "single match",
    },
  });
  const allValues = getValues();

  const selectedGameMode = watch("gameMode");
  const selectedEnteryFee = watch("entryFee");
  const selectedTotalWinners = watch("totalWinners");
  const selectedCommission = watch("commission");
  // const startDateTime = watch("startDateTime");
  // const endDateTime = watch("endDateTime");
  const slots = watch("totalSlots");

  React.useEffect(() => {
    setValue("totalSlots", undefined);
    setWinningPrizes([]);
  }, [selectedGameMode, setValue]);
  React.useEffect(() => {
    setWinningPrizes([]);
  }, [selectedEnteryFee, selectedCommission, selectedTotalWinners]);
  React.useEffect(() => {
    setWinningPrizes([]);
  }, [slots]);

  const dispatch = useDispatch();
  const [preview, setPreview] = useState();

  const [isCalculate, setIsCalculate] = useState(false);

  const [winningPrizes, setWinningPrizes] = useState([]);
  const [message, setMessage] = useState("");
  const { results } = useSelector((state) => state.gameReducer.games);
  const { loading } = useSelector((state) => state.tournamentReducer);

  const PriceArray = [
    {
      id: 1,
      entryFeeType: "rupee",
    },
    {
      id: 2,
      entryFeeType: "coin",
    },
  ];

  let winningAmounts = [];
  // handleCalculatePrize
  const handleCalculatePrize = () => {
    const { totalSlots, entryFee, commission, totalWinners } = getValues();
    setIsCalculate(true);
    // condition: totalSlots && entryFee && commission.toString() && totalWinners
    if (totalSlots && entryFee && commission.toString()) {
      // Calculate the total entry fee amount
      const totalEntryFee = totalSlots * entryFee;

      // Calculate the commission amount
      const totalCommission = (totalEntryFee * commission) / 100;

      // Calculate the prize pool amount after deducting the commission
      const prizePool = totalEntryFee - totalCommission;

      // Calculate the total number of winners based on rank
      const totalWin = Math.min(totalWinners, totalSlots);

      // Calculate the winning amount for each rank
      winningAmounts = Array.from(Array(totalWin), (_, i) => {
        const rank = totalWin - i;
        const coins = Math.floor(
          (2 * prizePool * rank) / (totalWin * (totalWin + 1))
        );

        return { name: `Rank4${i}`, value: coins || 0 };
      });

      setWinningPrizes(winningAmounts);
      setMessage(
        totalWinners === "" || totalWinners === "0" || totalWinners === 0
          ? "There are no winners declared."
          : ""
      );
    }
  };

  // handleSubmit
  const handleSubmit = (values) => {
    console.log(rules);
    const keys = Object.keys(values);
    let winning = winningPrizes.map((item, index) => {
      return {
        rank: index + 1,
        amount: item.value,
        pp: item?.pp,
      };
    });

    if (winning.length === 0 && editData?.winnings.length > 0) {
      winning = editData?.winnings;
    }
    let winninPriceFilter = [];
    if (winningPrizes != []) {
      winningPrizes.map((item, index) => {
        winninPriceFilter.push(item.value);
      });
    }

    const totalDistributedCoins = winninPriceFilter.reduce(
      (total, coins) => parseInt(total) + parseInt(coins),
      0
    );

    let payload = new FormData();
    keys.forEach((item) => {
      if (item === "startDateTime" || item === "endDateTime") {
        payload.append(item, moment(values[item]).format("YYYY-MM-DDTHH:mm"));
      } else {
        payload.append(item, values[item]);
      }
    });
    payload.append("winnings", JSON.stringify(winning));
    payload.append(
      "prizePool",
      editData
        ? isCalculate
          ? totalDistributedCoins
          : editData?.prizePool
        : totalDistributedCoins
    );
    console.log(payload);

    if (editData) {
      dispatch(updateTour(editData?._id, payload, params, handleCloseModal));
    } else {
      dispatch(addTournament(payload, params, handleCloseModal));
    }
    // }
  };
  const fetchImage = async (url) => {
    try {
      const response = await fetch(`${imageUrl}${url}`);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      // setImageFile(file);
      setValue("banner", file);
    } catch (error) {
      console.error("Error fetching or converting image:", error);
    }
  };
  // useffect
  useEffect(() => {
    dispatch(getGames());
    if (editData) {
      const { rules, winnings, prizePool, ...other } = editData;

      setValue("name", other.name);
      setValue("gameId", other.gameId);
      setValue("streamingLink", other.streamingLink);
      setValue("gameMode", other.gameMode);
      setValue("map", other.map);
      setValue("format", other.format);
      setValue("entryFeeType", other.entryFeeType);
      setValue("entryFee", other.entryFee);
      setValue("commission", other.commission);
      setValue("totalWinners", other.totalWinners);
      setValue("type", other.type);
      setValue("startDateTime", other.startDateTime);
      setValue("endDateTime", other.endDateTime);

      console.log(rules);
      setValue("rules", rules);
      fetchImage(other.banner);
      setTimeout(() => {
        setValue("totalSlots", other.totalSlots);
      }, 100);

      // setRuleInput(rules);
    }
  }, [dispatch, editData]);

  const rules = watch("rules");
  const entryFeeType = watch("entryFeeType");
  const onRulesStateChange = (e) => {
    setValue("rules", e);
  };

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full sm:w-5/6 lg:w-4/5 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            {editData ? "Update" : "Add"} Tournaments
          </span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>
        <form onSubmit={submitForm(handleSubmit)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-1">
              <label htmlFor="tournamentName">Tournament Name*</label>
              <input
                autoComplete="off"
                id="tournamentName"
                type="text"
                name="name"
                {...register("name")}
                className="rounded bg-transparent py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.name?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="gameId">Game Name*</label>
              <select
                id="gameId"
                name="gameId"
                {...register("gameId")}
                className="rounded bg-select appearance-none text-sm px-2 py-1.5 outline-none border"
              >
                <option value="">Select Game</option>
                {results?.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <ShowError data={formErrors.gameId?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="streamingLink">Streaming Link</label>
              <input
                autoComplete="off"
                id="streamingLink"
                name="streamingLink"
                type="text"
                {...register("streamingLink")}
                className="rounded bg-transparent text-sm px-2 py-1.5 outline-none border"
              />
            </div>
            <section className="grid gap-1">
              <label>Game Mode*</label>
              <div className="flex items-center py-2 text-xs gap-6">
                {/* solo */}
                <div className="flex gap-1">
                  <input
                    autoComplete="off"
                    id="Solo"
                    type="radio"
                    value="solo"
                    name="gameMode"
                    {...register("gameMode")}
                    className="rounded bg-transparent py-1 px-2 outline-none border"
                  />
                  <label htmlFor="Solo">Solo</label>
                </div>

                {/* Duo */}
                <div className="flex gap-1">
                  <input
                    autoComplete="off"
                    id="Duo"
                    type="radio"
                    value="duo"
                    name="gameMode"
                    {...register("gameMode")}
                    className="rounded bg-transparent py-1 px-2 outline-none border"
                  />
                  <label htmlFor="Duo">Duo</label>
                </div>

                {/* Squad */}
                <div className="flex gap-1">
                  <input
                    autoComplete="off"
                    id="Squad"
                    type="radio"
                    value="squad"
                    name="gameMode"
                    {...register("gameMode")}
                    className="rounded bg-transparent py-1 px-2 outline-none border"
                  />
                  <label htmlFor="Squad">Squad</label>
                </div>
              </div>
              <ShowError data={formErrors.gameMode?.message} />
            </section>
            {/* Map */}
            <div className="grid gap-1">
              <label htmlFor="map">Game Map*</label>
              <input
                autoComplete="off"
                id="map"
                name="map"
                type="text"
                {...register("map")}
                className="rounded bg-transparent text-sm px-2 py-1.5 outline-none border"
              />
              <ShowError data={formErrors.map?.message} />
            </div>

            {/* Format */}
            <section className="grid gap-1">
              <label htmlFor="format">Format*</label>
              <select
                autoComplete="off"
                id="format"
                name="format"
                {...register("format")}
                className="rounded bg-secondary text-sm px-2 py-1.5 appearance-none outline-none border"
              >
                <option value="">Select Format</option>
                <option value="TPP">TPP</option>
                <option value="FPP">FPP</option>
              </select>
              <ShowError data={formErrors.format?.message} />
            </section>
          </section>
          <section className="grid gap-3 items-start xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="grid gap-1">
              <label htmlFor="slots">Slots*</label>
              <input
                autoComplete="off"
                id="slots"
                type="text"
                name="totalSlots"
                {...register("totalSlots")}
                className="rounded bg-transparent py-1 px-2 outline-none border"
              />

              <ShowError data={formErrors.totalSlots?.message} />
            </div>
            {/* Entry Fee Type */}
            <div className="grid gap-1">
              <label htmlFor="entryFeeType">Entry Fee Type*</label>
              <select
                id="entryFeeType"
                name="entryFeeType"
                {...register("entryFeeType")}
                className="rounded bg-select appearance-none text-sm px-2 py-1.5 outline-none border capitalize"
              >
                <option value="">Select Entry Fee Type</option>
                {PriceArray?.map((item) => {
                  return (
                    <option
                      key={item._id}
                      value={item.entryFeeType}
                      className="capitalize"
                    >
                      {item?.entryFeeType}
                    </option>
                  );
                })}
              </select>
              <ShowError data={formErrors.entryFeeType?.message} />
            </div>

            {/* Entry Fee  */}
            <div className="grid gap-1">
              <div className="flex flex-row items-center">
                <label htmlFor="entryFee">Entry Fee </label>
                <div
                  className="flex flex-row items-center ml-[5px] min-h-[10px]"
                  style={{ height: 10 }}
                >
                  {entryFeeType === "rupee" ? (
                    <label htmlFor="entryFee">{"(₹)"}</label>
                  ) : entryFeeType === "coin" ? (
                    <div className="flex flex-row items-center">
                      {"("}
                      <img
                        src={require("../../assets/coin.png")}
                        style={{ height: 12, width: 15 }}
                        alt="coin"
                      />
                      {")"}
                    </div>
                  ) : (
                    ""
                  )}
                  {"*"}
                </div>
              </div>

              <input
                autoComplete="off"
                id="entryFee"
                type="text"
                name="entryFee"
                {...register("entryFee")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.entryFee?.message} />
            </div>

            {/* Commision  */}
            <div className="grid gap-1">
              <label htmlFor="commission">Commission*</label>
              <input
                autoComplete="off"
                id="commission"
                type="text"
                name="commission"
                {...register("commission")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.commission?.message} />
            </div>

            {/* Number Of Winners  */}
            <div className="grid gap-1">
              <label htmlFor="winners"> Total Winners*</label>
              <input
                autoComplete="off"
                id="winners"
                type="text"
                name="totalWinners"
                {...register("totalWinners")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.totalWinners?.message} />
            </div>
            {/* WinningPrizes */}
            <div className="grid gap-4 items-start xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  xl:col-span-5 lg:col-span-3 xs:col-span-2">
              {winningPrizes.length > 0 ? (
                winningPrizes.map((item, index) => {
                  return (
                    <div className="flex-col flex">
                      <div
                        key={item}
                        className=" grid items-center gap-1 text-sm"
                      >
                        <label
                          htmlFor={`rank${index + 1}`}
                          className="text-color text-xs"
                        >
                          {" "}
                          Rank #{index + 1}.
                        </label>
                        <input
                          type="text"
                          id={`rank${index + 1}`}
                          value={item.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            setWinningPrizes(
                              winningPrizes.map((x) =>
                                x.name === item.name ? { ...x, value } : x
                              )
                            );
                          }}
                          className="outline-none px-2 py-1.5 border rounded"
                        />
                      </div>
                      {/* <div
                        key={item}
                        className=" grid items-center gap-1 text-sm mt-5"
                      >
                        <label
                          htmlFor={`pp${index + 1}`}
                          className="text-color text-xs"
                        >
                          Placement Position #{index + 1}.
                        </label>
                        <input
                          type="text"
                          id={`pp${index + 1}`}
                          value={item.pp}
                          // disabled
                          // onChange={(event) => handleWinningPrize(index, event)}
                          onChange={(e) => {
                            const value = e.target.value;

                            handlePlacementPoints(value, index);
                          }}
                          className="outline-none px-2 py-1.5 border rounded"
                        />
                      </div> */}
                    </div>
                  );
                })
              ) : (
                <label htmlFor="slots" style={{ color: "red" }}>
                  {message}
                </label>
              )}
            </div>
            <button
              type="button"
              onClick={handleCalculatePrize}
              className="bg-button justify-center self-end flex cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
              // disabled={checkBool()}
              // style={{ background: checkBool() ? '#707070' : '#24975d' }}
              style={{ background: "#24975d" }}
            >
              Calculate Prize
            </button>
          </section>
          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3">
            {/* Tour Type */}
            <div className="grid gap-1">
              <label htmlFor="type">Tournament Type*</label>
              <select
                id="type"
                name="type"
                {...register("type")}
                className="rounded bg-select text-sm px-2 py-1.5 appearance-none outline-none border"
              >
                <option value="">Select Type </option>
                <option value="single match">Single Match</option>
                {/* <option value="league">League</option> */}
              </select>
              <ShowError data={formErrors.type?.message} />
            </div>
            {/* Start */}
            <div className="grid gap-1">
              <label htmlFor="time">Start Date-Time*</label>
              <input
                autoComplete="off"
                id="time"
                type="datetime-local"
                name="startDateTime"
                {...register("startDateTime")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
                style={{ color: "#fff" }}
              />
              <ShowError data={formErrors.startDateTime?.message} />
            </div>
            {/* End */}
            <div className="grid gap-1">
              <label htmlFor="time">End Date-Time*</label>
              <input
                autoComplete="off"
                id="time"
                type="datetime-local"
                name="endDateTime"
                {...register("endDateTime")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
              />
              <ShowError data={formErrors.endDateTime?.message} />
            </div>
          </section>
          <section className="grid gap-4 items-start md:grid-cols-1">
            {/* Stage Information */}
            <div className="w-full">
              <label htmlFor="">Rules*</label>
              <ReactQuill
                theme="snow"
                value={rules}
                onChange={onRulesStateChange}
              />
              <ShowError data={formErrors.rules?.message} />
            </div>

            {/* Stage Information
            <div className="w-full">
              <label htmlFor="">Information</label>
              <ReactQuill
                theme="snow"
                value={formInput?.information}
                className="w-full bg-select"
                onChange={(e) => setFormInput({ ...formInput, information: e })}
              />
              {!editData &&
                validator.message(
                  "information",
                  formInput?.information,
                  "required"
                )}
              <ShowError data={errors.information} />
            </div> */}
          </section>
          <section className="gap-4">
            <div className="mb-1">
              <label
                htmlFor="banner"
                className="text-xs flex cursor-pointer flex-col gap-1 justify-center rounded border-dashed border-[1.5px] p-4 items-center"
              >
                {allValues?.banner && (
                  <img
                    src={
                      editData && !preview
                        ? `${imageUrl}${editData?.banner}`
                        : preview
                      // : URL?.createObjectURL(allValues?.banner)
                    }
                    alt="banner"
                    className="max-w-[170px] rounded"
                  />
                )}

                <MdOutlineCloudUpload className="text-xl mb-0.5" />
                {allValues?.banner?.name
                  ? allValues?.banner?.name
                  : "Upload Banner"}
              </label>
              <input
                autoComplete="off"
                id="banner"
                type="file"
                name="banner"
                accept="image/jpeg"
                onChange={(event) => {
                  setPreview(URL?.createObjectURL(event.target.files[0]));
                  setValue("banner", event.target.files[0]);
                }}
                className="rounded py-1.5 px-2 hidden outline-none border"
              />
            </div>
            <ShowError data={formErrors.banner?.message} />
          </section>

          <button
            type="submit"
            disabled={loading || (winningPrizes.length === 0 && !editData)}
            className="bg-button justify-center flex items-center disabled:!cursor-not-allowed disabled:!opacity-20 cursor-pointer tracking-wider py-2 px-4 rounded text-white"
            // style={{ background: checkBool() ? "#707070" : "#24975d" }}
          >
            {loading ? <ButtonLoader /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTour;
