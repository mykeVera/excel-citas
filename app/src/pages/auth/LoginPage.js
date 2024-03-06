import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'; 

import "./../../assets/css/signin.css";
import logo from "./../../assets/images/calendar.png"
import logo_pulso from "./../../assets/images/logo_pulso2.png"

import {API_URL_BASE} from '../../services/Api';
import SetCookie from './../../hooks/setCookie';
import GetCookie from './../../hooks/getCookie';
import RemoveCookie from './../../hooks/removeCookie';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formLoginNot, ChangeFormLoginNot] = useState(false);

  useEffect(() => {
    if(GetCookie('_userIn_')){
      navigate('/main');
    }
  });

  const [userIn, setUserIn] = useState({
    user: "",
    pass: "",
  });

  const handleInputChange = async (e) => {
    let { name, value } = e.target;
    let newDatos = { ...userIn, [name]: value };
    await setUserIn(newDatos);
    console.log(newDatos);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!e.target.checkValidity()) {
        console.log("No enviar");
      } else {
        let url = API_URL_BASE + "users/login"; 
        let res = await axios.post(url,userIn);
        if(!res.data['id_user']){
          console.log(res.data);
          ChangeFormLoginNot(true);
          setTimeout(() => ChangeFormLoginNot(false), 5000);
          setUserIn({
            user: "",
            pass: ""
          });
        }else{
          console.log("Acceso Correcto");
          ChangeFormLoginNot(false);
          RemoveCookie('_userIn_'); //Removemos cokkie if exist;
          SetCookie('_userIn_', JSON.stringify(res.data)); //Set Cookie
          navigate('/main');
        }
      }
    } catch (error) {
      console.log('Error: '+ error);
    }
  };

  return (
    <div className="sign_center">
      <div className="text-center">
        <main className="form-signin w-100 m-auto shadow-lg p-3 mb-5">
          <form id="formLogin" onSubmit={handleSubmit} autoComplete="off">
            <img className="mb-4" src={logo} alt="" width="150" height="150"/>
            <h1 className="h3 mb-3 fw-normal">Iniciar Sesión</h1>

            <div className="form-floating">
              <input type="text" autoFocus className="form-control" id="user" name="user" onChange={handleInputChange} value={userIn.user} placeholder="Usuario" />
              <label htmlFor="floatingInput">Usuario</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" id="pass" name="pass" onChange={handleInputChange} value={userIn.pass} placeholder="Contraseña"/>
              <label htmlFor="floatingPassword">Contraseña</label>
            </div>
            <button type="submit" className="w-100 btn btn-lg btn-warning">Ingresar</button>

            {formLoginNot && 
              <div className="alert alert-danger mt-2" role="alert">
                <FontAwesomeIcon icon={faCheck} /> Credenciales Incorrectas
              </div>
            }
            
            <p className="mt-4 mb-1 text-muted"><img style={{paddingTop: "15px"}} alt="" className="mb-4" src={logo_pulso} width="25"/> &copy; Pulso Corporación Médica - 2024</p>
          </form>
                   
        </main>
      </div>
    </div>
  );
};
export default LoginPage;
