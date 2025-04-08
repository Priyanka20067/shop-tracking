import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const result = new Function(`return ${display}`)();
      setDisplay(result.toString());
    } catch {
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

function CreditTracker({ navigate }) {
  const [customers, setCustomers] = useState(JSON.parse(localStorage.getItem('customers')) || []);
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const addCredit = () => {
    if (name && amount) {
      const creditEntry = {
        type: 'credit',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(), // Added time
        items: items ? items.split(',').map(item => item.trim()) : [],
        amount: parseFloat(amount),
      };

      const existingIndex = customers.findIndex(
        (c) => c.name === name && c.phone === phone
      );

      if (existingIndex !== -1) {
        const updatedCustomers = [...customers];
        updatedCustomers[existingIndex].history.push(creditEntry);
        setCustomers(updatedCustomers);
      } else {
        const newCustomer = {
          id: Date.now(),
          name,
          phone,
          history: [creditEntry],
        };
        setCustomers([...customers, newCustomer]);
      }

      setName('');
      setItems('');
      setPhone('');
      setAmount('');
    } else {
      alert('Please enter both name and amount!');
    }
  };

  const addPayment = (customerId) => {
    const amountPaid = prompt('Enter amount paid:');
    const value = parseFloat(amountPaid);
    if (!value || isNaN(value) || value <= 0) return alert('Invalid amount');

    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          history: [...c.history, {
            type: 'payment',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(), // Added time
            amount: value,
          }],
        };
      }
      return c;
    });
    setCustomers(updated);
  };

  const calculateUnpaid = (history) => {
    const credit = history.filter(h => h.type === 'credit').reduce((sum, h) => sum + h.amount, 0);
    const paid = history.filter(h => h.type === 'payment').reduce((sum, h) => sum + h.amount, 0);
    return credit - paid;
  };

  const totalCredit = customers.reduce(
    (sum, customer) => sum + calculateUnpaid(customer.history),
    0
  );

  return (
    <div className="todo-list">
      <h2>Credit Tracker</h2>

      <div className="summary">
        <h3>Total Credit: ₹{totalCredit.toFixed(2)}</h3>
      </div>

      <div className="input-group">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer Name" />
        <input type="text" value={items} onChange={(e) => setItems(e.target.value)} placeholder="Items (e.g., milk, bread)" />
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
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Credit Amount" />
        <button onClick={addCredit}>{editId ? 'Update Credit' : 'Add Credit'}</button>
      </div>

      <div className="history-container">
        <button className="history-button" onClick={() => navigate("/customerhistory")}>History</button>
        <button className="plus-symbol" onClick={() => navigate("/customerform")}>+</button>
      </div>

      <ul>
        {customers.map((customer) => {
          const unpaid = calculateUnpaid(customer.history);
          if (unpaid <= 0) return null;
          return (
            <li key={customer.id}>
              <div>
                <strong>{customer.name}</strong>: ₹{unpaid.toFixed(2)}
                <br />
                <small>Phone: {customer.phone}</small>
              </div>
              <button onClick={() => addPayment(customer.id)}>Pay Amount</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MainPage() {
  return (
    <div className="app">
      <h1>Shop Management</h1>
      <div className="features">
        <Calculator />
        <CreditTracker navigate={useNavigate()} />
      </div>
    </div>
  );
}

export default MainPage;
