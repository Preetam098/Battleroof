import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import React, { memo, useEffect, useState } from "react";
import { updateTeamRank } from "../../../redux/actions/tournamentAction";
import { getPlacementPoints } from "../../../redux/actions/gameAction";
import ShowOption from "../../../components/ShowOption";
import Button from "../../../components/Button";
import ButtonLoader from "../../../components/ButtonLoader";
import { updateLobbyRank } from "../../../redux/actions/leagueAction";

const DeclareResult = (props) => {
  const dispatch = useDispatch();
  const { results, tour_id, handleCloseModal, result, isDeclare } = props;
  const winnings = result?.winnings;
  const [formData, setFormData] = useState({});
  const [formInputs, setFormInputs] = useState([]);
  const { loading } = useSelector((state) => state.leagueReducer);
  const { placementPoints } = useSelector((state) => state.gameReducer);

  const rankDetails = formInputs.filter((item) => item.rank !== 0);

  // handle Add Data
  const addTableRows = (event) => {
    event.preventDefault();
    setFormInputs([...formInputs, formData]);
    setFormData({
      teamId: "",
      kp: 0,
      mp: 0,
      pp: 0,
      tt: 0,
      rank: 0,
    });
    event.target.reset();
  };

  // handle delete rows
  const deleteTableRows = (index) => {
    const rows = [...formInputs];
    rows.splice(index, 1);
    setFormInputs(rows);
  };

  // handle change
  const handleChange = (evnt) => {
    const { name, value } = evnt.target;
    const arr =
      name === "rank" &&
      placementPoints?.filter((item) => item.rank === parseInt(value));
    setFormData({
      ...formData,
      [name]: value,
      pp: Number(arr?.[0]?.pp) + 0,
      tp: Number(formData.kp) + Number(arr?.[0]?.pp),
    });
  };

  // Handle Final and Save
  const handleSave = (event) => {
    event.preventDefault();
    const payload = formInputs?.map((item) => {
      return {
        teamId: item?.team,
        kp: parseInt(item.kp),
        mp: 0,
        pp: parseInt(item.pp),
        tt: parseInt(item.tp),
        rank: parseInt(item.rank),
      };
    });
    const sortedData = payload.sort((a, b) => b.tt - a.tt);
    sortedData.forEach((item, index) => {
      item.rank = index + 1;
    });

    dispatch(updateLobbyRank(tour_id, sortedData, handleCloseModal));
  };

  useEffect(() => {
    if (isDeclare) {
      const data = results.map((item) => {
        return {
          team: item.teamId,
          rank: item.rank,
          kp: item.kp,
          pp: item.pp,
          tp: item.tt,
        };
      });
      setFormInputs([...data]);
    } else {
      const inputs = [...formInputs];
      inputs?.map((it, index) => {
        it.pp = parseInt(winnings[index]?.pp);
      });
      setFormInputs(inputs);
    }
    dispatch(getPlacementPoints(results && results[0]?.gameId));
  }, []);

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Declare Result</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        {/* Form Content */}
        {rankDetails?.length === 0 ? (
          <div className="text-center py-8">No Record Found</div>
        ) : (
          <table className="w-full mt-5 mb-2 text-sm capitalize  text-left ">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tl-lg">
                  #
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  Team
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  KP
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium ">
                  PP
                </th>
                <th
                  className={`px-4 py-2 title-font  tracking-wider font-medium `}
                >
                  TP
                </th>
                <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tr-lg ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rankDetails
                ?.sort((a, b) => a.rank - b.rank)
                ?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="text-xs"
                      style={{
                        borderBottom: `${index === 0 ? "2px" : "1px"} solid ${
                          index === 0 ? "#24975d" : "#898989"
                        }`,
                      }}
                    >
                      <td className={"px-4 py-3"}>{item.rank}</td>
                      <td className={"px-4 py-3"}>
                        {results?.map((val) => {
                          return val?.teamId === item.team && val?.teams?.name;
                        })}
                      </td>
                      <td className={"px-4 py-3"}>{item.kp}</td>
                      <td className={"px-4 py-3"}>{item.pp}</td>
                      <td
                        className={"px-4 py-3"}
                        style={{
                          borderBottom: `1px solid ${
                            index === 0 ? "#101829" : "#24975d"
                          }`,
                        }}
                      >
                        <span>{item.tp}</span>
                      </td>

                      <td className={"px-4 py-3"}>
                        <ShowOption handleDelete={deleteTableRows} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}

        {/* Form to declare result */}
        {!isDeclare && (
          <>
            {" "}
            <div className="flex justify-between py-5 items-center">
              <span className="text-color">Enter Results</span>
            </div>
            <form onSubmit={addTableRows} className="w-full grid gap-4">
              {/*Select Teams */}
              <div>
                <label htmlFor="team">Team</label>
                <select
                  id="team"
                  name="team"
                  value={formData?.team}
                  required
                  onChange={handleChange}
                  className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
                >
                  <option value="">Select Team</option>
                  {console.log(results)}
                  {results?.map((item) => {
                    return (
                      <option
                        key={item?.teamId}
                        className="capitalize"
                        value={item?.teamId}
                      >
                        {item?.teams?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Enter Kill Points */}
              <div>
                <label htmlFor="kp">Kill Points</label>
                <input
                  id="kp"
                  name="kp"
                  value={formData?.kp}
                  required
                  placeholder="No. of Kills"
                  onChange={handleChange}
                  className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
                />
              </div>

              {/*Select Rank */}
              <div>
                <label htmlFor="rank">Rank</label>
                <input
                  id="rank"
                  name="rank"
                  type="number"
                  value={formData?.rank}
                  required
                  max={result.totalSlots}
                  placeholder="Enter Rank"
                  onChange={handleChange}
                  className="w-full outline-none bg-select border border-color rounded py-2 px-4 appearance-none tracking-wider text-sm"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full ">
                <Button
                  title={`ADD`}
                  className={
                    "disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
                  }
                />
              </button>

              {/* Final Save */}
              <Button
                disabled={formInputs.length < results.length}
                className={
                  "disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
                }
                title={loading ? <ButtonLoader /> : `FINISH AND SAVE`}
                event={handleSave}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(DeclareResult);
