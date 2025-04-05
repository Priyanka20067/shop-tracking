import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Home from './components/Home';
import CustomerForm from './components/customerform';
import Signup from './components/signup';
import CustomerHistory from './components/customerHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/customer-form' element={<CustomerForm />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/customer-history' element={<CustomerHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
