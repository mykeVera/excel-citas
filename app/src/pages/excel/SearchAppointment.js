import React, { useState, useRef, useEffect } from 'react'
import GetCookie from '../../hooks/getCookie';
import axios from 'axios'
import Authenticated from '../../hooks/authenticated';
import { Link, useNavigate } from 'react-router-dom'
import { API_URL_BASE } from './../../services/Api';
import logo from "./../../assets/images/pulso_salud_original.svg";
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const SearchAppointment = () => {
    Authenticated();
    const [stateDb, setStateDb] = useState(false);
    const [alertSuccess, ChangeAlertSuccess] = useState(false);
    const [alertFormat, ChangeAlertFormat] = useState();
    const [alertFormat2, ChangeAlertFormat2] = useState();
    const [alertFormat2_1, ChangeAlertFormat2_1] = useState();
    const [alertFormat2_2, ChangeAlertFormat2_2] = useState();
    const [viewTable, SetViewTable] = useState(false);
    
    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };

    const [found, setFound] = useState(false);

    let [idAppointment, setIdAppointment]  = useState('');
    let [txtNumDoc, setTxtNumDoc] = useState('');

    let [appointments, setAappointments ] = useState([]);

    let [fecha, setFecha] = useState('');
    let [apellidos, setApellidos] = useState('');
    let [nombres, setNombres] = useState('');
    let [empresa, setEmpresa] = useState('');
    let [contrata, setContrata] = useState('');
    let [perfil, setPerfil] = useState('');
    let [tipoExamen, setTipoExamen] = useState('');
    let [area, setArea] = useState('');
    let [puesto, setPuesto] = useState('');
    let [proyecto, setProyecto] = useState(null);
    let [centroCostos, setCentroCostos] = useState(null);
    let [personaProgramo, setPersonaProgramo] = useState(null);
    let [observacion, setObservacion] = useState(null);
    let [ticketInicio, setTicketInicio] = useState(null);
    let [ticketFinal, setTicketFinal] = useState(null);
    let [ticketGenerar, setTicketGenerar] = useState(null);
    let [programacionExcel, setProgramacionExcel] = useState('');
    let [id_subsidiaria, setIdSubsidiaria] = useState(0);

    let [time1, setTime1] = useState(null);
    let [time2, setTime2] = useState(null);

    let [ticketLimit, setTicketLimit] = useState(false);

    let [today, setToday] = useState('');

    useEffect(() => {
        const fecha_today = new Date()
        setToday(formatearFecha(fecha_today));

        let fecha_today2 = new Date()
        fecha_today2 = formatearFechaDB(fecha_today2)

        const promise = new Promise( async (resolve) => {
            const result = await axios.get(API_URL_BASE+`appointments/get/status_ticket/${jsonU.id_subsidiary}/${fecha_today2}`, config);
            resolve(result.data[0].ticket_status);
        });
        promise.then( async (tickets_emit) => {
            const promise2 = new Promise( async (resolve) => {
                const result2 = await axios.get(API_URL_BASE+`subsidiaries/get_by_id/${jsonU.id_subsidiary}`,config);
                resolve(result2.data[0].ticket_limit);
            });
            promise2.then( async (tickets_limit) => {
                console.log(parseInt(tickets_emit))
                console.log(parseInt(tickets_limit))
                if(parseInt(tickets_emit) >= parseInt(tickets_limit)){
                    setTicketLimit(true)
                }else{
                    setTicketLimit(false)
                }
            });
        });

    });

    const componentRef = useRef();

    const resetForm = () => {
        setFecha("");
        setApellidos("");
        setNombres("");
        setEmpresa("");
        setContrata ("");
        setPerfil("");
        setTipoExamen("");
        setArea("");
        setPuesto("");
        setProyecto("");
        setCentroCostos("");
        setPersonaProgramo("");
        setObservacion("");
        setTicketInicio("");
        setTicketFinal("");
        setTicketGenerar("");
        setProgramacionExcel("");
    }

    const formatearFecha = (fecha) => {
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
        let año = fecha.getFullYear();
      
        // Agregar ceros iniciales si es necesario
        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;
      
        // Crear la cadena de fecha en el formato dd/mm/YYYY
        const fechaFormateada = dia + '/' + mes + '/' + año;
        return fechaFormateada;
    }

    const formatearFechaDB = (fecha) => {
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
        let año = fecha.getFullYear();
      
        // Agregar ceros iniciales si es necesario
        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;
      
        // Crear la cadena de fecha en el formato YYYY-mm-dd
        const fechaFormateada = año + '-' + mes + '-' + dia;
        return fechaFormateada;
    }

    const formatDateAndHour = (fecha) => {
        let day = fecha.getDate();
        let month = fecha.getMonth() + 1; // Los meses comienzan desde 0
        let year = fecha.getFullYear();

        let hour = fecha.getHours();
        let minute = fecha.getMinutes();
        let second = fecha.getSeconds();
      
        // Agregar ceros iniciales si es necesario
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
      
        // Crear la cadena de fecha en el formato dd/mm/YYYY
        const fechaFormateada = `${day}/${month}/${year} ${hour}:${minute}`;
        return fechaFormateada;
    }

    const formatDateAndHourDB = (fecha) => {
        let day = fecha.getDate();
        let month = fecha.getMonth() + 1; // Los meses comienzan desde 0
        let year = fecha.getFullYear();

        let hour = fecha.getHours();
        let minute = fecha.getMinutes();
        let second = fecha.getSeconds();
      
        // Agregar ceros iniciales si es necesario
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
      
        // Crear la cadena de fecha en el formato dd/mm/YYYY
        const fechaFormateada = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        return fechaFormateada;
    }

    const formatTime = (fecha) => {
        let hour = fecha.getHours();
        let minute = fecha.getMinutes();
        let second = fecha.getSeconds();
      
        // Agregar ceros iniciales si es necesario
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
      
        // Crear la cadena de fecha en el formato dd/mm/YYYY
        const TimeFormat = `${hour}:${minute}:${second}`;
        return TimeFormat;
    }

    const SearchProgramming = async (document) => {
        const subsidiary = jsonU.subsidiary;
        const promise = new Promise( async (resolve) => { // SEARCH IN DDBB
            const result = await axios.get(API_URL_BASE+`appointments/get/nro_sub/${document}/${subsidiary}`, config);
            resolve(result.data);
        });
        promise.then( async (data_ddbb) => {
            if(data_ddbb.length > 0){
                //Mostrar programacion(es)
                setAappointments(data_ddbb)
                ChangeAlertSuccess(true)
                SetViewTable(true)
                setProgramacionExcel('')
            }else{
                ChangeAlertSuccess(false)
                ChangeAlertFormat2_2(true)
                SetViewTable(false)
                setFecha(today)
                setProgramacionExcel('NO (Manual)')
            }
            // if(data_ddbb){ // RENDER DATA OF DDBB
            //     setIdAppointment(data_ddbb.id_appointment)
            //     setFecha(data_ddbb.date_programing);
            //     setApellidos(data_ddbb.last_name);
            //     setNombres(data_ddbb.first_name);
            //     setEmpresa(data_ddbb.company);
            //     setContrata (data_ddbb.subcontract);
            //     setPerfil(data_ddbb.protocol);
            //     setTipoExamen(data_ddbb.examen_type);
            //     setArea(data_ddbb.area);
            //     setPuesto(data_ddbb.job_position);
            //     setProgramacionExcel(data_ddbb.in_excel_programing);
            //     setFound(true)
            //     setStateDb(true)
            // }else{ // SEARCH IN EXCEL
                
            // }
        }) 
    }

    const handleClick = () => {
        resetForm();
        setTime1(formatTime(new Date()))
        ChangeAlertFormat2_1(false)
        ChangeAlertFormat2_2(false)
      
        if(txtNumDoc.trim() === ''){
            ChangeAlertFormat2_1(true)
        }else{
            SearchProgramming(txtNumDoc.trim())
        }
    }

    const handleProcess = async () => {
        if(found){
            if(stateDb){ // if found in ddbb day
                let state_programing = 0
                if(programacionExcel === 0){
                    state_programing = 0
                }else{
                    state_programing = 1
                }
                const fecha_excel = fecha
                const fecha_split = fecha_excel.split("/", 3)
                const fecha_custom = fecha_split[2] + "-" + fecha_split[1] + "-" +fecha_split[0]
                // setFecha(ticketGenerar ? formatDateAndHour(new Date(ticketGenerar)) : formatDateAndHour(new Date()));

                const result = await axios.put(API_URL_BASE + `appointments/update/${idAppointment}`, {
                    date_programing: fecha_custom,
                    nro_documento: txtNumDoc.trim(),
                    last_name: apellidos ? apellidos.toUpperCase().trim() : "",
                    first_name: nombres ? nombres.toUpperCase().trim() : "",
                    company: empresa ? empresa.toUpperCase().trim() : "",
                    subcontract: contrata ? contrata.toUpperCase().trim() : null,
                    protocol: perfil ? perfil.toUpperCase().trim() : null,
                    examen_type: tipoExamen ? tipoExamen.toUpperCase().trim() : null,
                    area: area ? area.toUpperCase().trim() : null,
                    job_position: puesto ? puesto.toUpperCase().trim() : null,
                    project: proyecto ? proyecto.toUpperCase().trim() : null,
                    cost_center: centroCostos ?  centroCostos.toUpperCase().trim() : null,
                    person_programmed: personaProgramo ? personaProgramo.toUpperCase().trim() : null,
                    observation: observacion ? observacion.toUpperCase().trim() : null,
                    ticket_time_init: ticketInicio ? ticketInicio : time1,
                    ticket_time_finish: ticketFinal ? ticketFinal : formatTime(new Date()),
                    ticket_generate: ticketGenerar ? String(formatDateAndHourDB(new Date(ticketGenerar))) : String(formatDateAndHourDB(new Date())),
                    in_excel_programing: state_programing,
                    id_subsidiary: id_subsidiaria
                }, config)
                handlePrint()
                setFound(false)
            }else{ // if found in ddbb day

                // const result = await axios.post(API_URL_BASE + `appointments/store`, { // create
                //     nro_documento: txtNumDoc.trim(),
                //     last_name: apellidos.toUpperCase().trim(),
                //     first_name: nombres.toUpperCase().trim(),
                //     company: empresa.toUpperCase().trim(),
                //     subcontract: contrata.toUpperCase().trim(),
                //     protocol: perfil.toUpperCase().trim(),
                //     examen_type: tipoExamen.toUpperCase().trim(),
                //     area: area.toUpperCase().trim(),
                //     job_position: puesto.toUpperCase().trim(),
                //     in_excel_programing: 1
                // }, config)
                // handlePrint()
                // setFound(false)
            }
        }else{
            console.log('Sin programación')
        }
    }
    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Ticket',
        onAfterPrint: () => {
            console.log('Print success')
            setIdAppointment('')
            setTxtNumDoc('')
            resetForm()
            SetViewTable(false)
            ChangeAlertSuccess(false)
            ChangeAlertFormat2_1(false)
            ChangeAlertFormat2_2(false)
        }
    });

    const handleChange = (e) => {
        setTxtNumDoc(e.target.value);
        setFound(false);
        ChangeAlertFormat2_2(false)
        SetViewTable(false)
        ChangeAlertSuccess(false)
        resetForm();
    }

    const handleNew = async () => {
        // setFecha(ticketGenerar ? formatDateAndHour(new Date(ticketGenerar)) : formatDateAndHour(new Date()));
        const result = await axios.post(API_URL_BASE + `appointments/store`, { // create
            date_programing: formatDateAndHourDB(new Date()),
            nro_documento: txtNumDoc.trim(),
            last_name: apellidos.toUpperCase().trim(),
            first_name: nombres.toUpperCase().trim(),
            company: empresa.toUpperCase().trim(),
            subcontract: contrata.toUpperCase().trim(),
            protocol: perfil.toUpperCase().trim(),
            examen_type: tipoExamen.toUpperCase().trim(),
            area: area.toUpperCase().trim(),
            job_position: puesto.toUpperCase().trim(),
            project: proyecto ? proyecto.toUpperCase().trim() : null,
            cost_center: centroCostos ?  centroCostos.toUpperCase().trim() : null,
            person_programmed: personaProgramo ? personaProgramo.toUpperCase().trim() : null,
            observation: observacion ? observacion.toUpperCase().trim() : null,
            ticket_time_init: ticketInicio ? ticketInicio : time1,
            ticket_time_finish: ticketFinal ? ticketFinal : formatTime(new Date()),
            ticket_generate: ticketGenerar ? String(formatDateAndHourDB(new Date(ticketGenerar))) : String(formatDateAndHourDB(new Date())),
            in_excel_programing: 0,
            id_subsidiary: jsonU.id_subsidiary
        }, config)
        handlePrint()
        setFound(false)
        ChangeAlertFormat2_2(false)
    }

    const renderPatient = async (id_appointment) => {  
        console.log(time1)
        const promise = new Promise( async (resolve) => { // SEARCH IN DDBB
            const result = await axios.get(API_URL_BASE+`appointments/get/id/${id_appointment}`, config);
            resolve(result.data[0]);
        });
        promise.then((d) => {
            console.log(d)
            setIdAppointment(d.id_appointment);
            setFecha(d.date_programing);
            setApellidos(d.last_name);
            setNombres(d.first_name);
            setEmpresa(d.company);
            setContrata (d.subcontract);
            setPerfil(d.protocol);
            setTipoExamen(d.examen_type);
            setArea(d.area);
            setPuesto(d.job_position);
            setProyecto(d.project);
            setCentroCostos(d.cost_center);
            setPersonaProgramo(d.person_programmed);
            setObservacion(d.observation);
            setTicketInicio(d.ticket_time_init);
            setTicketFinal(d.ticket_time_finish);
            setTicketGenerar(d.ticket_generate);
            setProgramacionExcel(d.in_excel_programing);
            setIdSubsidiaria(d.id_subsidiary);
            setFound(true);
            setStateDb(true);
        })
    }

    return (
        <div className={"custom_container"}>
            {/* <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Consultar Programación</h3>
                    </div>
                    <div className="col-md-7">
                        <ol className="breadcrumb right">
                            <li className="breadcrumb-item"><Link to={'/main'}><i className=""></i> Tablero</Link></li>
                            <li className="breadcrumb-item active">Consultar Programación</li>
                        </ol>
                    </div>
                </div>
            </div>     */}
            
            <br/>
            
            <div className={"row"}>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            
                        <br />
                        <div className="text-center">
                            <img src={logo} className="logo" alt="" />
                        </div>
                        <center>
                            <h3>Programaciones para hoy {today}</h3>
                        </center>

                        {ticketLimit &&
                            <span>
                                <br />
                                <center>
                                    <h3 className='alert-limit'>Limite de tickets alcanzados!</h3>
                                </center>
                            </span>
                        }
                        <br />
                        <div className="col-md-12">

                            <div className="row">
                                <div className="form-group">
                                    <h5><span className='btn btn-warning bold'>1 </span> Digite el número de documento</h5>
                                    <div className='paso1'>
                                        <input
                                            type="text"
                                            value={txtNumDoc}
                                            onChange={handleChange}
                                            id='numeroDocumento'
                                            className="form-control"
                                            placeholder=""
                                            autoComplete="off"
                                        />
                                        <button id='btnSearch' type="button" onClick={handleClick} className="btn btn-danger">Buscar</button>
                                        {alertSuccess && 
                                            <div className='error'> Citas encontradas para hoy: {appointments.length}</div>
                                        }
                                        {alertFormat2_1 && 
                                            <div className='error'> Digite número de documento</div>
                                        }
                                        {alertFormat2_2 && 
                                            <div className='error'> No se encuentra programación, por favor, ingrese sus datos en el paso # 2</div>
                                        }
                                    </div>
                                </div>

                                <br/><br/><br/><br/><br/>
                                <div className="col-md-1"></div>
                                {viewTable &&
                                <div className="col-md-10">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Paciente</th>
                                                <th scope="col">Empresa</th>
                                                <th scope="col">Contrata</th>
                                                <th scope="col">Perfil</th>
                                                <th scope="col">Tipo Examen</th>
                                                <th scope="col">Puesto</th>
                                                <th scope="col">Ver</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((a) => (
                                                <tr key={a.id_appointment}>
                                                    <td> {a.last_name} {a.first_name} </td>
                                                    <td> {a.company} </td>
                                                    <td> {a.subcontract} </td>
                                                    <td> {a.protocol} </td>
                                                    <td> {a.examen_type} </td>
                                                    <td> {a.job_position} </td>
                                                    <td>
                                                        <button onClick={ ()=>renderPatient(a.id_appointment) } className='btn btn-danger'><FontAwesomeIcon icon={faEye} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                }
                                <div className="form-group">
                                    <br/>
                                    <h5><span className='btn btn-warning bold'>2 </span> Verifique e imprima los datos</h5>
                                    <div className="row">
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Fecha:</label>
                                                    <input
                                                        type="text"
                                                        value={fecha}
                                                        onChange={(e) => setFecha(e.target.value)}
                                                        className="form-control"
                                                        id='fecha'
                                                        placeholder=""
                                                        autoComplete="off"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Apellidos</label>
                                                    <input
                                                        type="text"
                                                        value={apellidos}
                                                        onChange={(e) => setApellidos(e.target.value)}
                                                        className="form-control"
                                                        id='apellidos'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Nombres</label>
                                                    <input
                                                        type="text"
                                                        value={nombres}
                                                        onChange={(e) => setNombres(e.target.value)}
                                                        className="form-control"
                                                        id='nombres'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Empresa:</label>
                                                    <input
                                                        type="text"
                                                        value={empresa}
                                                        onChange={(e) => setEmpresa(e.target.value)}
                                                        className="form-control"
                                                        id='empresa'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Contrata:</label>
                                                    <input
                                                        type="text"
                                                        value={contrata ? contrata : ""}
                                                        onChange={(e) => setContrata(e.target.value)}
                                                        className="form-control"
                                                        id='contrata'
                                                        placeholder=""
                                                        autoComplete="off"
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Perfil:</label>
                                                    <input
                                                        type="text"
                                                        value={perfil}
                                                        onChange={(e) => setPerfil(e.target.value)}
                                                        className="form-control"
                                                        id='perfil'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Tipo Examen</label>
                                                    <input
                                                        type="text"
                                                        value={tipoExamen}
                                                        onChange={(e) => setTipoExamen(e.target.value)}
                                                        className="form-control"
                                                        id='tipoExamen'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Área</label>
                                                    <input
                                                        type="text"
                                                        value={area ? area : ""}
                                                        onChange={(e) => setArea(e.target.value)}
                                                        className="form-control"
                                                        id='area'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Puesto</label>
                                                    <input
                                                        type="text"
                                                        value={puesto}
                                                        onChange={(e) => setPuesto(e.target.value)}
                                                        className="form-control"
                                                        id='puesto'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Proyecto</label>
                                                    <input
                                                        type="text"
                                                        value={proyecto ? proyecto : ""}
                                                        onChange={(e) => setProyecto(e.target.value)}
                                                        className="form-control"
                                                        id='proyecto'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Centro de Costos</label>
                                                    <input
                                                        type="text"
                                                        value={centroCostos ? centroCostos : ""}
                                                        onChange={(e) => setCentroCostos(e.target.value)}
                                                        className="form-control"
                                                        id='centro-costos'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Persona que programó</label>
                                                    <input
                                                        type="text"
                                                        value={personaProgramo ? personaProgramo : ""}
                                                        onChange={(e) => setPersonaProgramo(e.target.value)}
                                                        className="form-control"
                                                        id='persona-programo'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Observaciones</label>
                                                    <textarea
                                                        type="text"
                                                        value={observacion ? observacion : ""}
                                                        onChange={(e) => setObservacion(e.target.value)}
                                                        className="form-control"
                                                        id='observacion'
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 ticket">
                                        <div className='container-ticket'>
                                            <div ref={componentRef} style={{width: '100%'}} className='text-center' >
                                                <br/>
                                                <h3 className='text-center'>Ticket de programación</h3>
                                                <center>
                                                    <table className='table-ticket'>
                                                        <tbody>
                                                            <tr>
                                                                <th className='title-column'>Fecha:</th>
                                                                <td>{fecha}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Documento:</th>
                                                                <td>{txtNumDoc ? txtNumDoc.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Proyecto:</th>
                                                                <td>{proyecto ? proyecto.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>CC:</th>
                                                                <td>{centroCostos ? centroCostos.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Área:</th>
                                                                <td>{area ? area.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Puesto:</th>
                                                                <td>{puesto ? puesto.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Perfil:</th>
                                                                <td>{perfil ? perfil.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>T. Examen:</th>
                                                                <td>{tipoExamen ? tipoExamen.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Empresa:</th>
                                                                <td>{empresa ? empresa.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Contrata:</th>
                                                                <td>{contrata ? contrata.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Programó:</th>
                                                                <td>{personaProgramo ? personaProgramo.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Observación:</th>
                                                                <td>{observacion ? observacion.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className='title-column'>Programado:</th>
                                                                <td>{programacionExcel === '' ? programacionExcel : (programacionExcel === 1 ? "SI (Mediweb)" : "NO (Manual)")}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </center>
                                                <br/>
                                            </div>
                                        </div>
                                        {found &&
                                        <div className="text-center">
                                            <button type="submit" onClick={handleProcess} className="btn btn-success btn-lg">Imprimir</button>
                                        </div>
                                        }
                                        {alertFormat2_2 &&
                                        <div className="text-center">
                                            <button type="submit" onClick={handleNew} className="btn btn-success btn-lg">Registrar e imprimir</button>
                                        </div>
                                        }
                                    </div>
                                </div>
                                </div>

                            </div>
                            <br/><br/>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchAppointment