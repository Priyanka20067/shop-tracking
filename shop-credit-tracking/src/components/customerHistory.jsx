import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./customerhistry.css";

const downloadPDF = (customer) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(33, 150, 243); // Blue
  doc.rect(0, 0, 210, 30, "F");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("Credit Statement", 14, 15);
  doc.setFontSize(12);
  doc.text(`Customer: ${customer.name}`, 14, 25);

  // Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Phone: ${customer.phone}`, 14, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);

  // Table
  const rows = (customer.history || []).map((entry, index) => [
    index + 1,
    entry.type === "credit" ? "Credit" : "Payment",
    entry.date,
    entry.items?.join(", ") || "-",
    `₹${entry.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["#", "Type", "Date", "Items", "Amount"]],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        data.cell.styles.textColor =
          data.cell.text[0] === "Credit" ? [255, 0, 0] : [0, 128, 0];
      }
    },
  });

  // Summary
  const totalCredit = (customer.history || [])
    .filter((e) => e.type === "credit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = (customer.history || [])
    .filter((e) => e.type === "payment")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalCredit - totalPaid;

  const summaryY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Credit: ₹${totalCredit.toFixed(2)}`, 14, summaryY);
  doc.text(`Total Paid: ₹${totalPaid.toFixed(2)}`, 14, summaryY + 10);
  // doc.setTextColor(balance > 0 ? [255, 20, 0] : [0, 128, 0]);
  doc.text(`Balance Due: ₹${balance.toFixed(2)}`, 14, summaryY + 20);

  // Footer
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 280, 210, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Thala Credit App", 14, 290);

  doc.save(`${customer.name}_statement.pdf`);
};

function CustomerHistory() {
  const [credits, setCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [filterOption, setFilterOption] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const allData = JSON.parse(localStorage.getItem("customers")) || [];
      console.log("CustomerHistory: Loaded credits", allData);
      setCredits(allData);
    } catch (error) {
      console.error("CustomerHistory: Error loading credits", error);
      setCredits([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (credits.length > 0) {
      try {
        console.log("CustomerHistory: Saving credits", credits);
        localStorage.setItem("customers", JSON.stringify(credits));
      } catch (error) {
        console.error("CustomerHistory: Error saving credits", error);
      }
    }
  }, [credits]);

  const handleNotification = (customer) => {
    const unpaid = (customer.history || []).filter((entry) => entry.type === "credit");
    const totalUnpaid =
      unpaid.reduce((sum, item) => sum + item.amount, 0) -
      (customer.history || [])
        .filter((entry) => entry.type === "payment")
        .reduce((sum, item) => sum + item.amount, 0);
    const latestItems = unpaid[unpaid.length - 1]?.items?.join(", ") || "items";

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

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const getBalance = (customer) =>
    (customer.history || []).reduce(
      (sum, entry) => (entry.type === "credit" ? sum + entry.amount : sum - entry.amount),
      0
    );

  const filteredCredits = credits.filter((customer) => {
    const searchMatch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.history || []).some((entry) => entry.date.includes(searchTerm));

    if (!searchMatch) return false;

    const unpaidBalance = getBalance(customer);

    if (filterOption === "unpaid") return unpaidBalance > 0;
    if (filterOption === "paid") return unpaidBalance <= 0;
    return true;
  });

  if (isLoading) return <div className="loading">Loading history...</div>;

  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Email", "Address", "Balance", "History"];
    const rows = credits.map((c) => [
      c.name,
      c.phone,
      c.email || "",
      c.address || "",
      getBalance(c).toFixed(2),
      (c.history || [])
        .map((h) => `${h.type}: ₹${h.amount.toFixed(2)} on ${h.date}`)
        .join("; "),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  const toggleReminder = (id) => {
    setCredits((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reminder: !c.reminder } : c
      )
    );
  };

  const quickAddEntry = (id, type) => {
    const amount = prompt(`Enter ${type} amount:`);
    const value = parseFloat(amount);
    if (!value || isNaN(value) || value <= 0) return alert("Invalid amount");
  
    setCredits((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              history: [
                ...c.history,
                {
                  type,
                  amount: value,
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                  items: [],
                },
              ],
            }
          : c
      )
    );
  };

  return (
    <div className="customer-history">
      <h2>Customer History</h2>

      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name, phone, or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="all">All</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
        <button onClick={exportToCSV}>Export to CSV</button>
        <button onClick={() => navigate("/main")}>Back to Credit Tracker</button>
      </div>

      <ul>
        {filteredCredits.map((customer) => (
          <li key={customer.id}>
            <div className="customer-header">
              <button
                onClick={() => toggleExpand(customer.id)}
                style={{ marginRight: "10px" }}
              >
                {expandedCustomer === customer.id ? "▼" : "▶"}
              </button><input
  type="checkbox"
  checked={customer.reminder || false}
  onChange={() => toggleReminder(customer.id)}
  style={{ marginLeft: "10px" }}
/>
              <h3>
                {customer.name} ({customer.phone})
                <span
                  style={{
                    marginLeft: "10px",
                    color: getBalance(customer) > 0 ? "red" : "green",
                  }}
                >
                  Balance: ₹{getBalance(customer).toFixed(2)}
                </span>
              </h3><button
  onClick={() => quickAddEntry(customer.id, "credit")}
  style={{ marginLeft: "10px" }}
>
  Add Credit
</button>
<button
  onClick={() => quickAddEntry(customer.id, "payment")}
  style={{ marginLeft: "10px" }}
>
  Add Payment
</button>
              {expandedCustomer !== customer.id && (
                <>
                  <button
                    onClick={() => handleNotification(customer)}
                    style={{ marginLeft: "10px" }}
                  >
                    Send Notification
                  </button>
                  <button
                    onClick={() => downloadPDF(customer)}
                    style={{ marginLeft: "10px" }}
                  >
                    Download PDF
                  </button>
                </>
              )}
            </div>

            {expandedCustomer === customer.id && (
              <ul>
                {(customer.history || []).map((entry, eIndex) => (
                  <li
                    key={eIndex}
                    style={{
                      color: entry.type === "credit" ? "red" : "green",
                      marginBottom: "10px",
                    }}
                  >
                    ₹{entry.amount.toFixed(2)} — {entry.items?.join(", ") || "-"} —{" "}
                    {entry.date} {entry.time || ""}
                    <button
                      onClick={() =>
                        deleteCredit(
                          credits.findIndex((c) => c.id === customer.id),
                          eIndex
                        )
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="summary">
        <h3>
          Total Historical Credit: ₹
          {credits
            .reduce(
              (sum, c) => sum + getBalance(c),
              0
            )
            .toFixed(2)}
        </h3>
        <p>
          Showing {filteredCredits.length} of {credits.length} customers
        </p>
      </div>
    </div>
  );
}

export default CustomerHistory;