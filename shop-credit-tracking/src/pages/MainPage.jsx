// checked-1
import React from "react";
import CreditInput from "../components/CreditInput";
import "../styles/CreditInput.css";
import { useTranslation } from "react-i18next";

function MainPage() {
  const { t } = useTranslation();
  return (
    <div className="main-page">
      <h2>{t("creditTracker")}</h2>
      <CreditInput />
    </div>
  );
}

export default MainPage;