import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerHistory() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    amount: '',
    items: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('customerHistory')) || [];
        setHistory(storedData);
        setFilteredHistory(storedData);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const results = history.filter(credit =>
      credit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.date.includes(searchTerm) ||
      (credit.phone && credit.phone.includes(searchTerm))
    );
    setFilteredHistory(results);
  }, [searchTerm, history]);

  const handleDelete = (id) => {
    const updatedHistory = history.filter(credit => credit.id !== id);
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem('customerHistory', JSON.stringify(updatedHistory));
  };

  const handleEdit = (credit) => {
    setEditId(credit.id);
    setEditData({
      name: credit.name,
      amount: credit.amount.toString(),
      items: credit.items.join(', '),
      phone: credit.phone || ''
    });
  };

  const saveEdit = () => {
    const updatedHistory = history.map(credit =>
      credit.id === editId
        ? {
            ...credit,
            name: editData.name,
            amount: parseFloat(editData.amount),
            items: editData.items.split(',').map(item => item.trim()),
            phone: editData.phone
          }
        : credit
    );
    
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem('customerHistory', JSON.stringify(updatedHistory));
    setEditId(null);
  };

  const totalHistoryCredit = filteredHistory.reduce((sum, credit) => sum + credit.amount, 0);

  if (isLoading) return <div className="loading">Loading history...</div>;

  return (
    <div className="customer-history">
      <h2>Customer History</h2>
      
      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name, date or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>

      <div className="summary">
        <h3>Total Historical Credit: ₹{totalHistoryCredit.toFixed(2)}</h3>
        <p>Showing {filteredHistory.length} of {history.length} records</p>
      </div>

      <ul>
        {filteredHistory.map((credit) => (
          <li key={credit.id}>
            {editId === credit.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({...editData, amount: e.target.value})}
                />
                <input
                  type="text"
                  value={editData.items}
                  onChange={(e) => setEditData({...editData, items: e.target.value})}
                />
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{credit.name}</strong>: ₹{credit.amount.toFixed(2)}
                <br />
                {credit.items && credit.items.length > 0 && (
                  <small>Items: {credit.items.join(', ')}</small>
                )}
                <br />
                <small>
                  Date: {credit.date} {credit.phone && `| Phone: ${credit.phone}`}
                </small>
                <div className="history-actions">
                  <button onClick={() => handleEdit(credit)}>Edit</button>
                  <button onClick={() => handleDelete(credit.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerHistory;