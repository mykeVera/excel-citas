import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from './../../services/Api';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik } from 'formik'
import { useForm } from '../../hooks/useForm';


const initialForm = {
    lastname: ''
}

const validationsForm = (form) => {
    let errors = {};
    let regexMax=/^[\s\S]{0,10}$/;

    if(!form.lastname.trim()){
        errors.lastname = "El campo 'lastname' es requerido";
    }else if(!regexMax.test(form.lastname.trim())){
        errors.lastname = 'Máximo 10 caracteres';
    }

    return errors;
}

const EditUserPage2 = () => {

    const {
        form,
        errors,
        loading,
        response,
        handleChange,
        handleBlur,
        handleSubmit
    } = useForm(initialForm, validationsForm)

    return (
        <div className={"custom_container"}>
            <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Editar Usuario</h3>
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
            
            <div className={"row"}>
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor='lastname' className='form-label'>Apellidos *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='lastname'
                                        name='lastname'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={form.lastname}
                                        required
                                    />
                                    {errors.lastname && <div className='error'>{errors.lastname}</div>}
                                    
                                </div>
                                <hr/>
                                {/* <button type="submit" className="btn btn-success btn-block"><FontAwesomeIcon icon={faFloppyDisk} /> Registrar</button> */}
                                <button type="submit" className="btn btn-success btn-block"><FontAwesomeIcon icon={faFloppyDisk} /> Registrar</button>
                            </form>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default EditUserPage2;
