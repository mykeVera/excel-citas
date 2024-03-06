import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { API_URL_BASE } from './../services/Api';
import GetCookie from './getCookie';
import RemoveCookie from './removeCookie';

const Authenticated = async () => {
    const navigate = useNavigate();
    let url = API_URL_BASE + "users/auth";
    let jsonU = "";
    if(GetCookie('_userIn_')){
        const getU = GetCookie('_userIn_');
        jsonU = JSON.parse(getU);
    }else{
        navigate('/');
    }
    useEffect( () => {
        const resp = axios.post(url,{id_user:jsonU.id_user,user:jsonU.user});
        resp.then(value => {
            if(GetCookie('_userIn_')){
                if(value.data==="Not Authenticated"){
                    RemoveCookie('_userIn_');
                }
            }else{
                navigate('/');
            }
        }).catch(err => {
            console.log(err);
        });
    });
}

export default Authenticated;