import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleInfo, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { API_URL_BASE } from "../../services/Api";
import * as XLSX from "xlsx";
import GetCookie from "../../hooks/getCookie";
import Authenticated from "../../hooks/authenticated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';


const ReportAppointments = () => {

    Authenticated();
    const [appointments, setAppointments] = useState([]);
    const [viewButton , setviewButton] = useState(true);
    const [ViewSearch, setViewSearch] = useState(false);
    const [ViewMessageError, setViewMessageError] = useState(false);
    const [ViewMessageValidate, setViewMessageValidate] = useState(false);

    const getU = GetCookie("_userIn_");
    const jsonU = JSON.parse(getU);
    const config = {
        headers: {
          Authorization: `Bearer ` + jsonU.token,
        },
    }; 

    const [valueSelectUser, SetValueSelectUser] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());

    const searchAppointmentByRangeDate = async (e) => {
      e.preventDefault();
      setViewMessageError(false)
      setViewSearch(true)
      setAppointments([])
      const promise = new Promise( async (resolve) => { //
        const date1 = moment(startDate).format('yyyy-MM-DD');
        const date2 = moment(startDate2).format('yyyy-MM-DD');
        const response = await axios.get(API_URL_BASE + `appointments` + "/get/range/" + date1 + "/" + date2, config);
        
        resolve(response);
      });
      promise.then( async (r) => {
        const data = r.data
        if(data){
          setViewMessageError(false)
          
          let tabla = [{
            A: "FECHA DE PROGRAMACIÓN",
            B: "NRO. DOCUMENTO",
            C: "APELLIDOS",
            D: "NOMBRES",
            E: "EMPRESA",
            F: "CONTRATA",
            G: "PROTOCOLO",
            H: "TIPO DE EXAMEN",
            I: "AREA",
            J: "PUESTO",
            K: "PROGRAMADO EN MW",
            L: "SEDE"
          }];
          data.map((a) => {
            let in_excel = ''
            if(a.in_excel_programing === 1){
              in_excel = "SI"
            }else{
              in_excel = "NO"
            }
            tabla.push({
              A: a.date_programing,
              B: a.nro_documento,
              C: a.last_name,
              D: a.first_name,
              E: a.company,
              F: a.subcontract,
              G: a.protocol,
              H: a.examen_type,
              I: a.area,
              J: a.job_position,
              K: in_excel,
              L: a.subsidiary
            });
          });
          const datafinal = [...tabla];
          console.log(datafinal)
          setTimeout (() => {
            const libro = XLSX.utils.book_new();
            const hoja = XLSX.utils.json_to_sheet(datafinal, {skipHeader: true});
            const longitudes = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
            let propiedades = [];
            longitudes.map((col) => {
              propiedades.push({
                width: col,
              })
            })
            hoja["!cols"] = propiedades
            const today = moment().format('DD.MM.yyyy')
            XLSX.utils.book_append_sheet(libro, hoja, "Reporte de Citas");
            XLSX.writeFile(libro, `Citas - ${today}.xlsx`);
            setViewSearch(false)
          }, 1000);
        }else{
          setViewMessageError(true)
          setViewSearch(false)
          setTimeout (() => {
            setViewMessageError(false)
          }, 2000);
        }
      })
    }

    return (
        <div className={"custom_container"}>
          <div className="card card-padding">
            <div className="row page-titles">
              <div className="col-md-5">
                <h3 className="text-themecolor">Reporte de Citas</h3>
              </div>
              <div className="col-md-7">
                <ol className="breadcrumb right">
                  <li className="breadcrumb-item">
                    <Link to={"/main"}>
                      <i className=""></i> Tablero
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Reporte de Citas</li>
                </ol>
              </div>
            </div>
          </div>

          <br />

          <div className={"row"}>
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-4">
                      <label htmlFor='phone' className='form-label'> Fecha Inicio </label>
                      <div></div>
                      <DatePicker
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>

                    <div className="col-4">
                      <label htmlFor='phone' className='form-label'> Fecha Fin </label>
                      <div></div>
                      <DatePicker
                        style="margin-left: 200px"
                        className="form-control"
                        selected={startDate2}
                        onChange={(date) => setStartDate2(date)}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>

                  <br />
                    
                  <div className="row">
                    <div>
                      <br/>
                      {viewButton &&
                      <button type="submit" className="btn btn-success" onClick={searchAppointmentByRangeDate}><FontAwesomeIcon icon={faFileExcel} /> Descargar Reporte</button>
                      }
                      <br/><br/><br/><br /><br />
                    </div>
                  </div>
                  
                </form>
                </div>
              </div>
            </div>
          </div>

          <br />

          {ViewSearch && 
          <div className={'row'}>
              <div className='col-sm-12'>
                  <div className="alert alert-info" role="alert">
                      <h5>
                          <FontAwesomeIcon icon={faSpinner} />  Cargando...
                      </h5>
                  </div>
              </div>
          </div>
          }

          {ViewMessageError && 
          <div className={'row'}>
              <div className='col-sm-12'>
                  <div className="alert alert-danger" role="alert">
                      <h5>
                          <FontAwesomeIcon icon={faCircleInfo} />  No se encontraron envios.
                      </h5>
                  </div>
              </div>
          </div>
          }

        </div>
    )
}

export default ReportAppointments