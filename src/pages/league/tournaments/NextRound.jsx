import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import ShowOption from "../../../components/ShowOption";
import React, { memo, useEffect, useState } from "react";
import {
  AddStageRound,
  createNextStageTeams,
  deleteStageRound,
  getStageRounds,
  getTeamsStageWise,
  getTourStages,
  updateTeamsStatus,
} from "../../../redux/actions/leagueAction";
import ButtonLoader from "../../../components/ButtonLoader";
import ShowError from "../../../components/ShowError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import DateFigure from "../../../components/FomatDate";
import TableImage from "../../../components/TableImage";
import Pagination from "../../../components/Pagination";
import {
  get_stage_round_list,
  league_tour_stage,
} from "../../../utils/endpoints";
import axios from "axios";
const NextRound = (props) => {
  const [params, setparams] = useState({
    page: 1,
    pageSize: 12,
    sort: "tt",
    order: "desc",
  });
  const dispatch = useDispatch();
  const { handleCloseModal, stageId, tourId } = props;
  const [tourStages, settourStages] = useState([]);
  const [tourStage, settourStage] = useState([]);
  const [nextStageRound, setnextStageRound] = useState(null);
  const { teamsStageWise, loading } = useSelector(
    (state) => state.leagueReducer
  );
  const { result = [], pagination, teamImageUrl } = teamsStageWise;
  // useEffect(() => {
  //   dispatch(getTourStages(tourId));
  // }, [dispatch, tourId]);

  const schema = yup.object({
    count: yup.string().required("Team Count is required."),
  });
  const tschema = yup.object({
    count: yup.string().required("Team per group is required."),
  });

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors: formErrors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    register: tregister,
    handleSubmit: tsubmitForm,
    formState: { errors: tformErrors },
  } = useForm({
    resolver: yupResolver(tschema),
  });

  const handleSave = (values) => {
    dispatch(
      getTeamsStageWise(stageId, {
        page: 1,
        pageSize: values?.count,
        sort: "tt",
        order: "desc",
      })
    );
  };
  const thandleSave = (values) => {
    const payload = {
      currentTournamentStageId: stageId,
      groupTeamCount: parseInt(values?.count),
      groups: result?.map((item) => {
        return {
          teamId: item?.teamId,
        };
      }),
    };
    dispatch(
      createNextStageTeams(payload, nextStageRound?._id, handleCloseModal())
    );
  };
  const getNextStages = async (tour_id, stage_id) => {
    const { data } = await axios.get(
      `${get_stage_round_list}/${tour_id}/stages/${stage_id}/rounds`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      }
    );

    const { data: nextStages = [] } = data;
    if (nextStages?.length) {
      setnextStageRound(nextStages[0]);
    }
  };
  const getStage = async (tour_id) => {
    const response = await axios.get(`${league_tour_stage}/${tour_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;

    settourStage(data);
    const upcomingStages = data?.findIndex((item) => item._id === stageId);
    if (upcomingStages > -1 && data[upcomingStages + 1]) {
      settourStages(data[upcomingStages + 1]);
      getNextStages(tourId, data[upcomingStages + 1]?.stageId);
    }
  };
  useEffect(() => {
    if (stageId && tourId) {
      getStage(tourId);
    }
  }, [stageId, tourId]);

  const handlePrev = () =>
    params.page !== 1 &&
    setparams({
      ...params,
      page: params.page - 1,
    });
  const handleForw = () =>
    params.page <= pagination?.totalPages &&
    setparams({
      ...params,
      page: params.page + 1,
    });
  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Manage Teams</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>
        <form onSubmit={submitForm(handleSave)} className="mt-5 grid gap-4">
          <section className="grid gap-4 items-start xs:grid-cols-3 lg:grid-cols-3">
            <div className="grid gap-1">
              <label htmlFor="RoundName">
                How Many teams you want to move in next round?*
              </label>
              <input
                id="count"
                name="count"
                placeholder="Teams to move"
                {...register("count")}
                className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
              />
              <ShowError data={formErrors.count?.message} />
            </div>
          </section>

          <button type="submit" className="w-full ">
            <Button
              className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              // title={loading ? <ButtonLoader /> : "Get Teams"}
              title={"Get Teams"}
            />
          </button>
        </form>

        {/* Form Content */}
        {result?.length === 0 ? (
          <div className="text-center py-8">No Record Found</div>
        ) : (
          <>
            <table className="w-full mt-5 mb-2 text-sm capitalize  text-left ">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tl-lg">
                    Profile
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tl-lg">
                    Team Name
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium ">
                    TT
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium ">
                    KP
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium ">
                    PP
                  </th>
                </tr>
              </thead>
              <tbody>
                {result?.map((item, index) => {
                  return (
                    <tr
                      key={item?._id}
                      className="text-xs"
                      style={{
                        borderBottom: `1px solid #24975d`,
                      }}
                    >
                      <td className={"px-4 py-3"}>
                        <TableImage
                          src={
                            item?.teams?.image
                              ? `${teamImageUrl}${item?.teams?.image}`
                              : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                          }
                        />
                      </td>
                      <td className={"px-4 py-3"}>
                        {item?.teams?.name || "-"}
                      </td>
                      <td className={"px-4 py-3"}>{item?.tt || "-"}</td>
                      <td className={"px-4 py-3"}>{item?.kp || "-"}</td>
                      <td className={"px-4 py-3"}>{item?.pp || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              handlePrev={handlePrev}
              from={(params.page - 1) * pagination?.pageSize}
              to={params.page * pagination?.pageSize}
              total={pagination?.totalItems}
              handleForw={handleForw}
            />
          </>
        )}

        {/* form */}
        {tourStages && nextStageRound && result?.length > 0 ? (
          <form onSubmit={tsubmitForm(thandleSave)} className="mt-5 grid gap-4">
            <section className="grid gap-4 items-start xs:grid-cols-3 lg:grid-cols-3">
              <div className="grid gap-1">
                <label htmlFor="RoundName">Teams per group*</label>
                <input
                  id="count"
                  name="count"
                  placeholder="Teams per group"
                  {...tregister("count")}
                  className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
                />
                <ShowError data={tformErrors.count?.message} />
              </div>
            </section>

            <button type="submit" className="w-full ">
              <Button
                className="disabled:bg-gray-400 disabled:cursor-not-allowed"
                // title={loading ? <ButtonLoader /> : "Move Teams"}
                title={"Move Teams"}
              />
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            Please Create Next Stage/Round first to move the teams
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(NextRound);
