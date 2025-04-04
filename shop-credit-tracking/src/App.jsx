import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Home from './components/Home';
import Customerhistry from './components/customerhistry';
import CustomerForm from './components/customerform';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />

        <Route path='/main' element={<MainPage />} />
        <Route path='/customerform' element={<CustomerForm />} />
        <Route path='/customerhistry' element{<Customerhistry/>}/>
    

         
      </Routes>
    </Router>
  );
}

export default App;