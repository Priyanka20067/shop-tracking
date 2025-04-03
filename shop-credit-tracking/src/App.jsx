import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './screen/calculator';
import Home from './screen/Home';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/calculator' element={<Calculator />} />
         
      </Routes>
    </Router>
  );
}

export default App;