import { useState, useEffect } from 'react';
import './cal.css';

// Calculator Component
function Calculator({ onCalculate }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [animateResult, setAnimateResult] = useState(false);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      // Using Function constructor instead of eval for better security
      const calcResult = new Function('return ' + input)();
      setResult(calcResult);
      setAnimateResult(true);
      onCalculate(calcResult); // Send result to parent to update Amount input
    } catch (error) {
      setResult('Error');
    }
  };

  const clear = () => {
    setInput('');
    setResult('');
  };

  useEffect(() => {
    if (animateResult) {
      const timer = setTimeout(() => {
        setAnimateResult(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [animateResult]);

  return (
    <div className="calculator">
      <h2>Calculator</h2>
      <input type="text" value={input} readOnly />
      <div className={animateResult ? 'highlight' : ''}>
        {result && <p>Result: {result}</p>}
      </div>
      <div className="buttons">
        {['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '0', '.', '/', '='].map((btn) => (
          <button
            key={btn}
            onClick={() => (btn === '=' ? calculate() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}
        <button onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

// Customized To-Do List Component
function TodoList({ calculatedAmount, setCalculatedAmount }) {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [newEntryId, setNewEntryId] = useState(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('shopCreditEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shopCreditEntries', JSON.stringify(entries));
  }, [entries]);

  // Update amount when calculator provides a result
  useEffect(() => {
    if (calculatedAmount !== null) {
      setAmount(calculatedAmount.toString());
      setCalculatedAmount(null); // Reset after setting
    }
  }, [calculatedAmount, setCalculatedAmount]);

  const formatPhone = (phone) => {
    if (phone.length === 10) {
      return `${phone.substring(0, 3)} ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
    }
    return phone;
  };

  const addEntry = () => {
    if (name.trim() && items.trim() && phone.trim() && amount.trim()) {
      const newEntry = {
        id: Date.now(),
        name,
        items: items.split(',').map(item => item.trim()),
        phone,
        amount: parseFloat(amount) || 0,
        date: new Date().toLocaleDateString(),
      };
      setEntries([...entries, newEntry]);
      setNewEntryId(newEntry.id);
      
      // Clear form
      setName('');
      setItems('');
      setPhone('');
      setAmount('');
      
      // Reset animation trigger after delay
      setTimeout(() => {
        setNewEntryId(null);
      }, 1000);
    } else {
      alert('Please fill in all fields');
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const getTotalCredit = () => {
    return entries.reduce((total, entry) => total + entry.amount, 0).toFixed(2);
  };

  return (
    <div className="todo-list">
      <h2>Shop Credit Tracker</h2>
      <div className="input-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer Name"
        />
        <input
          type="text"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder="Items (e.g., milk, bread)"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) setPhone(value);
          }}
          placeholder="Phone (10 digits)"
          maxLength={10}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>
      
      {entries.length > 0 && (
        <div className="summary">
          <h3>Total Credit: ${getTotalCredit()}</h3>
        </div>
      )}
      
      <h3>History</h3>
      {entries.length === 0 ? (
        <p>No entries yet. Add your first customer.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li 
              key={entry.id} 
              className={newEntryId === entry.id ? 'highlight' : ''}
            >
              <div>
                <strong>{entry.name}</strong> - {formatPhone(entry.phone)} <br />
                Items: {entry.items.join(', ')} <br />
                Amount: ${entry.amount.toFixed(2)} <br />
                Date: {entry.date}
              </div>
              <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Main App Component
function Cal() {
  const [calculatedAmount, setCalculatedAmount] = useState(null);

  const handleCalculate = (result) => {
    setCalculatedAmount(result);
  };

  return (
    <div className="app">
      <h1>Shop Credit & Tracking Application</h1>
      <div className="features">
        <Calculator onCalculate={handleCalculate} />
        <TodoList calculatedAmount={calculatedAmount} setCalculatedAmount={setCalculatedAmount} />
      </div>
    </div>
  );
}

export default Cal;
