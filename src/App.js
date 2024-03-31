import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";
import LoginPage from "./LoginPage"; // Simplified component without axios or navigate
import AdminMainPg from "./AdminMainPg";
import AddLibrarian from "./AddLibrarian";

import AddNewBookPage from "./addBook";
import WithNavigate from "./bookInventory";

function App() {
  return (
    // <Try />
    <AuthProvider authStorageType="localStorage">
      {" "}
      {/* Add necessary props */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminMainPg />} />
          <Route path="/AddLibrarian" element={<AddLibrarian />} />
          <Route path="/WithNavigate" element={<WithNavigate />} />
          <Route path="/AddNewBookPage" element={<AddNewBookPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
export default App;
