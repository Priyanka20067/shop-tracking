import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './screen/calculator';
import Home from './screen/Home';
import CustomerForm from './screen/customerform';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/calculater' element={<Calculator />} />
        <Route path='/customerform' element={<CustomerForm />} />
         
      </Routes>
    </Router>
  );
}

export default App;