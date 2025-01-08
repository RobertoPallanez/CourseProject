import "./App.css";
import LoginPage from "./LoginPage";
import ManagerPage from "./ManagerPage";
import AdminPage from "./AdminPage";
import FillingPage from "./FillingPage";
import AnswerFormPage from "./AnswerFormPage";
import UserManagerPage from "./UserManagerPage";
import NewForm from "./NewForm";
import TemplatePage from "./TemplatePage";
import SignupPage from "./SignupPage";
import { Routes, Route } from "react-router-dom";
import { QuestionProvider } from "./QuestionContext";
import SubmitHistoryPage from "./SubmitHistoryPage";
import SubmittedAnswersPage from "./SubmittedAnswersPage";
import FillingAdminPage from "./FillingAdminPage";
import AnalyticsPage from "./AnalyticsPage";
import ModifyAnswersPage from "./ModifyAnswersPage";
import SubmittedAdminPage from "./SubmittedAdminPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "./QuestionContext";
import axios from "axios";
import { Navigate } from "react-router";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const publicRoutes = ["/SignupPage", "/FillingPage"]; // Routes that don't require authentication
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false); // Explicitly set as not authenticated
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/");
        }
        return;
      }
      try {
        await axios.get(
          `https://courseproject-reactiveforms.onrender.com/auth`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/");
        }
      }
    };

    // Run token verification only if not authenticated or verification hasn't started
    if (isAuthenticated === null && !publicRoutes.includes(location.pathname)) {
      verifyToken().then(() => setIsLoading(false));
    } else {
      setIsLoading(false); // Skip verification for public routes
    }
  }, [navigate, location.pathname, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    ); // Display a loading spinner or message if needed
  }

  return (
    <>
      <QuestionProvider>
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route path="/SignupPage" element={<SignupPage />} />
          <Route
            path="/ManagerPage"
            element={isAuthenticated ? <ManagerPage /> : <Navigate to="/" />}
          />
          <Route
            path="/AdminPage"
            element={isAuthenticated ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route
            path="/UserManagerPage"
            element={
              isAuthenticated ? <UserManagerPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/FillingPage"
            element={isAuthenticated ? <FillingPage /> : <Navigate to="/" />}
          />
          <Route
            path="/FillingAdminPage"
            element={
              isAuthenticated ? <FillingAdminPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/TemplatePage"
            element={isAuthenticated ? <TemplatePage /> : <Navigate to="/" />}
          />
          <Route
            path="/AnswerFormPage"
            element={isAuthenticated ? <AnswerFormPage /> : <Navigate to="/" />}
          />
          <Route
            path="/ModifyAnswersPage"
            element={
              isAuthenticated ? <ModifyAnswersPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/SubmitHistoryPage"
            element={
              isAuthenticated ? <SubmitHistoryPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/AnalyticsPage"
            element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/SubmittedAnswersPage"
            element={
              isAuthenticated ? <SubmittedAnswersPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/SubmittedAdminPage"
            element={
              isAuthenticated ? <SubmittedAdminPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/NewForm"
            element={isAuthenticated ? <NewForm /> : <Navigate to="/" />}
          />
        </Routes>
      </QuestionProvider>
    </>
  );
}

export default App;
