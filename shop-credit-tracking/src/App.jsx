import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Home from './components/Home';
import CustomerForm from './components/customerform';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
<<<<<<< HEAD

        <Route path='/calculater' element={<Calculator />} />
        <Route path='/customerform' element={<CustomerForm />} />
        <Route path='/calculator' element={<Calculator />} />
=======
{/* <<<<<<< HEAD */}
        <Route path='/mainpage' element={<MainPage />} />
        <Route path='/customerform' element={<CustomerForm />} />
>>>>>>> 43a31ca9c2eb17da1a2b2098ec2e69102b2b0b60

         
      </Routes>
    </Router>
  );
}

export default App;