import { MdClose } from "react-icons/md";
import React, { Fragment, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../../components/ButtonLoader";
import {
  declareSlots,
  settlementStatus,
} from "../../redux/actions/tournamentAction";

const DeclareSlots = (props) => {
  const dispatch = useDispatch();
  const { teams, result, tour_id, handleCloseModal } = props;

  const [formInputs, setFormInputs] = useState([...result?.winnings]);
  const { loading } = useSelector((state) => state.tournamentReducer);

  // handle settlement status
  const handleSettlement = () => {
    const payload = {
      tournamentId: tour_id,
    };
    dispatch(settlementStatus(payload));
  };

  // Handle Change
  const handleChange = (index, name, value) => {
    const inputs = [...formInputs];
    inputs[index] = {
      ...inputs[index],
      [name]: name !== "teamId" && value.length !== 0 ? parseInt(value) : value,
    };
    setFormInputs(inputs);
  };

  // Handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = formInputs.map((item) => {
      return {
        teamId: item._id,
        slot: parseInt(item.slot),
      };
    });
    dispatch(declareSlots(tour_id, payload, handleCloseModal));
  };

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Settlement Amount</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="mt-5  grid gap-3">
          {result?.winnings.length > 0 ? (
            <table className="w-full capitalize my-5 sm:w-100%">
              <thead className="text-sm text-left border-b text-gray-200">
                <tr className="">
                  <td className="py-2">Ranks</td>
                  {result?.resultStatus == 1 && <td className="py-2">Teams</td>}
                  <td className="py-2">Prizes</td>
                </tr>
              </thead>
              <tbody className="text-left">
                {result?.winnings?.map((item) => {
                  const all = teams?.results?.map((it) => {
                    return it.rank === item.rank && it.name;
                  });
                  return (
                    <tr key={item.rank} className="text-xs text-gray-200">
                      <td className="py-2">#{item.rank}</td>
                      {result?.resultStatus == 1 && (
                        <td className="py-2 capitalize">
                          {all?.map((val) => (
                            <p key={val}>{val}</p>
                          ))}
                        </td>
                      )}
                      <td className="py-2 text-color">₹ {item.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <span style={{ textAlign: "center" }}>
              There is no winnings data
            </span>
          )}

          {/* Submit Button */}
          {/* <button
            type="submit"
            disabled={loading}
            className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
          >
            {loading ? <ButtonLoader /> : 'Submit'}
          </button> */}

          {result?.winnings.length > 0 && (
            <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
              <button
                onClick={() => handleCloseModal("confirmModal")}
                type="button"
                className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
              >
                Cancel
              </button>

              <button
                // onClick={handleSettlement}
                onClick={() => {
                  handleSettlement("confirmModal");
                  handleCloseModal("confirmModal");
                }}
                type="button"
                disabled={loading}
                className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
              >
                {loading ? <ButtonLoader /> : "Confirm"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default memo(DeclareSlots);
