import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import ShowOption from "../../../components/ShowOption";
import React, { memo, useEffect, useState } from "react";
import {
  AddStageRound,
  deleteStageRound,
  deleteTourStage,
  getStageRounds,
  getStages,
  getTourStages,
  updateTourStages,
} from "../../../redux/actions/leagueAction";
import ButtonLoader from "../../../components/ButtonLoader";
import ShowError from "../../../components/ShowError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import DateFigure from "../../../components/FomatDate";
const ManageGroup = (props) => {
  const dispatch = useDispatch();
  const { handleCloseModal, activeStageData, tour_id } = props;
  const [formInputs, setFormInputs] = useState([{}]);
  const { stageRound, loading } = useSelector((state) => state.leagueReducer);
  // handle delete rows
  const handleRemoveFromList = (id) => {
    // setFormInputs((prev) => {
    //   return prev?.filter((item) => item._id !== id);
    // });
    dispatch(
      getStageRounds(
        tour_id,
        formInputs?.filter((item) => item._id === id)[0]?.stageId
      )
    );

    console.log(formInputs);
  };
  const deleteTableRows = (id) => {
    dispatch(deleteStageRound(tour_id, id, () => handleRemoveFromList(id)));
  };

  // Handle Final and Save

  useEffect(() => {
    dispatch(getStageRounds(tour_id, activeStageData.stageId));
    // dispatch(getTourStages(tour_id));
  }, [dispatch, tour_id, activeStageData]);

  useEffect(() => {
    if (stageRound) {
      setFormInputs(stageRound);
    }
  }, [stageRound]);

  const schema = yup.object({
    name: yup.string().required("Stage is required."),

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
  });

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmit = (values) => {
    setFormInputs([...formInputs, values]);
    reset();
  };
  const handleSave = (values) => {
    const payload = {
      ...values,
      startDate: moment(values.startDate).format("YYYY-MM-DDTHH:mm"),
      endDate: moment(values.endDate).format("YYYY-MM-DDTHH:mm"),
    };
    dispatch(
      AddStageRound(tour_id, activeStageData.stageId, payload, () =>
        handleSubmit(payload)
      )
    );
  };
  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Manage Round</span>
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
                  Round Name
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
                    <td className={"px-4 py-3"}>{item?.name}</td>
                    <td className={"px-4 py-3"}>
                      {" "}
                      <DateFigure time={item?.startDate} />
                    </td>
                    <td className={"px-4 py-3"}>
                      <DateFigure time={item?.endDate} />
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
          <span className="text-color">Enter Round</span>
        </div>

        {/* form */}
        <form onSubmit={submitForm(handleSave)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
            <div className="grid gap-1">
              <label htmlFor="RoundName">Round Name*</label>
              <input
                id="name"
                name="name"
                placeholder="Round name"
                {...register("name")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.name?.message} />
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

          <button type="submit" className="w-full ">
            <Button
              disabled={formInputs.length === activeStageData?.round}
              className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={loading ? <ButtonLoader /> : "Add Round"}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ManageGroup);
