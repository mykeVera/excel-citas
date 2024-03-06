import React, { useEffect, useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "../../../src/assets/scss/layout/sidebar/custom.scss";
//import { FaGem, FaHeart } from "react-icons/fa";
import GetCookie from "./../../hooks/getCookie";
import RemoveCookie from "./../../hooks/removeCookie";
import { Link, renderMatches, useNavigate } from "react-router-dom";

import logo_pulso from "./../../assets/images/logo_pulso2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
  faMessage,
  faFolder
} from "@fortawesome/free-solid-svg-icons";
//import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Aside = () => {
  const navigate = useNavigate();
  const [moduleUser, setModuleUser] = useState();

  const CloseSesion = async (e) => {
    RemoveCookie("_userIn_");
    navigate("/");
  };

  const getU = GetCookie("_userIn_");
  const jsonU = JSON.parse(getU);

  useEffect(() => {
    if(jsonU.id_type_user==1){ //Administrador
      setModuleUser(true)
    }else{
      setModuleUser(false)
    }
    
  });

  return (
    <div className={"menu"}>
      <div style={{ height: "100vh" }}>
        <ProSidebar>
          <SidebarHeader>
            <h2 className="center" style={{ marginTop: "5px" }}>
              <Link
                to={"/main"}
                style={{ textDecoration: "none", color: "white" }}
              >
                CITAS
              </Link>
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <br />
            <h4 className="center">{jsonU.firstname}</h4>
            <h6 className="center">Sede: {jsonU.subsidiary}</h6>
            <Menu iconShape="square">
              <MenuItem onClick={CloseSesion} className="center">
                {" "}
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Cerrar Sesión
              </MenuItem>
            </Menu>
            <br />
            <Menu iconShape="square">
              <SubMenu
                title="Mi perfil"
                icon={<FontAwesomeIcon icon={faUser} />}
              >
                <MenuItem>
                  <Link to={`/main/users/update/pass/${jsonU.id_user}`}>Cambiar contraseña</Link>
                </MenuItem>
              </SubMenu>
              {moduleUser && 
                <SubMenu
                  title="Usuarios del Sistema"
                  icon={<FontAwesomeIcon icon={faUser} />}
                >
                  <MenuItem>
                    <Link to={"/main/users"}>Usuarios</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to={"/main/users/create"}>Nuevo Usuario</Link>
                  </MenuItem>
                </SubMenu>
              }
              <SubMenu
                title="Programaciones"
                icon={<FontAwesomeIcon icon={faFolder} />}
              >
                <MenuItem>
                  <Link to={"/main/appointment/import"}>Cargar Programaciones</Link>
                </MenuItem>
                <MenuItem>
                  <Link to={"/main/appointment/search"}>Consultar Programación</Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                title="Reportes"
                icon={<FontAwesomeIcon icon={faUser} />}
              >
                <MenuItem>
                  <Link to={"/main/appointment/report"}>Reporte de Programaciones</Link>
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>

          <SidebarFooter>
            <div className="center mt-1 mb-1">
              <img alt="" src={logo_pulso} width="25" className="mb-2" />
              <br />
              <h6>&copy; Pulso Corporación Médica - 2024</h6>
            </div>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </div>
  );
};

export default Aside;
