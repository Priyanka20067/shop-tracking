import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Home from './components/Home';
import CustomerForm from './components/customerform';
import CustomerHistory from './components/customerHistory';
import Test from './components/test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/customerform' element={<CustomerForm />} />
        <Route path='/customerhistory' element={<CustomerHistory />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
