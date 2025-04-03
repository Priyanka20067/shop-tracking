import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './screen/calculator';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/calculater' element={<Calculator />} />
         
      </Routes>
    </Router>
  );
}

export default App;