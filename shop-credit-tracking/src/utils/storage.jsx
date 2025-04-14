// checked-1
export const saveCustomers = (customers) => {
  localStorage.setItem("customers", JSON.stringify(customers));
};

export const loadCustomers = () => {
  return JSON.parse(localStorage.getItem("customers") || "[]");
};

export const saveItems = (items) => {
  localStorage.setItem("items", JSON.stringify(items));
};

export const loadItems = () => {
  return JSON.parse(localStorage.getItem("items") || "[]");
};

export const exportToCSV = (customers) => {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Address",
    "Aadhar",
    "Advance",
    "SMS Enabled",
    "History",
  ];
  const escapeField = (field) =>
    field ? `"${String(field).replace(/"/g, '""')}"` : "";
  const rows = customers.map((c) => [
    escapeField(c.name),
    escapeField(c.phone),
    escapeField(c.email),
    escapeField(c.address),
    escapeField(c.aadhar),
    c.advance || 0,
    c.smsEnabled ? "Yes" : "No",
    escapeField(
      (c.history || [])
        .map(
          (h) =>
            `${h.type}:₹${h.amount.toFixed(2)}:${h.date}:${h.items?.join(",") || "-"}`
        )
        .join("|")
    ),
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "customers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importCSV = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split("\n").map((row) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') {
          inQuotes = !inQuotes;
        } else if (row[i] === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += row[i];
        }
      }
      result.push(current);
      return result;
    });
    const headers = rows[0].map((h) => h.trim());
    const customers = rows.slice(1).map((row) => {
      const customer = {};
      headers.forEach((header, i) => {
        customer[header.toLowerCase().replace(/\s/g, "_")] = row[i]?.trim();
      });
      if (customer.history) {
        customer.history = customer.history
          .split("|")
          .filter(Boolean)
          .map((entry) => {
            const [type, amount, date, items] = entry.split(":");
            return {
              type: type.toLowerCase(),
              amount: parseFloat(amount.replace("₹", "")) || 0,
              date: date || new Date().toLocaleDateString(),
              items: items !== "-" ? items.split(",") : [],
            };
          });
      }
      customer.advance = parseFloat(customer.advance) || 0;
      customer.sms_enabled = customer.sms_enabled?.toLowerCase() === "yes";
      return customer;
    });
    callback(customers.filter((c) => c.name));
  };
  reader.readAsText(file);
};