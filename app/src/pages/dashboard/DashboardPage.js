import React from "react";
import Authenticated from './../../hooks/authenticated';

const DasboardPage = () => {

  Authenticated();

  return (
    <div className={"custom_container"}>
      <div className={"row"}>
        <div className="col-sm-12" >
          <h1 className={"center"}>Tablero de Opciones</h1>
        </div>
      </div>
    </div>
  );
};

export default DasboardPage;
