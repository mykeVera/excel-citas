import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark, faSpinner, faDownload, faCheck } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from '../../services/Api';
import GetCookie from '../../hooks/getCookie';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Authenticated from '../../hooks/authenticated';

const ImportAppointment = () => {
    Authenticated();
    const navigate = useNavigate();
    const [appointments, setAappointments] = useState([]);

    const [items, setItems] = useState([]);
    // const [itemsValidated, setItemsValidated] = useState([]);
    const [id_template, setIdTemplate] = useState();
    const [content, setContent] = useState('');
    const [content2, setContent2] = useState('');
    const [counter, setCounter] = useState(0);

    const [alertFormat, ChangeAlertFormat] = useState();
    const [alertTemplate, ChangeAlertTemplate] = useState();
    const [buttonImport, setButtonImport] = useState(false);
    const [alertImport, setAlertImport] = useState(false);
    const [alertConfirm, ChangeConfirm] = useState(false);
    const [pre, setPre] = useState();

    const [lasPat, setLasPat] = useState('PEREZ');
    const [lasMat, setLasMat] = useState('MENGANO');
    const [names, setNames] = useState('JUAN');
    
    const getU = GetCookie('_userIn_');
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
            Authorization: `Bearer `+jsonU.token
        }
    };

    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    }

    const formatDate = (date) => {
        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    const formatDate2 = (date) => {
        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-')
        );
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

    const readExcel= (file) => {
        setItems([]);
        const promise = new Promise((resolve,reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray,{type:'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = ((error) => {
                reject(error);
                ChangeAlertFormat(true);
                setItems([]);
            });
        });
        promise.then((d) => {
            if(d[0]['NUMERO DE DOCUMENTO']){ //validar todas las columnas
                const arregloSinDuplicados = d.filter ((objeto, index, self) => // RETIRAMOS DUPLICADOS
                    index === self.findIndex((o) => 
                        o['FECHA DE PROGRAMACION'] === objeto['FECHA DE PROGRAMACION'] &&
                        o['LOCAL'] === objeto['LOCAL'] &&
                        o['EMPRESA'] === objeto['EMPRESA'] &&
                        o['SUBCONTRATA'] === objeto['SUBCONTRATA'] &&
                        o['PERFIL'] === objeto['PERFIL'] &&
                        o['TIPO DE EXAMEN'] === objeto['TIPO DE EXAMEN'] &&
                        o['AREA'] === objeto['AREA'] &&
                        o['PUESTO'] === objeto['PUESTO'] &&
                        o['NUMERO DE DOCUMENTO'] === objeto['NUMERO DE DOCUMENTO'] &&
                        o['APELLIDOS'] === objeto['APELLIDOS'] &&
                        o['NOMBRES'] === objeto['NOMBRES'] &&
                        o['OBSERVACION'] === objeto['OBSERVACION']
                    )
                );
                setItems(arregloSinDuplicados);

                ChangeAlertFormat(false);
                setButtonImport(true)
            }else{
                console.log(2)
                ChangeAlertFormat(true);
                setButtonImport(false)
                setItems([]);
            }
        })
    }

    const uploadAppointment = async (e) => {
        if(alertFormat === false){ // registrar
            setButtonImport(false)
            setAlertImport(true)
            let cont = 0;
            console.log("Importando Citas...")
            const today = new Date()
            const fecha_formateada = formatDate2(today)

            // VERIFICAR SI YA EXISTE UNA CITA DE ESA CITA CON ESA FECHA EN ESPECIFICO

            // 70251915 - 46199257 - 75395933 - 48453504
            for await(let it of items){
                let document = it['NUMERO DE DOCUMENTO'];
                // let document = '48453504';
                const promise = new Promise( async (resolve) => { // CONSULTAR NRO DE DOCUMENTO EN LA DDBB
                    const result_ddbb = await axios.get(API_URL_BASE+`appointments/get/nro/all/${document}`, config);
                    resolve(result_ddbb.data);
                });
                promise.then(async (patient_ddbb) => {
                    // console.log(patient_ddbb)
                    cont++;
                    setCounter(cont)
                    if(patient_ddbb.length === 0){ // SI NO SE ENCUENTRA REGISTROS
                        console.log("PACIENTE NUEVO")
                        const promise = new Promise( async (resolve) => { // ENCONTRAR EL ID DE LA SEDE
                            const result_subsidiary = await axios.get(API_URL_BASE+`subsidiaries/get/${it['LOCAL']}`, config);
                            resolve(result_subsidiary.data[0]);
                        });
                        promise.then( async (data_appointmen) => {
                            // cont++;
                            // setCounter(cont)

                            const fecha_excel = String(it['FECHA DE PROGRAMACION'])
                            const fecha_split = fecha_excel.split("-", 3)
                            const fecha_custom = fecha_split[1] + "/" + fecha_split[0] + "/" +fecha_split[2]
                            const fecha_format = formatDate2(new Date(fecha_custom))

                            const result = await axios.post(API_URL_BASE + `appointments/store`, { // CREATE
                                date_programing: fecha_format,
                                nro_documento: it['NUMERO DE DOCUMENTO'],
                                last_name: it['APELLIDOS'],
                                first_name: it['NOMBRES'],
                                company: it['EMPRESA'],
                                subcontract: it['SUBCONTRATA'],
                                protocol: it['PERFIL'],
                                examen_type: it['TIPO DE EXAMEN'],
                                area: it['AREA'],
                                job_position: it['PUESTO'],
                                project: null,
                                cost_center: null,
                                person_programmed: null,
                                observation: it['OBSERVACION'],
                                in_excel_programing: 1,
                                id_subsidiary: data_appointmen.id_subsidiary
                            }, config)
                        })
                    }else{ // SI ES DE 1 A MAS REGISTROS
                        console.log("PACIENTE ENCONTRADO UNA O MAS DE UNA VEZ")
                        for await(let db of patient_ddbb){
                            if(String(db.nro_documento) === String(it['NUMERO DE DOCUMENTO'])){
                                const fecha_excel = String(it['FECHA DE PROGRAMACION'])
                                const fecha_split = fecha_excel.split("-", 3)
                                const fecha_excel_format = fecha_split[0] + "/" + fecha_split[1] + "/" +fecha_split[2]

                                console.log(db.nro_documento)
                                // verificarmos si en el excel no existen datos y le asignamos null para comparar
                                const excel_last_name = it['APELLIDOS'] ? it['APELLIDOS'] : null;
                                const excel_first_name = it['NOMBRES'] ? it['NOMBRES'] : null;
                                const excel_company = it['EMPRESA'] ? it['EMPRESA'] : null;
                                const excel_subcontract = it['SUBCONTRATA'] ? it['SUBCONTRATA'] : null;
                                const excel_protocol = it['PERFIL'] ? it['PERFIL'] : null;
                                const excel_examen_type = it['TIPO DE EXAMEN'] ? it['TIPO DE EXAMEN'] : null;
                                const excel_area = it['AREA'] ? it['AREA'] : null;
                                const excel_job_position = it['PUESTO'] ? it['PUESTO'] : null;
                                const excel_observation = it['OBSERVACION'] ? it['OBSERVACION'] : null;

                                if(
                                    db.date_programing === fecha_excel_format &&
                                    db.last_name === excel_last_name &&
                                    db.first_name === excel_first_name &&
                                    db.company === excel_company &&
                                    db.subcontract === excel_subcontract &&
                                    db.protocol === excel_protocol &&
                                    db.examen_type === excel_examen_type &&
                                    db.area === excel_area &&
                                    db.job_position === excel_job_position &&
                                    // db.project === it[''] &&
                                    // db.cost_center === it[''] &&
                                    // db.person_programmed === it[''] &&
                                    db.observation === excel_observation &&
                                    db.subsidiary === it['LOCAL']
                                ){
                                    console.log('IF')
                                    // ACTUALIZAR
                                    if(!db.ticket_generate){ // SIEMPRE Y CUANDO NO ESTA EMITIDO, SE ACTUALIZA
                                        console.log('no generado')

                                        const fecha_ddbb = db.date_programing
                                        const fecha_split = fecha_ddbb.split("/", 3)
                                        const fecha_ddbb_format = fecha_split[2] + "-" + fecha_split[1] + "-" +fecha_split[0]

                                        await axios.put(API_URL_BASE + `appointments/update/${db.id_appointment}`, {
                                            date_programing: fecha_ddbb_format,
                                            nro_documento: db.nro_documento,
                                            last_name: db.last_name,
                                            first_name: db.first_name,
                                            company: db.company,
                                            subcontract: db.subcontract,
                                            protocol: db.protocol,
                                            examen_type: db.examen_type,
                                            area: db.area,
                                            job_position: db.job_position,
                                            project: db.project,
                                            cost_center: db.cost_center,
                                            person_programmed: db.person_programmed,
                                            observation: db.observation,
                                            ticket_time_init: db.ticket_time_init,
                                            ticket_time_finish: db.ticket_time_finish,
                                            ticket_generate: db.ticket_generate,
                                            in_excel_programing: db.in_excel_programing,
                                            id_subsidiary: db.id_subsidiary
                                        }, config)
                                    }
                                }else{
                                    console.log('ELSE')
                                    // GRABAR

                                }
                            }
                        }
                    }
                    if(cont === items.length){
                        ChangeConfirm(true)
                        setTimeout(() => {
                            // navigate('/main/appointment/search');
                            console.log('*** FIN ***')
                        }, 3000);
                    }
                });

            }



            // const promise = new Promise( async (resolve) => { // DELETE ITEMS
            //     console.log(config)
            //     const result_softdelete = await axios.put(API_URL_BASE+`appointments/delete/${fecha_formateada}`);
            //     resolve(result_softdelete.data);
            // });
            // promise.then( async (data_confirmed) => { // INSERT ITEMS
            //     if(data_confirmed){
            //         for await(let it of items) { //INSERT ITEMS
            //             
            //         }
            //     }
                
            // })
        }
    }

    return (
        <div className={"custom_container"}>
            <div className="card card-padding">
                <div className="row page-titles">
                    <div className="col-md-5" >
                        <h3 className="text-themecolor">Cargar Programaciones</h3>
                    </div>
                    <div className="col-md-7">
                        <ol className="breadcrumb right">
                            <li className="breadcrumb-item"><Link to={'/main'}><i className=""></i> Tablero</Link></li>
                            <li className="breadcrumb-item active">Cargar Programaciones</li>
                        </ol>
                    </div>
                </div>
            </div>    
            
            <br/>
            
            <div className={"row"}>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className='mb-3'>
                                <h6><span className='btn btn-warning bold'>1 </span> Descargue el archivo excel de citas de Mediweb (Todas las sedes)</h6>
                            </div>
                            <br/>
                            <div className='mb-3'>
                                <h6><span className='btn btn-warning bold'>2 </span> Importe el archivo Excel</h6>
                                <input 
                                    type='file'
                                    className='form-control'
                                    id='id_xlsx'
                                    name='id_xlsx'
                                    onChange={(e)=>{
                                        const file=e.target.files[0];
                                        if(file){
                                            setButtonImport(true)
                                            if((file.name).includes('.xlsx')){
                                                readExcel(file)
                                            }else{
                                                ChangeAlertFormat(true)
                                                setItems([])
                                            }
                                            
                                        }else{
                                            ChangeAlertFormat(true)
                                            setItems([])
                                        }
                                    }}
                                />
                                {alertFormat && 
                                <div className='error'>Seleccione un directorio valido</div>
                                }
                            </div>
                            <br/>
                            
                            {buttonImport && 
                            <div>
                                <hr/>
                                <button onClick={uploadAppointment} type="submit" className="btn btn-success"><FontAwesomeIcon icon={faFloppyDisk} /> Cargar</button>
                                <br/><br/>
                            </div>
                            }
                            {alertImport && 
                            <div className={'row'}>
                                <div className='col-sm-12'>
                                    <div className="alert alert-info" role="alert">
                                        <h5>
                                            <FontAwesomeIcon icon={faSpinner} />  Registrando Programaciones...  {counter}/{items.length}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            }
                            {alertConfirm &&
                            <div className={'row'}>
                                <div className='col-sm-12'>
                                    <div className="alert alert-success" role="alert">
                                        <FontAwesomeIcon icon={faCheck} /> Programaciones registradas.
                                    </div>
                                </div>
                            </div>
                            }
                            <hr/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportAppointment