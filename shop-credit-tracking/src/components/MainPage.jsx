// App.jsx
import Calculator from "./calculator";
import CreditTracker from "./CreditTrackder";
import "./style.css";

function MainPage() {
  return (
    <div className="app-container">
      <h1>Shopkeeper Calculator & Credit Tracker</h1>
      <div className="container">
        <Calculator />
        <CreditTracker />
      </div>
    </div>
  );
}

export default MainPage;
