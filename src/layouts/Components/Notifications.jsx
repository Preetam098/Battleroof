import React from "react";

const Notifications = () => {
  return (
    <div className="rounded h-72 sm:h-72 w-60 sm:w-72 text-sm z-30 absolute top-16 sm:top-14 right-3 sm:left-0 bg-secondary text-left shadow-lg">
      <div className="w-full p-2 sm:p-3 shadow bg-secondary  rounded-t font-medium">
        Notifications
      </div>

      <div className="w-full  p-2 sm:p-3 shadow rounded-b text-center cursor-pointer bg-secondary font-medium">
        Read All Notifications
      </div>
    </div>
  );
};

export default Notifications;
