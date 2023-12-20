import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import ButtonLoader from "../../../components/ButtonLoader";
import ShowError from "../../../components/ShowError";
import { getGames } from "../../../redux/actions/gameAction";
import {
  addLeagueTournament,
  updateLeagueTour,
} from "../../../redux/actions/leagueAction";
import ReactQuill from "react-quill";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import moment from "moment";
const NewLeagueTour = ({
  handleCloseModal,
  editData,
  imageUrl,
  params = {},
}) => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState();

  const { results } = useSelector((state) => state.gameReducer.games);
  const { loading } = useSelector((state) => state.tournamentReducer);
  const PriceArray = [
    {
      id: 1,
      entryFeeType: "rupee",
    },
  ];

  // handleChange

  // handleSubmit
  const handleSubmit = (values) => {
    const keys = Object.keys(values);
    let payload = new FormData();

    keys.forEach((item) => {
      if (
        item === "startDateTime" ||
        item === "endDateTime" ||
        item === "registrationEndedAt" ||
        item === "registrationStartedAt"
      ) {
        payload.append(item, moment(values[item]).format("YYYY-MM-DDTHH:mm"));
      } else {
        payload.append(item, values[item]);
      }
    });

    if (editData) {
      dispatch(
        updateLeagueTour(editData?._id, payload, handleCloseModal, params)
      );
      // if (isEdit) {
      //   dispatch(updateTour(editData?._id, payload, handleCloseModal))
      // } else {
      //   handleCloseModal()
      // }
    } else {
      dispatch(addLeagueTournament(payload, handleCloseModal, params));
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
    // }
  };

  // useffect
  useEffect(() => {
    dispatch(getGames());
    if (editData) {
      const { prizePool, ...other } = editData;
      console.log(other);
      setValue("name", other?.name);
      setValue("gameId", other.gameId);
      setValue("gameMode", other.gameMode);
      setValue("entryFeeType", other.entryFeeType);
      setValue("entryFee", other.entryFee);
      setValue("type", other.type);
      setValue("startDateTime", other.startDateTime);
      setValue("endDateTime", other.endDateTime);
      fetchImage(other.banner);
      setValue("commission", other?.commission);
      setValue("rules", other.rules);
      setValue("information", other.information);
      setValue("registrationStartedAt", other.registrationStartedAt);
      setValue("registrationEndedAt", other.registrationEndedAt);
      setTimeout(() => {
        setValue("totalSlots", other.totalSlots);
      }, 100);
      setTimeout(() => {
        setValue("prizePool", prizePool);
      }, 200);
      // setFormInput(others);
    }
  }, [dispatch, editData]);

  const schema = yup.object({
    name: yup.string().required("Tournament Name is required."),
    gameId: yup.string().required("Game Name is required."),
    gameMode: yup.string().required("Game Mode is required."),
    totalSlots: yup
      .number()
      .typeError("Slot must be a number")
      .nullable()
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
    type: yup.string().required("Tournament type is required."),
    prizePool: yup
      .number()
      .typeError("Prize Pool must be a number")
      .nullable()
      .required("Prize Pool is required.")
      .test(
        "Is positive?",
        "The number must be greater than -1!",
        (value) => value > -1
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
    information: yup.string().required("Information is required."),
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
    registrationStartedAt: yup
      .date()
      .typeError("Invalid date format")
      .required("Registration Start date time is required")
      .test(
        "registration-start-date-validation",
        "Registration start date cannot be after Tournament end date",
        function (value) {
          // Convert the start date to a Date object
          const endDateTime = this.parent.endDateTime;
          const startDate = new Date(value);
          // Perform the comparison
          return endDateTime >= startDate;
        }
      ),
    commission: yup
      .number()
      .typeError("Commission must be a number")
      .nullable()
      .required("Commission is required.")
      .test(
        "Is positive?",
        "The number must be greater than -1!",
        (value) => value > -1
      )
      .required("Commission is required."),
    registrationEndedAt: yup
      .date()
      .typeError("Invalid date format")
      .required("Registration End date time is required")
      .test(
        "registration-end-date-validation",
        "Registration end date cannot be before Registration start date",
        function (value) {
          // Convert the start date to a Date object
          const endDateTime = this.parent.registrationStartedAt;
          const startDate = new Date(value);
          // Perform the comparison
          return startDate >= endDateTime;
        }
      ),
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
      type: "league",
    },
  });
  const rules = watch("rules");
  const information = watch("information");
  const entryFeeType = watch("entryFeeType");
  const slots = watch("totalSlots");
  const enteryfee = watch("entryFee");
  const commission = watch("commission");

  useEffect(() => {
    const totalEntryFee = slots * enteryfee;

    // Calculate the commission amount
    const totalCommission = (totalEntryFee * commission) / 100;

    // Calculate the prize pool amount after deducting the commission
    const prizePool = totalEntryFee - totalCommission;
    setValue("prizePool", prizePool);
  }, [slots, enteryfee, setValue, commission]);

  const onRulesStateChange = (e) => {
    setValue("rules", e);
  };
  const onInformationStateChange = (e) => {
    setValue("information", e);
  };
  const allValues = getValues();

  // const selectedGameMode = watch("gameMode");
  // const selectedEnteryFee = watch("entryFee");

  // React.useEffect(() => {
  //   setValue("totalSlots", undefined);
  // }, [selectedGameMode, setValue, selectedEnteryFee]);

  // Calculate the total entry fee amount

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full sm:w-5/6 lg:w-4/5 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            {editData ? "Update" : "Add"} League Tournaments
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
          </section>
          <section className="grid gap-3 items-start xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                        src={require("../../../assets/coin.png")}
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
          </section>
          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3">
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
                <option value="league">League</option>
              </select>
              <ShowError data={formErrors.type?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="type">Prize Pool*</label>
              <input
                autoComplete="off"
                type="text"
                id="prizePool"
                name="prizePool"
                {...register("prizePool")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.prizePool?.message} />
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
            {/* Registration Start */}
            <div className="grid gap-1">
              <label htmlFor="registrationStartedAt">
                Registration Start Date-Time*
              </label>
              <input
                autoComplete="off"
                id="registrationStartedAt"
                type="datetime-local"
                name="registrationStartedAt"
                {...register("registrationStartedAt")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
                style={{ color: "#fff" }}
              />
              <ShowError data={formErrors.registrationStartedAt?.message} />
            </div>
            {/* Registration End */}
            <div className="grid gap-1">
              <label htmlFor="registrationEndedAt">
                Registration End Date-Time*
              </label>
              <input
                autoComplete="off"
                id="registrationEndedAt"
                type="datetime-local"
                name="registrationEndedAt"
                {...register("registrationEndedAt")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
              />
              <ShowError data={formErrors.registrationEndedAt?.message} />
            </div>
          </section>
          <section className="grid gap-4 items-start md:grid-cols-2">
            {/* Stage Rules */}
            <div className="w-full">
              <label htmlFor="">Rules*</label>
              <ReactQuill
                theme="snow"
                value={rules}
                onChange={onRulesStateChange}
              />
              <ShowError data={formErrors.rules?.message} />
            </div>

            {/* Stage Information */}
            <div className="w-full">
              <label htmlFor="">Information</label>
              <ReactQuill
                theme="snow"
                className="w-full bg-select"
                value={information}
                onChange={onInformationStateChange}
              />
              <ShowError data={formErrors.information?.message} />
            </div>
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
            disabled={loading}
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

export default NewLeagueTour;
