import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage"; // Simplified component without axios or navigate
import AdminMainPg from "./AdminMainPg";
import AddLibrarian from "./AddLibrarian";

import AddNewBookPage from "./addBook";
import WithNavigate from "./bookInventory";

import ViewBook from "./User/ViewBook";
import UserMainPage from "./User/UserMainPage";
import MyLibrary from "./User/UserMyLibrary";
import UserBookRequest from "./User/UserBookRequest";
import BookList from "./User/BookList";
import UserRateBook from "./User/UserRateBook";

import IssueBook from "./librarian/IssuesBook";
import LoanBook from "./librarian/LoanBook";
import RequestBook from "./librarian/RequestBook";
import Reservation from "./librarian/Reservation";
import Dashboard from "./librarian/Dashboard";
import AuthContext from "./AuthContext";
import { PrivateRoute } from "react-auth-kit";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import ForgotPassword from "./User/ForgotPassword";
import OTPPage from "./User/OTPPage";
function App() {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/IssuesBook" element={<IssueBook />} />
          <Route path="/LoanBook" element={<LoanBook />} />
          <Route path="/RequestBook" element={<RequestBook />} />
          <Route
            path="/admin"
            element={
              <RequireAuth loginPath={"/"}>
                <AdminMainPg />
              </RequireAuth>
            }
          />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/OTPPage" element={<OTPPage />} />
          <Route path="/RequestBook" element={<RequestBook />} />
          <Route
            path="/AddLibrarian"
            element={
              <RequireAuth loginPath="/">
                <AddLibrarian />
              </RequireAuth>
            }
          />
          <Route
            path="/WithNavigate"
            element={<WithNavigate />}
            // element={
            //   <RequireAuth loginPath="/">
            //     <WithNavigate />
            //   </RequireAuth>
            // }
          />
          <Route
            path="/AddNewBookPage"
            element={
              <RequireAuth loginPath="/">
                <AddNewBookPage />
              </RequireAuth>
            }
          />
          <Route
            path="/Reservation"
            element={
              // <RequireAuth loginPath="/">
              <Reservation />
              // </RequireAuth>
            }
          />
          <Route
            path="/BookList"
            element={
              <RequireAuth loginPath="/">
                <BookList />
              </RequireAuth>
            }
          />
          <Route
            path="/UserBookRequest"
            element={
              <RequireAuth loginPath="/">
                <UserBookRequest />
              </RequireAuth>
            }
          />
          <Route
            path="/UserMyLibrary"
            element={
              <RequireAuth loginPath="/">
                <MyLibrary />
              </RequireAuth>
            }
          />
          <Route
            path="/UserMainPage"
            element={
              <RequireAuth loginPath="/">
                <UserMainPage />
              </RequireAuth>
            }
          />
          <Route
            path="/ViewBook"
            element={
              <RequireAuth loginPath="/">
                <ViewBook />
              </RequireAuth>
            }
          />
          <Route
            path="/UserRateBook"
            element={
              <RequireAuth loginPath="/">
                <UserRateBook />
              </RequireAuth>
            }
          />

          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
export default App;
