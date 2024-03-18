import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from '../../services/Api';
import GetCookie from '../../hooks/getCookie';
import axios from 'axios';
import Authenticated from '../../hooks/authenticated';

const EditSubsidiaryPage = () => {
    Authenticated();
    const [formSend, ChangeFormSend] = useState(false);
    
    const [subsidiary, setSubsidiary] = useState('')
    const [ticketLimit, setTicketLimit] = useState(0)

    const navigate = useNavigate()
    const {id_subsidiary} = useParams()

    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };

    useEffect( () => {
        if(jsonU.id_type_user!=1){
            navigate('/');
        }else{
            const getSubsidiaryById = async () => {
                const response = await axios.get(API_URL_BASE+`subsidiaries/get_by_id/${id_subsidiary}`,config);
                setSubsidiary(response.data[0].subsidiary)
                setTicketLimit(response.data[0].ticket_limit)
            }
            getSubsidiaryById()
        }
    }, [] )

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.put(API_URL_BASE+`subsidiaries/update/${id_subsidiary}`, {
            subsidiary: subsidiary,
            ticket_limit: ticketLimit
        }, config)
        ChangeFormSend(true);
        setTimeout(() => {
            ChangeFormSend(false)
            navigate('/main/subsidiaries');
            
        }, 2000);
    }

    return (
        <div className={"custom_container"}>
            <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Editar Sede</h3>
                    </div>
                    <div className="col-md-7">
                        <ol className="breadcrumb right">
                            <li className="breadcrumb-item"><Link to={'/main'}><i className=""></i> Tablero</Link></li>
                            <li className="breadcrumb-item active"><Link to={'/main/subsidiaries'}> Sedes</Link></li>
                            <li className="breadcrumb-item active">Editar Sede</li>
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
                                    <label htmlFor='subsidiary' className='form-label'>Sede *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='subsidiary'
                                        name='subsidiary'
                                        value={subsidiary}
                                        onChange={ (e)=> setSubsidiary(e.target.value) }
                                        disabled
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='ticketLimit' className='form-label'>Limite de Tickets *</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        id='ticketLimit'
                                        name='ticketLimit'
                                        value={ticketLimit}
                                        onChange={ (e)=> setTicketLimit(e.target.value) }
                                    />
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

export default EditSubsidiaryPage;
