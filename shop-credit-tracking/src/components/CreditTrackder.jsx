// CreditTracker.jsx
import { useState, useEffect } from 'react';
import './style.css';

function CreditTracker() {
  const [credits, setCredits] = useState(JSON.parse(localStorage.getItem('credits')) || []);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  const addCredit = () => {
    if (name && amount) {
      const newCredits = [...credits, { name, amount: parseFloat(amount) }];
      setCredits(newCredits);
      setName('');
      setAmount('');
    } else {
      alert('Please enter both name and amount!');
    }
  };

  const deleteCredit = (index) => {
    setCredits(credits.filter((_, i) => i !== index));
  };

  return (
    <div className="credit-tracker">
      <h2>Credit Tracker</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer Name" />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Credit Amount" />
      <button onClick={addCredit}>Add Credit</button>
      <ul>
        {credits.map((credit, index) => (
          <li key={index} className="credit-item">
            {credit.name}: ₹{credit.amount} <button className="delete-btn" onClick={() => deleteCredit(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>Total Credit: ₹{credits.reduce((sum, credit) => sum + credit.amount, 0)}</p>
    </div>
  );
}

export default CreditTracker;
