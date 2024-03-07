import React, { useState } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from './../../services/Api';
import GetCookie from './../../hooks/getCookie';
import RemoveCookie from "./../../hooks/removeCookie";
import axios from 'axios';
import Authenticated from '../../hooks/authenticated';

const PasswordPage = () => {
    Authenticated();

    const navigate = useNavigate()
    const [formSend, ChangeFormSend] = useState(false);

    const [alertCurrentPass, ChangeAlertCurrentPass] = useState();

    return (
        <div className={"custom_container"}>
            <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Cambiar Contraseña</h3>
                    </div>
                    <div className="col-md-7">
                        <ol className="breadcrumb right">
                            <li className="breadcrumb-item"><Link to={'/main'}><i className=""></i> Tablero</Link></li>
                            <li className="breadcrumb-item active">Cambiar Contraseña</li>
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
                            <Formik
                                initialValues={{
                                    current_pass: '',
                                    new_pass: '',
                                    confir_pass: ''
                                }}

                                validate={(valores) => {
                                    let errores = {}

                                    if(valores.current_pass.trim().length === 0){
                                        errores.current_pass = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.current_pass.trim())){
                                        errores.current_pass = 'Máximo 50 caracteres'
                                    }else if(/^\S+\s/.test(valores.current_pass.trim())){
                                        errores.current_pass = 'No se permiten espacios en blanco'
                                    }

                                    if(valores.new_pass.trim().length === 0){
                                        errores.new_pass = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.new_pass.trim())){
                                        errores.new_pass = 'Máximo 50 caracteres'
                                    }else if(/^\S+\s/.test(valores.new_pass.trim())){
                                        errores.new_pass = 'No se permiten espacios en blanco'
                                    }

                                    if(valores.confir_pass.trim().length === 0){
                                        errores.confir_pass = 'Campo requerido'
                                    }else if(!/^[\s\S]{0,50}$/.test(valores.confir_pass.trim())){
                                        errores.confir_pass = 'Máximo 50 caracteres'
                                    }else if(/^\S+\s/.test(valores.confir_pass.trim())){
                                        errores.confir_pass = 'No se permiten espacios en blanco'
                                    }else if((valores.confir_pass!=valores.new_pass)){
                                        errores.confir_pass = 'Las contraseñas no coinciden'
                                    }
                                    
                                    return errores;
                                }}

                                onSubmit={ async (valores, {resetForm}) => {
                                    const getU = GetCookie('_userIn_');
                                    const jsonU = JSON.parse(getU);
                                    const config = {
                                        headers: {
                                            Authorization: `Bearer `+jsonU.token
                                        }
                                    };

                                    let url = API_URL_BASE + "users/login";
                                    let res = await axios.post(url,{
                                        user: jsonU.user,
                                        pass: valores.current_pass
                                    });
                                    if(!res.data['id_user']){
                                        ChangeAlertCurrentPass(true)
                                        setTimeout(() => ChangeAlertCurrentPass(false), 4000);
                                    }else{
                                        ChangeAlertCurrentPass(false)
                                        //CAMBIAR CONTRASEÑA
                                        const result = await axios.put(API_URL_BASE + `users/update/pass/${jsonU.id_user}`, {
                                            pass:valores.confir_pass,
                                        }, config)
                                        console.log(result.data)
                                        resetForm();
                                        ChangeFormSend(true);
                                        setTimeout(() => {
                                            ChangeFormSend(false)
                                            RemoveCookie("_userIn_");
                                            navigate("/");
                                        }, 2000);
                                    }
                                }}
                            >
                                {( {errors} ) => (
                                    <Form autoComplete="off">
                                        <div className='mb-4'>
                                            <label htmlFor='current_pass' className='form-label'>Contraseña actual: *</label>
                                            <Field
                                                type='password'
                                                className='form-control'
                                                id='current_pass'
                                                name='current_pass'
                                            />
                                            <ErrorMessage name="current_pass" component={() => (
                                                <div className='error'>{errors.current_pass}</div>
                                            )} />
                                            {alertCurrentPass && 
                                            <div className='error'>Contraseña actual incorrecta</div>
                                            }
                                        </div>
                                        <hr/>
                                        <div className='mb-4'>
                                            <label htmlFor='panew_passss' className='form-label'>Nueva contraseña: *</label>
                                            <Field
                                                type='password'
                                                className='form-control'
                                                id='new_pass'
                                                name='new_pass'
                                            />
                                            <ErrorMessage name="new_pass" component={() => (
                                                <div className='error'>{errors.new_pass}</div>
                                            )} />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor='confir_pass' className='form-label'>Confirmar contraseña: *</label>
                                            <Field
                                                type='password'
                                                className='form-control'
                                                id='confir_pass'
                                                name='confir_pass'
                                            />
                                            <ErrorMessage name="confir_pass" component={() => (
                                                <div className='error'>{errors.confir_pass}</div>
                                            )} />
                                        </div>
                                        <hr/>
                                        <button type="submit" className="btn btn-danger btn-block"><FontAwesomeIcon icon={faFloppyDisk} /> Guardar cambios</button>
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

export default PasswordPage;
