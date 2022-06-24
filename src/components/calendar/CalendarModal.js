import React, { useEffect, useState } from 'react'
import Modal from 'react-modal/lib/components/Modal';

import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/event';


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

//Las fechas que tendrá por defecto el modal
const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowplus1 = now.clone().add(1, 'hours');

// Para inicializar los labels del modal
const initEvent={
    
        title:'',
        notes:'',
        start: now.toDate(),
        end: nowplus1.toDate()
}
 
// funcion que contendra todo loq del componente modal
export const CalendarModal = () => {

    // selectores para extraer variables que seran utilizadas para manejar estados 
    const {modalOpen} = useSelector(state => state.ui);
    const {activeEvent} = useSelector(state => state.calendar);
    const dispatch = useDispatch();

    //Manejadores del estado de ambos datepickers
    const [dateStart, setDateStart] = useState(now.toDate()); // ambos reciben una fecha tipo moment, para ser cambiadas mediante
    const [dateEnd, setDateEnd] = useState(nowplus1.toDate());// un evento en la funcion handleStartDateChange o handleEndDateChange
    //El valor actualizado se guarda en dateStart o dateEnd

    const [titleValid, setTitleValid] = useState(true);

    //El estado inicial de la informacion del Modal
    const [formValues, setFormValues] = useState(initEvent);

    //Destructuring de la info del Modal para manipularse
    const {title, notes, start, end} = formValues;

    //Para manejar estados con el formlario
    useEffect(() => {
        if(activeEvent){
            setFormValues(activeEvent)
        }else{
            setFormValues(initEvent)
        }
    }, [activeEvent, setFormValues])
    
    // Para manejar el estado tanto de las notas o del titulo y es llamado en el
    // onChange de cada label
    const handleInputChange = ({target}) => {

        setFormValues({
            ...formValues,
            [target.name]: target.value
        })

    }
    
    const closeModal =() =>{
        // TODO: Cerrar Modal
        console.log('Cerrar Modal')
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
        setFormValues(initEvent);
    }

    const handleStartDateChange = (e) => {
        setDateStart(e);
        console.log(e);
        setFormValues({
            ...formValues,
            start:e
        })
    }

    // En este punto, se cambia el estado de la fecha, reciebiendo 
    // como parametro el evento y ahí mismo modificas el formvalue, con el valor del
    // Evento recibido 
    const handleEndDateChange = (e) =>{
        setDateEnd(e);
        console.log(e);
        setFormValues({
            ...formValues,
            end:e
        })
    }

    const handleSubmitForm = (e) =>{

        //evita propagacion del formulario
        e.preventDefault();
       

        const momentStart = moment(start);
        const momentEnd = moment(end);

        console.log(momentStart);
        console.log(momentEnd);

        if (momentStart.isSameOrAfter(momentEnd)){
            Swal.fire('Error','La fecha fin debe ser mayor a la fecha de inicio', 'error');
            return;
        }

        if(title.trim() < 2){
            setTitleValid(false);
            return;
        }

        if(activeEvent){
            dispatch(eventUpdated(formValues))
        }else{
                dispatch( eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Fernando'
                }
            }) );
        }

        //TODO: Realizar grabación
        // console.log(formValues);
        

        console.log(formValues);

        setTitleValid(true);
        closeModal();

    }

  return (

    <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS = {200}
        className="modal"
        overlayClassName = "modal-fondo"
      >

            <h1> {(activeEvent) ? 'Editar evento' : 'Nevo evento'} </h1>
            <hr />
            <form
                className="container"
                onSubmit={handleSubmitForm}                
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    {/* Se llama al componente que permitira esocger las fechas y con el a sus propiedades */}
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className='form-control'
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className='form-control'
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span>Guardar</span>
                </button>

            </form>

    </Modal>
  )
}
