import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import React, { memo, useEffect, useState } from "react";
import { updateroundGroup } from "../../../redux/actions/leagueAction";
import ButtonLoader from "../../../components/ButtonLoader";
import ShowError from "../../../components/ShowError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const ManageRoundMatch = (props) => {
  const dispatch = useDispatch();
  const { handleCloseModal, activeRoundData } = props;
  const { loading } = useSelector((state) => state.leagueReducer);

  const schema = yup.object({
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
  });

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmit = () => {
    handleCloseModal();
    reset();
  };
  const handleSave = (values) => {
    dispatch(
      updateroundGroup(
        activeRoundData._id,
        activeRoundData?.stageRoundId,
        values,
        () => handleSubmit()
      )
    );
  };
  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-1/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            Update Lobby | {activeRoundData?.title}
          </span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={submitForm(handleSave)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-1 lg:grid-cols-1">
            <div className="grid gap-1">
              <label htmlFor="groupTeamCount">Start Date*</label>
              <input
                id="startDateTime"
                name="startDateTime"
                type="datetime-local"
                placeholder="Match Start Date Time"
                {...register("startDateTime")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.startDateTime?.message} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="groupTeamCount">End Date*</label>
              <input
                id="endDateTime"
                name="endDateTime"
                type="datetime-local"
                placeholder="Match End Date Time"
                {...register("endDateTime")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.endDateTime?.message} />
            </div>
          </section>

          <button type="submit" className="w-full ">
            <Button
              className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={loading ? <ButtonLoader /> : "Update Lobby"}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ManageRoundMatch);
