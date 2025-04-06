import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './customerhistry.css';

const downloadPDF = (customer) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Credit Statement for ${customer.name}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Phone: ${customer.phone}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

  const rows = customer.history.map((entry, index) => [
    index + 1,
    entry.type === 'credit' ? 'Credit' : 'Payment',
    entry.date,
    entry.items?.join(', ') || '-',
    `₹${entry.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['#', 'Type', 'Date', 'Items', 'Amount']],
    body: rows,
  });

  doc.save(`${customer.name}_statement.pdf`);
};




function CustomerHistory() {
  const [credits, setCredits] = useState(JSON.parse(localStorage.getItem('customers')) || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  const loadData = () => {
    try {
      const allData = JSON.parse(localStorage.getItem('customers')) || [];
      setCredits(allData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    loadData();
  }, []);
  

  const handleNotification = (customer) => {
    const unpaid = customer.history.filter(entry => entry.value === true);
    const totalUnpaid = unpaid.reduce((sum, item) => sum + item.amount, 0);
    const latestItems = unpaid[unpaid.length - 1]?.items?.join(', ') || 'items';

    alert(
      `Sending SMS/WhatsApp to ${customer.name} (${customer.phone}):\n` +
      `You owe ₹${totalUnpaid.toFixed(2)}. Please pay soon.\n` +
      `Latest purchase: ${latestItems}`
    );
  };

  const deleteCredit = (customerIndex, entryIndex) => {
    const updatedCredits = [...credits];
    updatedCredits[customerIndex].history.splice(entryIndex, 1);
    setCredits(updatedCredits);
  };

  const totalHistoryCredit = credits.reduce((sum, customer) => {
    return sum + customer.history.reduce((subSum, item) => subSum + item.amount, 0);
  }, 0);

  const filteredCredits = credits.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  if (isLoading) return <div className="loading">Loading history...</div>;

  return (
    <div className="customer-history">
      <h2>Customer History</h2>

      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>

      <ul>
        {filteredCredits.map((customer, cIndex) => (
          <li key={customer.name}>
            <div>
              <h3>{customer.name} ({customer.phone})</h3>
              <button onClick={() => handleNotification(customer)}>Send Notification</button>
              <button onClick={() => downloadPDF(customer)} style={{ marginLeft: '10px' }}>
  Download PDF
</button>


              <ul>
                {customer.history.map((entry, eIndex) => (
                  <li
                    key={eIndex}
                    style={{ color: entry.value ? 'red' : 'green', marginBottom: '10px' }}
                  >
                    ₹{entry.amount} — {entry.items?.join(", ")} — {entry.date}
                    <button onClick={() => deleteCredit(cIndex, eIndex)} style={{ marginLeft: '10px' }}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="summary">
        <h3>Total Historical Credit: ₹{totalHistoryCredit.toFixed(2)}</h3>
        <p>Showing {filteredCredits.length} of {credits.length} customers</p>
      </div>
    </div>
  );
}

export default CustomerHistory;
