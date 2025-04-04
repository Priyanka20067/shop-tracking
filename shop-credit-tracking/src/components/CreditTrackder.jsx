// CreditTracker.jsx
import { useState, useEffect } from 'react';
import './style.css';

function CreditTracker() {
    const [credits, setCredits] = useState(JSON.parse(localStorage.getItem('credits')) || []);
    const [name, setName] = useState('');
    const [items, setItems] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        localStorage.setItem('credits', JSON.stringify(credits));
    }, [credits]);

    const addCredit = () => {
        if (name && amount) {
            const newCredits = [...credits, { name, amount: parseFloat(amount), id: Date.now(), items: items.split(',').map(item => item.trim()), phone, date: new Date().toLocaleDateString() }];
            setCredits(newCredits);
            setName('');
            setItems('');
            setPhone('');
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
            <input
                type="text"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Items (e.g., milk, bread)"
                defaultValue={'NaN'}
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
                    defaultValue={'NaN'}
                />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Credit Amount" />
            <button onClick={addCredit}>Add Credit</button>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Date</th>
                    <th>Ph</th>
                    <th>Action</th>
                </tr>
                <tr>
                {credits.map((credit, index) => (
                    <li key={index} className="credit-item">
                        
                       <td> {credit.name}:</td> <td>₹{credit.amount};</td> <hr /><hr /><hr />
                                Items: {credit.items.join(', ')}; <hr /><hr /><hr />
                        Date: {credit.date};<hr /><hr /><hr />
                        Ph: {credit.phone};<hr /><hr /><hr />
                         <button className="delete-btn" onClick={() => deleteCredit(index)}>Delete</button>
                    
                     </li>
                    
                ))}
                </tr>
            
            
            <p>Total Credit: ₹{credits.reduce((sum, credit) => sum + credit.amount, 0)}</p>
            </table>

        </div>
    );
}

export default CreditTracker;
