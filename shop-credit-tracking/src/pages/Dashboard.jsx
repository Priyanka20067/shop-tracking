// checked-1
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FeedbackForm from "../components/FeedbackForm";
import { loadCustomers, exportToCSV, importCSV } from "../utils/storage";
import "../styles/Dashboard.css";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [analytics, setAnalytics] = useState({
    topCustomers: [],
    overdueCredits: 0,
    totalCredit: 0,
    interestingFact: "",
  });
  const [customers, setCustomers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const storedCustomers = loadCustomers();
    setCustomers(storedCustomers);

    const totalCredit = storedCustomers.reduce(
      (sum, c) =>
        sum +
        (c.history || []).reduce(
          (s, h) => (h.type === "credit" ? s + h.amount : s - h.amount),
          0
        ),
      0
    );

    const overdueCredits = storedCustomers.reduce(
      (sum, c) => {
        const balance = (c.history || []).reduce(
          (s, h) => (h.type === "credit" ? s + h.amount : s - h.amount),
          0
        );
        return balance > 0 ? sum + balance : sum;
      },
      0
    );

    const topCustomers = storedCustomers
      .sort((a, b) => (b.history?.length || 0) - (a.history?.length || 0))
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        balance: (c.history || []).reduce(
          (s, h) => (h.type === "credit" ? s + h.amount : s - h.amount),
          0
        ),
      }));

    // Interesting Fact: Find customer with most transactions
    const mostActive = storedCustomers.reduce(
      (max, c) => {
        const count = (c.history || []).length;
        return count > max.count ? { name: c.name, count } : max;
      },
      { name: "", count: 0 }
    );

    const interestingFact =
      mostActive.count > 0
        ? t("interestingFact", {
            name: mostActive.name,
            count: mostActive.count,
          })
        : t("noTransactionsYet");

    setAnalytics({ topCustomers, overdueCredits, totalCredit, interestingFact });
  }, []);

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importCSV(file, (newCustomers) => {
        setCustomers((prev) => {
          const updated = [...prev];
          newCustomers.forEach((newC) => {
            const existing = updated.find((c) => c.phone === newC.phone);
            if (existing) {
              existing.history = newC.history?.slice(-5) || [];
            } else {
              updated.push({ ...newC, id: Date.now(), history: newC.history?.slice(-5) || [] });
            }
          });
          saveCustomers(updated);
          return updated;
        });
        alert(t("csvImported"));
      });
    }
  };

  return (
    <div className="dashboard">
      <h1>{t("appTitle")}</h1>
      <nav className="dashboard-nav">
        <button onClick={() => setActiveSection("welcome")}>{t("welcome")}</button>
        <button onClick={() => setActiveSection("how-to")}>{t("howToUse")}</button>
        <button onClick={() => setActiveSection("features")}>{t("features")}</button>
        <button onClick={() => setActiveSection("faq")}>{t("faq")}</button>
        <button onClick={() => setActiveSection("analytics")}>{t("analytics")}</button>
        <button onClick={() => setActiveSection("about")}>{t("about")}</button>
        <button onClick={() => setActiveSection("feedback")}>{t("feedback")}</button>
        <button onClick={() => setActiveSection("backup")}>{t("backup")}</button>
      </nav>

      {activeSection === "welcome" && (
        <section id="welcome">
          <h2>{t("welcomeToApp")}</h2>
          <p>{t("welcomeDescription")}</p>
          <button>
            <a href="/main">{t("getStarted")}</a>
          </button>
        </section>
      )}

      {activeSection === "how-to" && (
        <section id="how-to">
          <h2>{t("howToUse")}</h2>
          <h3>{t("addCustomer")}</h3>
          <p>{t("addCustomerDesc")}</p>
          <h3>{t("addItem")}</h3>
          <p>{t("addItemDesc")}</p>
          <h3>{t("addCredit")}</h3>
          <p>{t("addCreditDesc")}</p>
          <h3>{t("manageGroups")}</h3>
          <p>{t("manageGroupsDesc")}</p>
          <h3>{t("backupData")}</h3>
          <p>{t("backupDataDesc")}</p>
        </section>
      )}

      {activeSection === "features" && (
        <section id="features">
          <h2>{t("features")}</h2>
          <ul>
            <li>{t("featureCreditTracking")}</li>
            <li>{t("featureCustomerGroups")}</li>
            <li>{t("featureMultiLanguage")}</li>
            <li>{t("featureDarkMode")}</li>
            <li>{t("featurePDFExport")}</li>
            <li>{t("featureCSVBackup")}</li>
            <li>{t("featureNotifications")}</li>
            <li>{t("featureAnalytics")}</li>
          </ul>
        </section>
      )}

      {activeSection === "faq" && (
        <section id="faq">
          <h2>{t("faq")}</h2>
          <h3>{t("faqBackupQuestion")}</h3>
          <p>{t("faqBackupAnswer")}</p>
          <h3>{t("faqNotificationsQuestion")}</h3>
          <p>{t("faqNotificationsAnswer")}</p>
          <h3>{t("faqGroupsQuestion")}</h3>
          <p>{t("faqGroupsAnswer")}</p>
          <h3>{t("faqCreditQuestion")}</h3>
          <p>{t("faqCreditAnswer")}</p>
        </section>
      )}

      {activeSection === "analytics" && (
        <section id="analytics">
          <h2>{t("analytics")}</h2>
          <h3>{t("topCustomers")}</h3>
          {analytics.topCustomers.length > 0 ? (
            <ul>
              {analytics.topCustomers.map((c, i) => (
                <li key={i}>
                  {c.name}: ₹{c.balance.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t("noCustomers")}</p>
          )}
          <h3>{t("overdueCredits")}</h3>
          <p>₹{analytics.overdueCredits.toFixed(2)}</p>
          <h3>{t("totalCredit")}</h3>
          <p>₹{analytics.totalCredit.toFixed(2)}</p>
          <h3>{t("interestingFactTitle")}</h3>
          <p>{analytics.interestingFact}</p>
        </section>
      )}

      {activeSection === "about" && (
        <section id="about">
          <h2>{t("about")}</h2>
          <p>{t("aboutDescription")}</p>
          <p>{t("aboutPurpose")}</p>
        </section>
      )}

      {activeSection === "feedback" && (
        <section id="feedback">
          <h2>{t("feedback")}</h2>
          <FeedbackForm />
        </section>
      )}

      {activeSection === "backup" && (
        <section id="backup">
          <h2>{t("backup")}</h2>
          <p>{t("backupDescription")}</p>
          <button onClick={() => exportToCSV(customers)}>
            {t("exportCSV")}
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            style={{ margin: "10px 0" }}
          />
          <h3>{t("googleDriveBackup")}</h3>
          <p>{t("googleDriveInstructions")}</p>
        </section>
      )}
    </div>
  );
}

export default Dashboard;