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
    let [id_subsidiaria, setIdSubsidiaria] = useState(0);

    let [programacionExcel, setProgramacionExcel] = useState('');
    let [today, setToday] = useState('');

    useEffect(() => {
        const fecha_today = new Date()
        setToday(formatearFecha(fecha_today))
    });

    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };

    console.log(jsonU.id_subsidiary)

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

    const SearchProgramming = async (document) => {
        const subsidiary = jsonU.subsidiary;
        const promise = new Promise( async (resolve) => { // SEARCH IN DDBB
            const result = await axios.get(API_URL_BASE+`appointments/get/nro_sub/${document}/${subsidiary}`, config);
            resolve(result.data);
            console.log(result.data)
        });
        promise.then( async (data_ddbb) => {
            if(data_ddbb.length > 0){
                //Mostrar programacion(es)
                setAappointments(data_ddbb)
                ChangeAlertSuccess(true)
                SetViewTable(true)
            }else{
                ChangeAlertSuccess(false)
                ChangeAlertFormat2_2(true)
                SetViewTable(false)
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

                const result = await axios.put(API_URL_BASE + `appointments/update/${idAppointment}`, {
                    date_programing: fecha_custom,
                    nro_documento: txtNumDoc.trim(),
                    last_name: apellidos.toUpperCase().trim(),
                    first_name: nombres.toUpperCase().trim(),
                    company: empresa.toUpperCase().trim(),
                    subcontract: contrata ? contrata.toUpperCase().trim() : "",
                    protocol: perfil.toUpperCase().trim(),
                    examen_type: tipoExamen.toUpperCase().trim(),
                    area: area ? area.toUpperCase().trim() : "",
                    job_position: puesto.toUpperCase().trim(),
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
        onAfterPrint: () => console.log('Print success')
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
        console.log('registrando')
        const result = await axios.post(API_URL_BASE + `appointments/store`, { // create
            date_programing: new Date(),
            nro_documento: txtNumDoc.trim(),
            last_name: apellidos.toUpperCase().trim(),
            first_name: nombres.toUpperCase().trim(),
            company: empresa.toUpperCase().trim(),
            subcontract: contrata.toUpperCase().trim(),
            protocol: perfil.toUpperCase().trim(),
            examen_type: tipoExamen.toUpperCase().trim(),
            area: area.toUpperCase().trim(),
            job_position: puesto.toUpperCase().trim(),
            in_excel_programing: 0,
            id_subsidiary: jsonU.id_subsidiary
        }, config)
        handlePrint()
        setFound(false)
        ChangeAlertFormat2_2(false)
    }

    const renderPatient = async (id_appointment) => {  
        const promise = new Promise( async (resolve) => { // SEARCH IN DDBB
            const result = await axios.get(API_URL_BASE+`appointments/get/id/${id_appointment}`, config);
            resolve(result.data[0]);
        });
        promise.then((d) => {
            console.log(d);
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
            setProgramacionExcel(d.in_excel_programing);
            setIdSubsidiaria(d.id_subsidiary)
            setFound(true)
            setStateDb(true)
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
                                    </div>

                                    <div className="col-md-4 ticket">
                                        <div className='container-ticket'>
                                            <div ref={componentRef} style={{width: '100%'}} className='text-center' >
                                                <br/>
                                                <h3 className='text-center'>Ticket de programación</h3>
                                                <center>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Fecha:</th>
                                                                <td>{fecha}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Documento:</th>
                                                                <td>{txtNumDoc.toUpperCase()}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>Paciente:</th>
                                                                <td>{apellidos.toUpperCase()} {nombres.toUpperCase()}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>Empresa:</th>
                                                                <td>{empresa.toUpperCase()}</td>
                                                            </tr>
                                                            <tr >
                                                                <th> Contrata:</th>
                                                                <td>{contrata ? contrata.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>Perfil:</th>
                                                                <td>{perfil.toUpperCase()}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>TipoExamen:</th>
                                                                <td>{tipoExamen.toUpperCase()}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>Área:</th>
                                                                <td>{area ? area.toUpperCase() : ""}</td>
                                                            </tr>
                                                            <tr >
                                                                <th>Puesto:</th>
                                                                <td>{puesto.toUpperCase()}</td>
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