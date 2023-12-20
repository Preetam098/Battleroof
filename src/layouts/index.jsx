import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = (Wcomponent) => {
  return function Component() {
    const [toggle, setToggle] = useState(true);

    // handleToggle
    const handleToggle = () => setToggle(!toggle);
    return (
      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-56 shadow-lg md:w-1/6 ${
            !toggle ? " md:hidden   w-0" : "left-full p-4"
          } bg-secondary md:static absolute translate-x-0      ease-in-out duration-300  top-0 z-50 md:z-auto  h-full overflow-y-auto `}
        >
          <Sidebar handleToggle={handleToggle} toggle={toggle} />
        </div>

        {/* Component & Header */}
        <main
          className={`w-full h-full p-2 ${!toggle ? "w-full" : "md:w-5/6"}`}
        >
          <Header handleToggle={handleToggle} toggle={toggle} />
          <div id="component" className="h-full py-4 overflow-auto">
            <Wcomponent />
          </div>
        </main>

        {/* Setting Icon */}
        {/* <Link
          to="/setting"
          className="absolute   top-1/2 right-0 bg-button py-2 font-medium pl-2 pr-1 rounded-l-lg"
        >
          <BsFillGearFill className="cursor-pointer duration-50 animate-spin transition-all" />
        </Link> */}
      </div>
    );
  };
};

export default Layout;
