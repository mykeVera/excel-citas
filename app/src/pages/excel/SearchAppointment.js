// import * as XLSX from 'xlsx'; //sheetjs.com

import React, { useState, useRef } from 'react'
import logo from "./../../assets/images/pulso_salud_original.svg";
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';

const SearchAppointment = () => {

    const [items, setItems] = useState([]);

    const [alertFormat, ChangeAlertFormat] = useState();
    let [txtNumDoc, setTxtNumDoc] = useState('');

    let [fecha, setFecha] = useState('');
    let [paciente, setPaciente] = useState('');
    let [empresa, setEmpresa] = useState('');
    let [contrata, setContrata] = useState('');
    let [perfil, setPerfil] = useState('');
    let [tipoExamen, setTipoExamen] = useState('');
    let [area, setArea] = useState('');
    let [puesto, setPuesto] = useState('');
    let [formaPago, setFormaPago] = useState('');

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
          if(d[0].DNI){ //valida si encuentra la columna "DNI" en la primera hoja del Excel
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
        setPaciente("");
        setEmpresa("");
        setContrata ("");
        setPerfil("");
        setTipoExamen("");
        setArea("");
        setPuesto("");
        setFormaPago("");
    }

    const sumarDias = (fecha, dias) => {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(fecha.getDate() + dias);
        return nuevaFecha;
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

    const handleClick = () => {
      resetForm();
      items.map((item) => {
        if(String(item.DNI) === txtNumDoc){


            const fechaOriginal = new Date("01/01/1900"); // Fecha más antigua en excel

            const dias_reales = item.Fecha - 2; // se resta 2 dias por calculo errado de excel
            const diasASumar = dias_reales;
            const nuevaFecha = sumarDias(fechaOriginal, diasASumar);

            const fecha = formatearFecha(nuevaFecha)

            //02157120 - 10/02/2020

            setFecha(fecha);
            setPaciente(item.DescripcionPaciente);
            setEmpresa(item.Empresa);
            setContrata (item.SubContrata);
            setPerfil(item.Perfil);
            setTipoExamen(item.TipoExamen);
            setArea(item.Area);
            setPuesto(item.Puesto);
            setFormaPago(item.FormaPago);
        }
        return 0;
      });
    }

    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Ticket',
        onAfterPrint: () => console.log('Print success')
    });

    return (
        <div className='body'>
            <div className="container-custom">
                <div className="row app">

                    <div className="text-center">
                        <img src={logo} className="logo" alt="" />
                    </div>

                    <h2 className="title text-center">Busqueda de Pacientes en Excel</h2>

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
                                        onChange={(e) => setTxtNumDoc(e.target.value)}
                                        id='numeroDocumento'
                                        className="form-control"
                                        placeholder=""
                                        autoComplete="off"
                                    />
                                    <button type="button" onClick={handleClick} className="btn btn-danger">Buscar</button>
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
                                <div className="col-md-8">
                                    <div className="form-group">
                                        <label>Paciente</label>
                                        <input
                                            type="text"
                                            value={paciente}
                                            onChange={(e) => setPaciente(e.target.value)}
                                            className="form-control"
                                            id='paciente'
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
                                <div className="col-md-4">
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
                                <div className="col-md-4">
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
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Forma de Pago</label>
                                        <input
                                            type="text"
                                            value={formaPago}
                                            onChange={(e) => setFormaPago(e.target.value)}
                                            className="form-control"
                                            id='formaPago'
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
                                                <td>{paciente.toUpperCase()}</td>
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
                                            <tr >
                                                <th>Forma Pago:</th>
                                                <td>{formaPago.toUpperCase()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </center>
                                <br/>
                            </div>
                        </div>
                        
                        <br/><br/>

                        <div className="text-center">
                            <button type="submit" onClick={handlePrint} className="btn btn-success btn-lg">Imprimir</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default SearchAppointment;