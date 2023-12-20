import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import ShowOption from "../../../components/ShowOption";
import React, { memo, useEffect, useState } from "react";
import {
  deleteStage,
  deleteTourStage,
  getStages,
  getTourStages,
  updateTourStages,
} from "../../../redux/actions/leagueAction";
import ButtonLoader from "../../../components/ButtonLoader";
import ReactQuill from "react-quill";
import ShowError from "../../../components/ShowError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import DateFigure from "../../../components/FomatDate";
const ManageState = (props) => {
  const dispatch = useDispatch();
  const { handleCloseModal, result, tour_id } = props;
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState();
  const [formInputs, setFormInputs] = useState([{}]);
  const { stageData, tourStage, loading } = useSelector(
    (state) => state.leagueReducer
  );
  const { data } = stageData;

  // handle delete rows
  const handleRemoveFromList = (id) => {
    setFormInputs((prev) => {
      return prev?.filter((item) => item._id !== id);
    });
  };
  const deleteTableRows = (id) => {
    dispatch(deleteTourStage(id, () => handleRemoveFromList(id)));
  };

  // Handle Final and Save

  useEffect(() => {
    dispatch(getStages());
    dispatch(getTourStages(tour_id));
  }, [dispatch, tour_id]);

  useEffect(() => {
    if (tourStage) {
      setFormInputs(tourStage);
    }
  }, [tourStage]);

  const schema = yup.object({
    stageId: yup.string().required("Stage is required."),
    winnerTeams: yup
      .number()
      .typeError("Total must be a number")
      .nullable()
      .required("Total is required.")
      .test(
        "Is positive?",
        "The number must be greater than 0!",
        (value) => value > 0
      ),
    prizePool: yup
      .number()
      .typeError("Prize Pool be a number")
      .nullable()
      .required("Prize Pool is required.")
      .test(
        "Is positive?",
        "The number must be greater than -1!",
        (value) => value > -1
      ),
    banner: yup
      .mixed()
      .required("Image are required.")
      .test("fileType", "Only JPG images are allowed", (value) => {
        if (!value) return true; // Empty value is handled by the 'required' validation
        return value && value.type === "image/jpeg";
      })
      .test("fileSize", "File size must be less than 1MB", (value) => {
        if (!value) return true; // Empty value is handled by the 'required' validation
        return value && value.size <= 1024 * 1024; // 1MB in bytes
      }),
    round: yup
      .number()
      .typeError("Round must be a number")
      .nullable()
      .required("Round is required.")
      .test(
        "Is positive?",
        "The number must be greater than 0!",
        (value) => value > 0
      ),
    startDate: yup
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
    endDate: yup
      .date()
      .typeError("Invalid date format")
      .required("End date time is required")
      .test(
        "end-date-validation",
        "End date cannot be before start date",
        function (value) {
          // Convert the start date to a Date object
          const startDate = this.parent.startDate;
          const endDate = new Date(value);
          // Perform the comparison
          return endDate >= startDate;
        }
      ),
    rules: yup.string().required("Rules are required."),
  });

  const {
    register,
    setValue,
    handleSubmit: submitForm,
    formState: { errors: formErrors },
    reset,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const rules = watch("rules");
  const onRulesStateChange = (e) => {
    setValue("rules", e);
  };
  const handleSubmit = (values) => {
    setFormInputs([...formInputs, values]);
    reset();
  };
  const handleSave = (values) => {
    const payload = {
      ...values,
      startDate: moment.utc(values.startDate).format("YYYY-MM-DDTHH:mm"),
      endDate: moment.utc(values.endDate).format("YYYY-MM-DDTHH:mm"),
    };
    const formData = new FormData();
    Object.keys(payload)?.forEach((item) => {
      formData.append(item, payload[item]);
    });
    dispatch(updateTourStages(tour_id, formData, () => handleSubmit(payload)));
  };
  const allValues = getValues();
  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Manage Stage</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        {/* Form Content */}
        {formInputs?.length === 0 ? (
          <div className="text-center py-8">No Record Found</div>
        ) : (
          <table className="w-full mt-5 mb-2 text-sm capitalize  text-left ">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tl-lg">
                  Name
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  Rounds
                </th>

                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  Prize Pool
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  Winning Teams
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  Start Date
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  End Date
                </th>

                <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tr-lg ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {formInputs?.map((item, index) => {
                return (
                  <tr
                    key={item}
                    className="text-xs"
                    style={{
                      borderBottom: `${index === 0 ? "2px" : "1px"} solid ${
                        index === 0 ? "#24975d" : "#898989"
                      }`,
                    }}
                  >
                    <td className={"px-4 py-3"}>{item?.stage?.name}</td>
                    <td className={"px-4 py-3"}>{item.round}</td>
                    <td className={"px-4 py-3"}>{item.prizePool}</td>
                    <td className={"px-4 py-3"}>{item.winnerTeams}</td>
                    <td className={"px-4 py-3"}>
                      <DateFigure time={item.startDate} />
                    </td>
                    <td className={"px-4 py-3"}>
                      <DateFigure time={item.endDate} />
                    </td>
                    <td className={"px-4 py-3"}>
                      <ShowOption
                        handleDelete={() => deleteTableRows(item?._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="flex justify-between py-5 items-center">
          <span className="text-color">Enter Stages</span>
        </div>

        {/* form */}
        <form onSubmit={submitForm(handleSave)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
            <div className="grid gap-1">
              <label htmlFor="Stage">Select Stage*</label>

              <select
                id="stageId"
                name="stageId"
                {...register("stageId")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              >
                <option value="">Select Stage</option>
                {data?.map((item) => {
                  return (
                    <option key={item} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <ShowError data={formErrors.stageId?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="Stage">Stage Round*</label>
              <input
                id="round"
                name="round"
                placeholder="Round"
                {...register("round")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.round?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="winners"> Total Winners*</label>
              <input
                autoComplete="off"
                id="winners"
                name="winnerTeams"
                {...register("winnerTeams")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.winnerTeams?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="prizePool"> Prize Pool*</label>
              <input
                autoComplete="off"
                id="winners"
                name="prizePool"
                {...register("prizePool")}
                className="rounded bg-transparent  py-1 px-2 outline-none border"
              />
              <ShowError data={formErrors.prizePool?.message} />
            </div>
          </section>

          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
            {/* Start */}
            <div className="grid gap-1">
              <label htmlFor="time">Start Date-Time*</label>
              <input
                autoComplete="off"
                id="time"
                type="datetime-local"
                name="startDate"
                {...register("startDate")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
                style={{ color: "#fff" }}
              />
              <ShowError data={formErrors.startDate?.message} />
            </div>
            {/* End */}
            <div className="grid gap-1">
              <label htmlFor="time">End Date-Time*</label>
              <input
                autoComplete="off"
                id="time"
                type="datetime-local"
                name="endDate"
                {...register("endDate")}
                className="rounded bg-transparent py-1 px-2 outline-none border custom-input"
              />
              <ShowError data={formErrors.endDate?.message} />
            </div>
          </section>
          <section className="grid gap-4 items-start md:grid-cols-2">
            {/* Stage Information */}
            <div className="w-full">
              <label htmlFor="">Rules*</label>
              <ReactQuill
                theme="snow"
                className="w-full bg-select"
                value={rules}
                onChange={onRulesStateChange}
              />
              <ShowError data={formErrors.rules?.message} />
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
                      preview
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

          <button type="submit" className="w-full">
            <Button title={loading ? <ButtonLoader /> : "Add Stage"} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ManageState);
