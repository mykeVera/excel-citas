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
    const [typeUser1, setTypeUser1] = useState(false); //ADMINISTRADOR
    const [typeUser2, setTypeUser2] = useState(false); //IMPORTADOR DE CITAS
    const [typeUser3, setTypeUser3] = useState(false); //CONSULTOR DE PROGRAMACION

    const CloseSesion = async (e) => {
        RemoveCookie("_userIn_");
        navigate("/");
    };

    const getU = GetCookie("_userIn_");
    const jsonU = JSON.parse(getU);

    useEffect(() => {
        if(jsonU.id_type_user==1){ //ADMINISTRADOR
            setTypeUser1(true)
        }else if(jsonU.id_type_user==2){ //IMPORTADOR DE CITAS
            setTypeUser2(true)
        }else if(jsonU.id_type_user==3){//CONSULTOR DE PROGRAMACION
            setTypeUser3(true)
        }else{
            setTypeUser1(false)
            setTypeUser2(false)
            setTypeUser3(false)
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
                            {(typeUser1) && 
                                <span>
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
                                    <SubMenu
                                        title="Sedes"
                                        icon={<FontAwesomeIcon icon={faUser} />}
                                    >
                                        <MenuItem>
                                            <Link to={"/main/subsidiaries"}>Sedes</Link>
                                        </MenuItem>
                                    </SubMenu>
                                </span>
                            }
                            <SubMenu
                                title="Programaciones"
                                icon={<FontAwesomeIcon icon={faFolder} />}
                            >
                                {(typeUser1 || typeUser2) && 
                                    <MenuItem>
                                        <Link to={"/main/appointment/import"}>Cargar Programaciones</Link>
                                    </MenuItem>
                                }
                                {(typeUser1 || typeUser2 || typeUser3) && 
                                    <MenuItem>
                                        <Link to={"/main/appointment/search"}>Consultar Programación</Link>
                                    </MenuItem>
                                }
                            </SubMenu>
                            {(typeUser1 || typeUser2) &&
                                <SubMenu
                                    title="Reportes"
                                    icon={<FontAwesomeIcon icon={faUser} />}
                                >
                                    <MenuItem>
                                        <Link to={"/main/appointment/report"}>Reporte de Programaciones</Link>
                                    </MenuItem>
                                </SubMenu>
                            }
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
