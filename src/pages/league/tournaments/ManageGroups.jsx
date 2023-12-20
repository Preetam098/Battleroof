import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import React, { memo, useEffect, useState } from "react";
import { AddroundGroup } from "../../../redux/actions/leagueAction";
import ButtonLoader from "../../../components/ButtonLoader";
import ShowError from "../../../components/ShowError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const ManageGroup = (props) => {
  const dispatch = useDispatch();
  const { handleCloseModal, activeRoundData } = props;
  const { loading } = useSelector((state) => state.leagueReducer);

  const schema = yup.object({
    groupTeamCount: yup
      .number()
      .typeError("Teams per group must be number.")
      .nullable()
      .required("Teams per group is required.")
      .test(
        "Is positive?",
        "The number must be greater than -1!",
        (value) => value > -1
      )
      .test(
        "Is positive?",
        "A group can hold a maximum of 22 teams.",
        (value) => value < 23
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
    dispatch(AddroundGroup(activeRoundData._id, values, () => handleSubmit()));
  };
  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-1/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Manage Group</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        {/* Form Content */}
        {/* {formInputs?.length === 0 ? (
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
        )} */}

        {/* form */}
        <form onSubmit={submitForm(handleSave)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-1 lg:grid-cols-1">
            <div className="grid gap-1">
              <label htmlFor="groupTeamCount">Teams per Group*</label>
              <input
                id="groupTeamCount"
                name="groupTeamCount"
                placeholder="Teams per group"
                {...register("groupTeamCount")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.groupTeamCount?.message} />
            </div>
          </section>

          <button type="submit" className="w-full ">
            <Button
              className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={loading ? <ButtonLoader /> : "Create Group"}
            />
          </button>
        </form>
        {/* <div className="flex justify-between py-5 items-center">
          <span className="text-color">Grou</span>
        </div> */}
      </div>
    </div>
  );
};

export default memo(ManageGroup);
