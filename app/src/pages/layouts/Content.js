import React from "react";
import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <div>
      <div className={"display"}>
        <Outlet />
      </div>
    </div>
  );
};

export default Content;
