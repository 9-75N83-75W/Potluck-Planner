import { BrowserRouter, Routes, Route} from 'react-router-dom';

//import './App.css'
import './index.css'
import LandingPage from './pages/LandingPage'
import CreateUser from './pages/CreateUser';
import SignIn from './pages/SignIn';
import Dashboard from "./pages/Dashboard"
import UserProfile from "./pages/UserProfile"
import Event from './pages/Event';


function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path='/CreateAccount' element={<CreateUser/>}/>
      <Route path='/SignIn' element={<SignIn/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/Preferences" element={<UserProfile/>}/>
      <Route path="/Event" element={<Event/>}/>


    </Routes>
    </BrowserRouter>

  )
}

export default App
