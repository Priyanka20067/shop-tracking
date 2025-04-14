// checked-1
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/FeedbackForm.css";

function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, store in localStorage
    const feedbackData = { feedback, rating, date: new Date().toLocaleString() };
    const storedFeedback = JSON.parse(localStorage.getItem("feedback") || "[]");
    localStorage.setItem("feedback", JSON.stringify([...storedFeedback, feedbackData]));
    alert(t("feedbackSubmitted"));
    setFeedback("");
    setRating(5);
  };

  return (
    <div className="feedback-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("yourFeedback")}:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("enterFeedback")}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("rating")}:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} {t("stars")}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{t("submitFeedback")}</button>
      </form>
    </div>
  );
}

export default FeedbackForm;