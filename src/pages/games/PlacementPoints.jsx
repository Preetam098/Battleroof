import { MdClose } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../../components/ButtonLoader";
import {
  addPlacementPoints,
  getPlacementPoints,
} from "../../redux/actions/gameAction";

const PlacementPoints = ({ handleCloseModal, editData }) => {
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState([]);
  const { loading } = useSelector((state) => state.gameReducer);

  // handle Change
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const rowsInput = [...formInput];
    rowsInput[index][name] = value;
    setFormInput(rowsInput);
  };

  // handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = formInput.map((item) => {
      return { rank: Number(item.rank), pp: Number(item.pp) };
    });
    dispatch(
      addPlacementPoints(
        { placementPoints: payload },
        editData._id,
        handleCloseModal
      )
    );
  };

  useEffect(() => {
    dispatch(
      getPlacementPoints(editData._id, (eve) => {
        const arr = Array(20)
          .fill()
          .map((item, index) => {
            return { rank: index + 1, pp: "" };
          });
        setFormInput(
          eve && eve.length !== 0 && typeof eve === "object" ? eve : arr
        );
      })
    );
  }, []);

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="pb-10 w-full sm:w-2/3 h-full overflow-auto xl:w-1/3 p-4 bg-secondary shadow-xl">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            {editData ? "Update" : "Add"} Placement Points
          </span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          {/* Rank wise Placement Points */}
          <div className=" flex w-full items-center md:items-start  flex-col gap-4">
            {formInput?.map((item, index) => {
              return (
                <div key={item.rank} className="w-full">
                  {/* Placement Position */}
                  <div className=" grid items-center gap-1.5 text-sm">
                    <label htmlFor={`pp${index + 1}`} className="text-xs">
                      Placement Position #{index + 1}.
                    </label>
                    <input
                      required
                      type="text"
                      id={`pp${index + 1}`}
                      name="pp"
                      onChange={(event) => handleChange(index, event)}
                      value={item.pp}
                      className="outline-none px-2 py-1.5 border rounded"
                    />
                  </div>
                </div>
              );
            })}
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

export default PlacementPoints;
