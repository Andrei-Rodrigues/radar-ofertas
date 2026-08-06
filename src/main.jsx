import React from "react";
import ReactDOM from "react-dom/client";
import LinkBioPage from "./LinkBioPage.jsx";
import AdminPage from "./AdminPage.jsx";
import "./index.css";

const isAdmin = window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isAdmin ? <AdminPage /> : <LinkBioPage />}</React.StrictMode>
);
