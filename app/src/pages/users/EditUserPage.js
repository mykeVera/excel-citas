import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from './../../services/Api';
import GetCookie from './../../hooks/getCookie';
import axios from 'axios';
import Authenticated from '../../hooks/authenticated';

const EditUserPage = () => {
    Authenticated();
    const [formSend, ChangeFormSend] = useState(false);
    
    const [lastname, setLastname] = useState('')
    const [firstname, setFirstname] = useState('')
    const [user, setUser] = useState('')
    const [id_type_user, setId_type_user] = useState(0)
    const [id_subsidiary, setId_subsidiary] = useState(0)

    const [subsidiaries, setSubsidiaries] = useState([]);

    const navigate = useNavigate()
    const {id_user} = useParams()

    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };

    const getAllSubsidiaries = async () => {
        const response = await axios.get(API_URL_BASE + `subsidiaries`, config);
        setSubsidiaries(response.data);
    };

    useEffect( () => {
        if(jsonU.id_type_user!=1){
            navigate('/');
        }else{
            const getUserById = async () => {
                const response = await axios.get(API_URL_BASE+`users/get/${id_user}`,config);
                setLastname(response.data[0].lastname)
                setFirstname(response.data[0].firstname)
                setUser(response.data[0].user)
                setId_type_user(response.data[0].id_type_user)
                setId_subsidiary(response.data[0].id_subsidiary)
            }
            getUserById()
        }
        getAllSubsidiaries()
    }, [] )

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.put(API_URL_BASE+`users/update/${id_user}`, {
            lastname: lastname,
            firstname: firstname,
            user: user,
            id_type_user: id_type_user,
            id_subsidiary: id_subsidiary
        }, config)
        ChangeFormSend(true);
        setTimeout(() => {
            ChangeFormSend(false)
            navigate('/main/users');
            
        }, 2000);
    }

    return (
        <div className={"custom_container"}>
            <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Edit Usuario</h3>
                    </div>
                    <div className="col-md-7">
                        <ol className="breadcrumb right">
                            <li className="breadcrumb-item"><Link to={'/main'}><i className=""></i> Tablero</Link></li>
                            <li className="breadcrumb-item active"><Link to={'/main/users'}> Usuarios</Link></li>
                            <li className="breadcrumb-item active">Editar Usuario</li>
                        </ol>
                    </div>
                </div>
            </div>    
            
            <br/>

            {formSend && 
            <div className={'row'}>
                <div className='col-sm-12'>
                    <div className="alert alert-success" role="alert">
                        <FontAwesomeIcon icon={faCheck} /> ¡Datos actualizados con exito!
                    </div>
                </div>
            </div>
            }
            
            <div className={"row"}>
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className='mb-3'>
                                    <label htmlFor='lastname' className='form-label'>Apellidos *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='lastname'
                                        name='lastname'
                                        value={lastname}
                                        onChange={ (e)=> setLastname(e.target.value) }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='firstname' className='form-label'>Nombres *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='firstname'
                                        name='firstname'
                                        value={firstname}
                                        onChange={ (e)=> setFirstname(e.target.value) }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='user' className='form-label'>Usuario *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='user'
                                        name='user'
                                        value={user}
                                        onChange={ (e)=> setUser(e.target.value) }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='id_type_user' className='form-label'>Tipo de Usuario *</label>
                                    <select 
                                        className='form-select'
                                        id='id_type_user'
                                        name="id_type_user"
                                        value={id_type_user}
                                        onChange={ (e)=> setId_type_user(e.target.value) }
                                    >
                                        <option value="">--Seleccione--</option>
                                        <option value="1">ADMINISTRADOR</option>
                                        <option value="2">IMPORTADOR DE CITAS</option>
                                        <option value="3">CONSULTOR DE PROGRAMACION</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='id_subsidiary' className='form-label'>Sede *</label>
                                    <select 
                                        className='form-select'
                                        id='id_subsidiary'
                                        name="id_subsidiary"
                                        value={id_subsidiary}
                                        onChange={ (e)=> setId_subsidiary(e.target.value) }
                                    >
                                        <option value="">--Seleccione--</option>
                                        {subsidiaries.map((subsidiary) => (
                                            <option key={subsidiary.id_subsidiary} value={subsidiary.id_subsidiary}>{subsidiary.subsidiary}</option>
                                        ))}
                                    </select>
                                </div>
                                <hr/>
                                <button type="submit" className="btn btn-warning btn-block"><FontAwesomeIcon icon={faFloppyDisk} /> Actualizar</button>
                            </form>
                        </div>
                    </div>     
                    
                </div>
            </div>
            
        </div>
    )

}

export default EditUserPage;
