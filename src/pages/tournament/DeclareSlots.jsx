import { MdClose } from "react-icons/md";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../../components/ButtonLoader";
import { declareSlots } from "../../redux/actions/tournamentAction";

const DeclareSlots = (props) => {
  const dispatch = useDispatch();
  const { results, tour_id, handleCloseModal, result } = props;
  console.log(results);

  const [formInputs, setFormInputs] = useState([...results]);
  const { loading } = useSelector((state) => state.tournamentReducer);

  useEffect(() => {
    results.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    setFormInputs(results);
  }, []);

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
  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   const payload = formInputs.map((item, index) => {
  //     return {
  //       teamId: item?.joinedtournament?._id,
  //       slot: item?.joinedtournament?.slot
  //         ? parseInt(item?.joinedtournament?.slot)
  //         : index + 1,
  //     }
  //   })
  //   dispatch(declareSlots(tour_id, payload, handleCloseModal))
  // }

  // Handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = formInputs.map((item, index) => {
      return {
        teamId: item._id,
        slot: item?.slot ? parseInt(item?.slot) : index + 1,
      };
    });
    dispatch(declareSlots(tour_id, payload, handleCloseModal));
  };

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full lg:w-2/3 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">Declare Slots</span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        {/* Form Content */}
        {formInputs.length === 0 ? (
          <div className="text-center py-16">No Record Found</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5  grid gap-3">
            <table className=" text-sm capitalize  text-left ">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tl-lg">
                    #
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium ">
                    Name
                  </th>
                  <th className="px-4 py-2 title-font tracking-wider font-medium  rounded-tr-lg ">
                    Slots
                  </th>
                </tr>
              </thead>
              <tbody>
                {formInputs?.map((item, index) => {
                  return (
                    <tr key={item._id} className="text-xs">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          autoComplete="off"
                          value={item?.slot || index + 1}
                          onChange={(event) => {
                            handleChange(index, "slot", event.target.value);
                          }}
                          disabled
                          placeholder="slot"
                          name="slot"
                          required={true}
                          className="border-none w-16 bg-select outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Submit Button */}
            {result?.settlementStatus !== 1 && (
              <button
                type="submit"
                disabled={loading}
                className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
              >
                {loading ? <ButtonLoader /> : "Submit"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default memo(DeclareSlots);
