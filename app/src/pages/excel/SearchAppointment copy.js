// import * as XLSX from 'xlsx'; //sheetjs.com

import React, { useState, useRef } from 'react'
import axios from 'axios'
import { API_URL_BASE } from './../../services/Api';
import logo from "./../../assets/images/pulso_salud_original.svg";
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';

const SearchAppointment2 = () => {

    const [items, setItems] = useState([]);

    const [stateDb, setStateDb] = useState(false);
    const [alertFormat, ChangeAlertFormat] = useState();
    const [alertFormat2, ChangeAlertFormat2] = useState();
    const [alertFormat2_1, ChangeAlertFormat2_1] = useState();
    const [alertFormat2_2, ChangeAlertFormat2_2] = useState();
    const [found, setFound] = useState(false);

    let [idAppointment, setIdAppointment]  = useState('');
    let [txtNumDoc, setTxtNumDoc] = useState('');

    let [fecha, setFecha] = useState('');
    let [apellidos, setApellidos] = useState('');
    let [nombres, setNombres] = useState('');
    let [empresa, setEmpresa] = useState('');
    let [contrata, setContrata] = useState('');
    let [perfil, setPerfil] = useState('');
    let [tipoExamen, setTipoExamen] = useState('');
    let [area, setArea] = useState('');
    let [puesto, setPuesto] = useState('');

    let [programacionExcel, setProgramacionExcel] = useState('');

    const componentRef = useRef();
    
    const readExcel = (file) => {
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
          if(d[0]['NUMERO DE DOCUMENTO']){ //valida si encuentra la columna "NUMERO DE DOCUMENTO" en la primera hoja del Excel
              setItems(d);
              ChangeAlertFormat(false);
          }else{
              ChangeAlertFormat(true);
              setItems([]);
          }
      })
    }

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

    // const sumarDias = (fecha, dias) => {
    //     const nuevaFecha = new Date(fecha);
    //     nuevaFecha.setDate(fecha.getDate() + dias);
    //     return nuevaFecha;
    // }

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
        const promise = new Promise( async (resolve) => { // SEARCH IN DDBB
            const result = await axios.get(API_URL_BASE+`appointments/get/${document}`);
            resolve(result.data[0]);
        });
        promise.then( async (data_ddbb) => {
            if(data_ddbb){ // RENDER DATA OF DDBB
                setIdAppointment(data_ddbb.id_appointment)
                setFecha(data_ddbb.date_programing);
                setApellidos(data_ddbb.last_name);
                setNombres(data_ddbb.first_name);
                setEmpresa(data_ddbb.company);
                setContrata (data_ddbb.subcontract);
                setPerfil(data_ddbb.protocol);
                setTipoExamen(data_ddbb.examen_type);
                setArea(data_ddbb.area);
                setPuesto(data_ddbb.job_position);
                setProgramacionExcel(data_ddbb.in_excel_programing);
                setFound(true)
                setStateDb(true)
            }else{ // SEARCH IN EXCEL
                const promise2 = new Promise( async (resolve2) => {
                    items.map((item) => {
                        if(String(item['NUMERO DE DOCUMENTO']) === document){
                            resolve2(item)
                        }
                    });
                    resolve2(0)
                })
                promise2.then( async (data_excel) => {
                    if(data_excel){
                        // En caso traiga los dias desde 1900
                        // const fechaOriginal = new Date("01/01/1900"); // Fecha más antigua en excel
                        // const dias_reales = data_excel.Fecha - 2; // se resta 2 dias por calculo errado de excel
                        // const diasASumar = dias_reales;
                        // const nuevaFecha = sumarDias(fechaOriginal, diasASumar);

                        const fecha_excel = String(data_excel['FECHA DE PROGRAMACION'])
                        const fecha_split = fecha_excel.split("-", 3)
                        const fecha_custom = fecha_split[1] + "/" + fecha_split[0] + "/" +fecha_split[2]
                        const fecha_format = new Date(fecha_custom)
                        const fecha = formatearFecha(fecha_format)
            
                        setFecha(fecha);
                        setApellidos(data_excel['APELLIDOS'] ? data_excel['APELLIDOS'].trim() : '');
                        setNombres(data_excel['NOMBRES'] ? data_excel['NOMBRES'].trim() : '');
                        setEmpresa(data_excel['EMPRESA'] ? data_excel['EMPRESA'].trim() : '');
                        setContrata(data_excel['SUBCONTRATA'] ? data_excel['SUBCONTRATA'].trim() : '');
                        setPerfil(data_excel['PERFIL'] ? data_excel['PERFIL'].trim() : '');
                        setTipoExamen(data_excel['TIPO DE EXAMEN'] ? data_excel['TIPO DE EXAMEN'].trim() : '');
                        setArea(data_excel['AREA'] ? data_excel['AREA'].trim() : '');
                        setPuesto(data_excel['PUESTO'] ? data_excel['PUESTO'].trim() : '');
                        ChangeAlertFormat2_2(false)
                        setFound(true)
                        setStateDb(false)
                    }else if(data_excel == 0){
                        setFound(false)
                        ChangeAlertFormat2_2(true)
                    }
                })
            }
        }) 
    }

    const handleClick = () => {
      resetForm();
      ChangeAlertFormat2_1(false)
      ChangeAlertFormat2_2(false)
      if(items.length === 0){
        ChangeAlertFormat2(true)
      }else{
        ChangeAlertFormat2(false)
        if(txtNumDoc.trim() === ''){
            ChangeAlertFormat2_1(true)
        }else{
            SearchProgramming(txtNumDoc.trim())
        }
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
                const result = await axios.put(API_URL_BASE + `appointments/update/${idAppointment}`, {
                    nro_documento: txtNumDoc.trim(),
                    last_name: apellidos.toUpperCase().trim(),
                    first_name: nombres.toUpperCase().trim(),
                    company: empresa.toUpperCase().trim(),
                    subcontract: contrata.toUpperCase().trim(),
                    protocol: perfil.toUpperCase().trim(),
                    examen_type: tipoExamen.toUpperCase().trim(),
                    area: area.toUpperCase().trim(),
                    job_position: puesto.toUpperCase().trim(),
                    in_excel_programing: state_programing
                })
                handlePrint()
                setFound(false)
            }else{ // if found in excel day  
                const result = await axios.post(API_URL_BASE + `appointments/store`, { // create
                    nro_documento: txtNumDoc.trim(),
                    last_name: apellidos.toUpperCase().trim(),
                    first_name: nombres.toUpperCase().trim(),
                    company: empresa.toUpperCase().trim(),
                    subcontract: contrata.toUpperCase().trim(),
                    protocol: perfil.toUpperCase().trim(),
                    examen_type: tipoExamen.toUpperCase().trim(),
                    area: area.toUpperCase().trim(),
                    job_position: puesto.toUpperCase().trim(),
                    in_excel_programing: 1
                })
                handlePrint()
                setFound(false)
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
        resetForm();
    }

    const handleNew = async () => {  
        const result = await axios.post(API_URL_BASE + `appointments/store`, { // create
            nro_documento: txtNumDoc.trim(),
            last_name: apellidos.toUpperCase().trim(),
            first_name: nombres.toUpperCase().trim(),
            company: empresa.toUpperCase().trim(),
            subcontract: contrata.toUpperCase().trim(),
            protocol: perfil.toUpperCase().trim(),
            examen_type: tipoExamen.toUpperCase().trim(),
            area: area.toUpperCase().trim(),
            job_position: puesto.toUpperCase().trim(),
            in_excel_programing: 0
        })
        handlePrint()
        setFound(false)
        ChangeAlertFormat2_2(false)
    }

    return (
        <div className='body'>
            <div className="container-custom">
                <div className="row app">

                    <div className="text-center">
                        <img src={logo} className="logo" alt="" />
                    </div>

                    <h2 className="title text-center">Busqueda de Programaciones Diarias</h2>

                    <div className="col-md-7">
                        
                        
                        <div className='mb-3'>
                            <h6><span className='btn btn-warning bold'>1 </span> Cargue excel de programaciones</h6>
                            <input 
                                type='file'
                                className='form-control'
                                id='file'
                                onChange={(e)=>{
                                    const file=e.target.files[0];
                                    if(file){
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

                        <div className="row">
                            <div className="form-group">
                                <h6><span className='btn btn-warning bold'>2 </span> Digite el número de documento</h6>
                                <div className='paso2'>
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
                                    {alertFormat2 && 
                                        <div className='error'> Complete el primer paso</div>
                                    }
                                    {alertFormat2_1 && 
                                        <div className='error'> Digite número de documento</div>
                                    }
                                    {alertFormat2_2 && 
                                        <div className='error'> No se encuentra programación</div>
                                    }
                                </div>
                            </div>

                            <br/><br/><br/><br/><br/>
                            
                            <h6><span className='btn btn-warning bold'>3 </span> Verifique e imprima los datos</h6>

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
                                            value={contrata}
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
                                            value={area}
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
                        
                        <br/><br/>
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
                                                <td>{contrata.toUpperCase()}</td>
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
                                                <td>{area.toUpperCase()}</td>
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
                        
                        <br/><br/>
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
    );
};

export default SearchAppointment2;