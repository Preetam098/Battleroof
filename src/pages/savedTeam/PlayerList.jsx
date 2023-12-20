import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playerList } from "../../redux/actions/userAction";
import { BiTrash } from "react-icons/bi";
import UserImage from "../../assets/user_place.png";

const PlayerList = (props) => {
  const dispatch = useDispatch();
  const { teamId, handleClose } = props;
  const { players } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(playerList(teamId));
  }, [dispatch]);

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
      <div className="bg-gray-700 w-5/6 sm:w-4/5 md:w-3/4 lg:w-2/3 rounded-lg">
        <div className="bg-select p-3 sm:p-4 sm:text-base text-sm flex justify-between uppercase">
          <span>Team Players List</span>
          <span onClick={handleClose} className="cursor-pointer text-color">
            X
          </span>
        </div>
        {/* Players */}
        <div className="p-3 sm:p-4 grid gap-6 sm:grid-cols-2">
          {players.map((item) => {
            return (
              <div
                key={item._id}
                className="flex overflow-hidden items-start bg-select p-3 gap-3 rounded-sm shadow-lg "
              >
                <img
                  src={item?.image ? item?.image : UserImage}
                  alt=""
                  style={{
                    height: 85,
                    width: 95,
                    borderRadius: 100,
                    objectFit: "cover",
                  }}
                />
                <div className="capitalize text-xs w-full">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {item.playerName}
                    </h1>
                  </div>
                  <div className="mt-1  flex justify-between w-full text-gray-400">
                    <span>Role : </span>
                    <span>{item.role}</span>
                  </div>
                  <div className="mt-1 flex justify-between w-full text-gray-400">
                    <span>character Id : </span>
                    <span>{item.characterId}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
