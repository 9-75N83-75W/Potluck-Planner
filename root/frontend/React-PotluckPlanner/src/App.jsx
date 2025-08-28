import { BrowserRouter, Routes, Route} from 'react-router-dom';

//import './App.css'
import './index.css'
import LandingPage from './pages/LandingPage'
import CreateUser from './pages/CreateUser';
import SignIn from './pages/SignIn';
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"
import Event from './pages/Event';
import SetupProfile from './pages/SetupProfile';


function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/CreateAccount' element={<CreateUser/>}/>
      <Route path='/SignIn' element={<SignIn/>}/>
      <Route path='/Dashboard' element={<Dashboard/>}/>
      <Route path='/SetupProfile' element={<SetupProfile/>}/>
      <Route path='/Settings' element={<Settings/>}/>
      <Route path="/Event/:id" element={<Event/>} />


    </Routes>
    </BrowserRouter>

  )
}

export default App
