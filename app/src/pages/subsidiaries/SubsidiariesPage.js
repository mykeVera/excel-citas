import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from "../../services/Api";
import GetCookie from "../../hooks/getCookie";
import Authenticated from "../../hooks/authenticated";
//import { config } from "../../hooks/withCredentials";

const SubsidiariesPage = () => {
  Authenticated();
  const navigate = useNavigate();
  const [subsidiaries, setSubsidiaries] = useState([]);

  const getU = GetCookie("_userIn_");
  const jsonU = JSON.parse(getU);
  const config = {
      headers: {
        Authorization: `Bearer ` + jsonU.token,
      },
  };

  useEffect(() => {
    if(jsonU.id_type_user!==1){
      navigate('/');
    }else{
      getAllSubsidiaries();
    }
  }, []);

  const getAllSubsidiaries = async () => {
    const response = await axios.get(API_URL_BASE + `subsidiaries`, config);
    setSubsidiaries(response.data);
  };

  return (
    <div className={"custom_container"}>
      <div className="card card-padding">
        <div className="row page-titles">
          <div className="col-md-6">
            <h3 className="text-themecolor">Sedes</h3>
          </div>
          <div className="col-md-6">
            <ol className="breadcrumb right">
              <li className="breadcrumb-item">
                <Link to={"/main"}>
                  <i className=""></i> Tablero
                </Link>
              </li>
              <li className="breadcrumb-item active">Sedes </li>
            </ol>
          </div>
        </div>
      </div>

      <br />

      <div className={"row"}>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped list">
                <thead>
                  <tr>
                    <th scope="col">
                      Código
                      <span> </span>
                    </th>
                    <th scope="col">Sede</th>
                    <th scope="col">Limite de Tickets</th>
                    <th scope="col">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidiaries.map((subsidiary) => (
                    <tr key={subsidiary.id_subsidiary}>
                      <td> S00{subsidiary.id_subsidiary} </td>
                      <td> {subsidiary.subsidiary} </td>
                      <td> {subsidiary.ticket_limit} </td>
                      <td>
                        <Link
                          to={`/main/subsidiaries/edit/${subsidiary.id_subsidiary}`}
                          className="btn btn-warning"
                        >
                          <FontAwesomeIcon icon={faPencil} /> Edit
                        </Link>
                        <span> </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubsidiariesPage;
