// Calculator.jsx
import { useState } from 'react';
import './style.css';

function Calculator() {
  const [display, setDisplay] = useState('');

  const appendToDisplay = (value) => {
    setDisplay((prev) => prev + value);
  };

  const clearDisplay = () => {
    setDisplay('');
  };

  const calculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay(''), 1000);
    }
  };

  return (
    <div className="calculator">
      <h2>Calculator</h2>
      <input type="text" value={display} readOnly className="display" />
      <div className="buttons">
        {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0', '.'].map((btn) => (
          <button
            key={btn}
            onClick={() => (btn === 'C' ? clearDisplay() : btn === '=' ? calculate() : appendToDisplay(btn))}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
