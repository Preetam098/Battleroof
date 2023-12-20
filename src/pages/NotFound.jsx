import React from "react";
import Button from "../components/Button";
import Button2 from "../components/Button2";
import { BiArrowBack } from "react-icons/bi";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section className=" ">
        <div className="container min-h-screen px-6 py-12 mx-auto flex md:flex-row-reverse flex-col items-center justify-center lg:gap-12">
          <div className="relative w-full lg:w-1/2 ">
            <img className=" " src={Logo} alt="" />
          </div>
          <div className="">
            <h1 className="mt-3 text-2xl font-semibold   md:text-3xl">
              Page not found
            </h1>
            <p className="mt-4 text-gray-500 ">
              Sorry, the page you are looking for doesn't exist. Here are some
              helpful links:
            </p>

            <div className="flex items-center mt-6 gap-x-3">
              <Button2
                event={() => navigate(-1)}
                title="Back"
                icon={<BiArrowBack />}
              />

              <Button
                event={() => navigate("/dashboard")}
                title="Go To Dashboard"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
