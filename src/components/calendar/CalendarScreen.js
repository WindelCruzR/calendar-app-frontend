import React, {useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { NavBar } from '../ui/NavBar';
import { messages } from '../../helpers/calendar-messages-es';

import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive } from '../../actions/event';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';



moment.locale('es');

const localizer = momentLocalizer(moment) // or globalizeLocalizer



export const CalendarScreen = () => {

  const dispatch = useDispatch();
  const {events} = useSelector(state => state.calendar);
  const {activeEvent} = useSelector(state => state.calendar);

  // useState para manejar el estado de la seccion donde te encuentras (mes, dia, semana, agenda)
  //El valor inicial del state es la ultima vista de la app y si no hay ultima vista, se mostrará por defecto la vida de mes
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

  const onDoubleClick = (e) =>{
      console.log('Abrir modal');
      dispatch(uiOpenModal());
  }

  const onSelect = (e) =>{

    dispatch(eventSetActive(e));
    console.log('Un click');
}

const onSelectedSlot = (e) => {
  console.log(e);
  dispatch(eventClearActiveEvent());
}

//leerá el evento y sea cual sea el seleccionado cambiará la vista del calendario
const onViewChange = (e) =>{
  setLastView(e);
  localStorage.setItem('lastView',e);
}

  // Función que se dispara con un evente, un inicio, un final y un isSlected
  const eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event, start, end, isSelected);

    const style = {
      backgroundColor: '#367CF7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }

    return{
      style
    }

  };


  return (
      <div className='calendar-screen'>
        <NavBar/>

        <Calendar
          localizer={ localizer }
          events={ events }
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          onDoubleClickEvent = {onDoubleClick}
          onSelectEvent={onSelect}
          onView={onViewChange}
          onSelectSlot = {onSelectedSlot}
          selectable = {true}
          view={ lastView }
          eventPropGetter = {eventStyleGetter}
          components = {{
            event: CalendarEvent
          }}
        />

        <AddNewFab/>

        {
          (activeEvent) && <DeleteEventFab/>
        }
        <CalendarModal/>
    </div>
  )
}
