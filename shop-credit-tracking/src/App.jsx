import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './screen/calculator';
import Home from './screen/Home';
import CustomerForm from './screen/customerform';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
{/* <<<<<<< HEAD */}
        <Route path='/calculater' element={<Calculator />} />
        <Route path='/customerform' element={<CustomerForm />} />
{/* ======= */}
        <Route path='/calculator' element={<Calculator />} />
{/* >>>>>>> 5e6e0f2f8b3cc34a7dca5290c0ce48b987c12ff4 */}
         
      </Routes>
    </Router>
  );
}

export default App;