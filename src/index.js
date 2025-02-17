import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use createRoot from react-dom/client
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ✅ New way to render in React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    </React.StrictMode>
);

// Keep this for performance measuring (optional)
reportWebVitals();