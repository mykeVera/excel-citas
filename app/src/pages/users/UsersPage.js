import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from "./../../services/Api";
import GetCookie from "../../hooks/getCookie";
import Authenticated from "../../hooks/authenticated";
//import { config } from "../../hooks/withCredentials";

const UsersPage = () => {
  Authenticated();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

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
      getAllUsers();
    }
  }, []);

  const getAllUsers = async () => {
    const response = await axios.get(API_URL_BASE + `users`, config);
    setUsers(response.data);
  };

  const deleteUser = async (id_user) => {
    const response = await axios.put(API_URL_BASE + `users/delete/${id_user}`, {}, config)
    getAllUsers()
  }

  return (
    <div className={"custom_container"}>
      <div className="card card-padding">
        <div className="row page-titles">
          <div className="col-md-6">
            <h3 className="text-themecolor">Usuarios</h3>
          </div>
          <div className="col-md-6">
            <ol className="breadcrumb right">
              <li className="breadcrumb-item">
                <Link to={"/main"}>
                  <i className=""></i> Tablero
                </Link>
              </li>
              <li className="breadcrumb-item active">Usuarios </li>
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
                      <Link
                        to={"/main/users/create"}
                        className="btn btn-success"
                      >
                        <FontAwesomeIcon icon={faPlus} /> Nuevo
                      </Link>
                      <span> </span>
                    </th>
                    <th scope="col">Nombres</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Tipo Usuario</th>
                    <th scope="col">Sede</th>
                    <th scope="col">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id_user}>
                      <td> U00{user.id_user} </td>
                      <td> {user.firstname} </td>
                      <td> {user.lastname} </td>
                      <td> {user.user} </td>
                      <td> {user.type_user} </td>
                      <td> {user.subsidiary} </td>
                      <td>
                        <Link
                          to={`/main/users/edit/${user.id_user}`}
                          className="btn btn-warning"
                        >
                          <FontAwesomeIcon icon={faPencil} /> Edit
                        </Link>
                        <span> </span>
                        <button onClick={ ()=>deleteUser(user.id_user) } className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /> Delete</button>
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
export default UsersPage;
