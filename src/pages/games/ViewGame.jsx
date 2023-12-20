import React, { useEffect } from "react";
import Layout from "../../layouts";
import { BiArrowBack } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewGame } from "../../redux/actions/gameAction";

const ViewGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { result, imageUrl } = useSelector(
    (state) => state.gameReducer.viewgame
  );

  // useffect
  useEffect(() => {
    dispatch(viewGame(state));
  }, [dispatch, state]);

  return (
    <section className="tracking-wider h-full">
      {/* Banner */}
      <section className="relative rounded-t-lg block h-44 sm:h-52 md:h-60 lg:h-72">
        <div
          className="absolute top-0 rounded-t-lg w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url("${imageUrl}${result?.banner}")`,
          }}
        >
          <span
            id="blackOverlay"
            className="w-full h-full rounded-t-lg absolute opacity-60 bg-black"
          >
            <div
              onClick={() => navigate("/games")}
              className="p-4 text-xl flex justify-end cursor-pointer  text-white"
            >
              <BiArrowBack />
            </div>
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-10 bg-blueGray-200">
        <div className="container mx-auto px-4 lg:px-5">
          <div className="relative flex flex-col min-w-0 break-words bg-secondary w-full mb-6 shadow-xl rounded-lg -mt-20">
            <div className="w-full p-3 bg-secondary rounded-lg shadow-lg dark:bg-gray-800">
              {/* Image */}
              <div className="flex justify-center -mt-14">
                <img
                  className="object-cover w-24 h-24 sm:w-28 sm:h-28 border-2 border-color rounded-full dark:border-blue-400"
                  alt={result?.name}
                  src={`${imageUrl}${result?.image}`}
                />
              </div>

              <h2 className="text-lg font-semibold text-color mt-2">
                {result?.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
                dolores deserunt ea doloremque natus error, rerum quas odio
                quaerat nam ex commodi hic, suscipit in a veritatis pariatur
                minus consequuntur!
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Layout(ViewGame);
