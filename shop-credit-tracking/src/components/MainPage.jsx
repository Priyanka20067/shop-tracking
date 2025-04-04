import { useState, useEffect } from 'react';
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
  
  const buttonValues = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];
  const clearButton = 'C';
  
  return (
    <div className="calculator">
      <h2>Calculator</h2>
      <input type="text" value={display} readOnly />
      <div className="buttons">
        {buttonValues.map((btn) => (
          <button
            key={btn}
            onClick={() => btn === '=' ? calculate() : appendToDisplay(btn)}
          >
            {btn}
          </button>
        ))}
        <button onClick={clearDisplay}>{clearButton}</button>
      </div>
    </div>
  );
}

function CreditTracker() {
  const [credits, setCredits] = useState(JSON.parse(localStorage.getItem('credits')) || []);
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState(null); // Track credit being edited

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  const addCredit = () => {
    if (name && amount) {
      if (editId) {
        // Update the existing credit
        const updatedCredits = credits.map((credit) =>
          credit.id === editId
            ? {
                ...credit,
                name,
                amount: parseFloat(amount),
                items: items ? items.split(',').map(item => item.trim()) : [],
                phone,
              }
            : credit
        );
        setCredits(updatedCredits);
        setEditId(null);
      } else {
        // Add new credit
        const newCredit = {
          id: Date.now(),
          name,
          amount: parseFloat(amount),
          items: items ? items.split(',').map(item => item.trim()) : [],
          phone,
          date: new Date().toLocaleDateString(),
        };
        setCredits([...credits, newCredit]);
      }
      // Clear input fields
      setName('');
      setItems('');
      setPhone('');
      setAmount('');
    } else {
      alert('Please enter both name and amount!');
    }
  };

  const handleEdit = (credit) => {
    setName(credit.name);
    setItems(credit.items.join(', '));
    setPhone(credit.phone);
    setAmount(credit.amount.toString());
    setEditId(credit.id);
  };

  const handleNotification = (credit) => {
    alert(
      `Sending SMS to ${credit.name} (${credit.phone}):\nYou owe ₹${credit.amount.toFixed(2)} for items: ${credit.items.join(', ')}`
    );
  };

  const deleteCredit = (index) => {
    const newCredits = [...credits];
    newCredits.splice(index, 1);
    setCredits(newCredits);
  };

  const totalCredit = credits.reduce((sum, credit) => sum + credit.amount, 0);

  return (
    <div className="todo-list">
      <h2>Credit Tracker</h2>
      
      <div className="summary">
        <h3>Total Credit: ₹{totalCredit.toFixed(2)}</h3>
      </div>
      
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
          placeholder="Credit Amount" 
        />
        <button onClick={addCredit}>{editId ? 'Update Credit' : 'Add Credit'}</button>
      </div>

      <ul>
        {credits.map((credit, index) => (
          <li key={credit.id} className={index === credits.length - 1 ? 'highlight' : ''}>
            <div>
              <strong>{credit.name}</strong>: ₹{credit.amount.toFixed(2)}
              <br />
              {credit.items && credit.items.length > 0 && (
                <small>Items: {credit.items.join(', ')}</small>
              )}
              <br />
              <small>Date: {credit.date} {credit.phone && `| Phone: ${credit.phone}`}</small>
            </div>
            <button onClick={() => handleEdit(credit)}>Edit</button>
            <button onClick={() => handleNotification(credit)}>Send Notification</button>
            <button onClick={() => deleteCredit(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <h1>Shop Management</h1>
      <div className="features">
        <Calculator />
        <CreditTracker />
      </div>
    </div>
  );
}

export default App;
