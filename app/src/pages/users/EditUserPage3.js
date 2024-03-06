import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from './../../services/Api';
import GetCookie from './../../hooks/getCookie';
import axios from 'axios';
import Authenticated from '../../hooks/authenticated';

const EditUserPage3 = () => {
    Authenticated();
    const [formSend, ChangeFormSend] = useState(false);

    const navigate = useNavigate()
    const {id_user} = useParams()

    const prueba = "Mike";
    
    const [lastname, setLastname] = useState('')
    const [user, setUser] = useState([])
    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };
    
    // useEffect( () => {
    //     const getProductById = async () => {
    //         const response = await axios.get(API_URL_BASE+`users/get/${id_user}`,config);
    //         console.log(response.data[0])
    //         setUser(response.data[0])
    //     }
    //     getProductById()
    // }, [] )
    
    // const getUserById = async () => {
    //     const response = await axios.get(API_URL_BASE+`users/get/${id_user}`,config);
    //     setUser(response.data[0]);
    //     console.log(response.data[0]);
    // }
    // getUserById();
    
    const pr = "mike";

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
                            <li className="breadcrumb-item active">Edit Usuario</li>
                        </ol>
                    </div>
                </div>
            </div>    
            
            <br/>

            {formSend && 
            <div className={'row'}>
                <div className='col-sm-12'>
                    <div className="alert alert-success" role="alert">
                        <FontAwesomeIcon icon={faCheck} /> ¡Datos guardados con exito!
                    </div>
                </div>
            </div>
            }
            
            <div className={"row"}>
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <Formik
                                initialValues={user}
                                validate={(valores) => {
                                    let errores = {}

                                    if(valores.lastname.trim().length === 0){
                                        errores.lastname = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.lastname.trim())){
                                        errores.lastname = 'Máximo 50 caracteres'
                                    }else if(!/^[a-zA-ZÀ-ÿ\s]{0,50}$/.test(valores.lastname.trim())){
                                        errores.lastname = 'Solo se aceptan letras'
                                    }

                                    if(valores.firstname.trim().length === 0){
                                        errores.firstname = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.lastname.trim())){
                                        errores.lastname = 'Máximo 50 caracteres'
                                    }else if(!/^[a-zA-ZÀ-ÿ\s]{0,50}$/.test(valores.lastname.trim())){
                                        errores.lastname = 'Solo se aceptan letras'
                                    }

                                    if(valores.user.trim().length === 0){
                                        errores.user = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.user.trim())){
                                        errores.user = 'Máximo 50 caracteres'
                                    }else if(/^\S+\s/.test(valores.user.trim())){
                                        errores.user = 'No se permiten espacios en blanco'
                                    }

                                    if(!valores.id_type_user){
                                        errores.id_type_user = 'Seleccione una opción'
                                    }
                                    
                                    return errores;
                                }}

                                onSubmit={ async (valores, {resetForm}) => {
                                    // const getU = GetCookie('_userIn_');
                                    // const jsonU = JSON.parse(getU);
                                    // const config = {
                                    //     headers: {
                                    //         Authorization: `Bearer `+jsonU.token
                                    //     }
                                    // };
                                    console.log(valores);
                                    // console.log(config);
                                    // const result = await axios.post(API_URL_BASE + `users/store`, {
                                    //     lastname:valores.lastname,
                                    //     firstname:valores.firstname,
                                    //     user:valores.user,
                                    //     pass:valores.pass,
                                    //     id_type_user:valores.id_type_user
                                    // }, config)
                                    // console.log(result.data)
                                    // resetForm();
                                    // ChangeFormSend(true);
                                    // setTimeout(() => ChangeFormSend(false), 5000);
                                }}
                            >
                                {( {errors} ) => (
                                    <Form>
                                        <div className='mb-3'>
                                            <label htmlFor='lastname' className='form-label'>Apellidos *</label>
                                            <Field 
                                                type='text'
                                                className='form-control'
                                                id='lastname'
                                                name='lastname'
                                            />
                                            <ErrorMessage name="lastname" component={() => (
                                                <div className='error'>{errors.lastname}</div>
                                            )} />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='firstname' className='form-label'>Nombres *</label>
                                            <Field
                                                type='text'
                                                className='form-control'
                                                id='firstname'
                                                name='firstname'
                                            />
                                            <ErrorMessage name="firstname" component={() => (
                                                <div className='error'>{errors.firstname}</div>
                                            )} />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor='user' className='form-label'>Usuario *</label>
                                            <Field
                                                type='text'
                                                className='form-control'
                                                id='user'
                                                name='user'
                                            />
                                            <ErrorMessage name="user" component={() => (
                                                <div className='error'>{errors.user}</div>
                                            )} />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor='id_type_user' className='form-label'>Tipo de Usuario *</label>
                                            <Field
                                                className='form-select'
                                                id='id_type_user'
                                                name="id_type_user"
                                                as="select">
                                                    <option value="">--Seleccione--</option>
                                                    <option value="1">Administrador</option>
                                                    <option value="2">Colaborador</option>
                                            </Field>
                                            <ErrorMessage name="id_type_user" component={() => (
                                                <div className='error'>{errors.id_type_user}</div>
                                            )} />
                                        </div>
                                        <hr/>
                                        <button type="submit" className="btn btn-success btn-block"><FontAwesomeIcon icon={faFloppyDisk} /> Registrar</button>
                                    </Form>
                                )}         
                            </Formik>
                        </div>
                    </div>     
                    
                </div>
            </div>
            
        </div>
    )

}

export default EditUserPage3;
