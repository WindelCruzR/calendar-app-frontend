import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';

export const AppRouter = () => {
  return (
    <BrowserRouter>

        
        <Routes>
            <Route path='/login' element={<LoginScreen/>} />

            <Route path='/calendar' element={<CalendarScreen/>} />
            {/* // <Route/> */}
        </Routes>
    </BrowserRouter>
  )
}
