
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Base from './components/Base';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AddTheater from './Pages/AddTheater'
import AddMovie from './Pages/AddMovie'
import ForgotPassword from './Pages/ForgotPassword'
import SeatBooking from './Pages/SeatBooking';
import BookedTickets from './Pages/BookedTickets';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
   <BrowserRouter>
   <ToastContainer position="top-center" />
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/forgotPass" element={<ForgotPassword />} />
     <Route path="/addTheater" element={<AddTheater />} />
     <Route path="/addMovie" element={<AddMovie />} />
     <Route path="/seatBooking" element={<SeatBooking />} />
     <Route path="/bookedTickets" element={<BookedTickets />} />


   </Routes>
   </BrowserRouter>
   
  );
}

export default App;
