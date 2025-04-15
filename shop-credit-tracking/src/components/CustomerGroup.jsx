// checked-1
import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/CustomerGroup.css";
function CustomerGroup({ groups, credits, onSelectGroup }) {
  const { t } = useTranslation();

  return (
    <div className="group-list">
      <h4>{t("groups")}</h4>
      {groups.length > 0 ? (
        <ul>
          <li onClick={() => onSelectGroup(null)} style={{ cursor: "pointer" }}>
            {t("allCustomers")}
          </li>
          {groups.map((group) => (
            <li
              key={group.name}
              onClick={() => onSelectGroup(group)}
              style={{ cursor: "pointer" }}
            >
              {group.name}:{" "}
              {group.members
                .map((id) => credits.find((c) => c.id === id)?.name)
                .filter(Boolean)
                .join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("noGroups")}</p>
      )}
    </div>
  );
}

export default CustomerGroup;