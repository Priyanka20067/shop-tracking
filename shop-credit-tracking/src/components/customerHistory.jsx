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
    `Rs. ${entry.amount.toFixed(2)}`,
  ]);

 // 🔥 Table
 autoTable(doc, {
  startY: 50,
  head: [['#', 'Type', 'Date', 'Items', 'Amount']],
  body: rows,
});

// 🔍 Summary Calculation
const totalCredit = customer.history
  .filter((e) => e.type === 'credit')
  .reduce((sum, e) => sum + e.amount, 0);

const totalPaid = customer.history
  .filter((e) => e.type === 'payment')
  .reduce((sum, e) => sum + e.amount, 0);

const balance = totalCredit - totalPaid;

// 📄 Summary Text
doc.setFontSize(12);
const summaryY = doc.lastAutoTable.finalY + 10;
doc.text(`Total Credit: Rs. ${totalCredit.toFixed(2)}`, 14, summaryY);
doc.text(`Total Paid: Rs. ${totalPaid.toFixed(2)}`, 14, summaryY + 10);
doc.text(`Balance Due: Rs. ${balance.toFixed(2)}`, 14, summaryY + 20);

doc.save(`${customer.name}_statement.pdf`);
};




function CustomerHistory() {
  const [credits, setCredits] = useState(JSON.parse(localStorage.getItem('customers')) || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState(null); // Track expanded customer
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  useEffect(() => {
    try {
      const allData = JSON.parse(localStorage.getItem('customers')) || [];
      setCredits(allData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  

  const handleNotification = (customer) => {
    const unpaid = customer.history.filter(entry => entry.value === 'credit');
    const totalUnpaid = unpaid.reduce((sum, item) => sum + item.amount, 0) - customer.history.filter(entry => entry.type === 'payment').reduce((sum, item) => sum +item.amount, 0);
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

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  // const filteredCredits = credits.filter(customer =>
  //   customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   customer.phone.includes(searchTerm)
  // );
  // paid and unpaid for history

  
  const [filterOption, setFilterOption] = useState('all');
  // const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);

  const filteredCredits = credits.filter(customer => {
    const searchMatch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.history.some(entry =>
        entry.date.includes(searchTerm)
      );
  
      if (!searchMatch) return false;

      const unpaidBalance = customer.history.reduce((sum, entry) => 
        entry.type === 'credit' ? sum + entry.amount : sum - entry.amount, 0
      );
  
      if (filterOption === 'unpaid') return unpaidBalance > 0;
      if (filterOption === 'paid') return unpaidBalance <= 0;
      return true;
    });
  
    if (isLoading) return <div className="loading">Loading history...</div>;





  return (
    <div className="customer-history">
      <h2>Customer History</h2>

      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name or phone or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /><select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
        <option value="all">All</option>
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>
      
      

        <button onClick={() => navigate('/main')}>Back to Credit Tracker</button>
      </div>

      <ul>
        {filteredCredits.map((customer) => (
          <li key={customer.id}>
            <div className="customer-header">
              <button 
                onClick={() => toggleExpand(customer.id)}
                style={{ marginRight: '10px' }}
              >
                {expandedCustomer === customer.id ? '▼' : '▶'}
              </button>
              <h3>{customer.name} ({customer.phone})</h3>
              {expandedCustomer !== customer.id && (
                <>
                  <button 
                    onClick={() => handleNotification(customer)} 
                    style={{ marginLeft: '10px' }}
                  >
                    Send Notification
                  </button>
                  <button 
                    onClick={() => downloadPDF(customer)} 
                    style={{ marginLeft: '10px' }}
                  >
                    Download PDF
                  </button>
                </>
              )}
            </div>

            {expandedCustomer === customer.id && (
              <ul>
                {customer.history.map((entry, eIndex) => (
                  <li
                    key={eIndex}
                    style={{ 
                      color: entry.type === 'credit' ? 'red' : 'green', 
                      marginBottom: '10px' 
                    }}
                  >
                    ₹{entry.amount.toFixed(2)} — {entry.items?.join(", ") || '-'} — 
                    {entry.date} {entry.time || ''}
                    {/* <button 
                      onClick={() => deleteCredit(credits.findIndex(c => c.id === customer.id), eIndex)} 
                      style={{ marginLeft: '10px' }}
                    >
                      Delete
                    </button> */}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="summary">
        <h3>Total Historical Credit: ₹{credits.reduce((sum, c) => 
          sum + c.history.reduce((s, i) => 
            i.type === 'credit' ? s + i.amount : s - i.amount, 0), 0
        ).toFixed(2)}</h3>
        <p>Showing {filteredCredits.length} of {credits.length} customers</p>
      </div>
    </div>
  );
}

export default CustomerHistory;
