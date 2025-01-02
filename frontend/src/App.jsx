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

function App() {
  return (
    <>
      <QuestionProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/SignupPage" element={<SignupPage />} />
          <Route path="/ManagerPage" element={<ManagerPage />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/UserManagerPage" element={<UserManagerPage />} />
          <Route path="/FillingPage" element={<FillingPage />} />
          <Route path="/FillingAdminPage" element={<FillingAdminPage />} />
          <Route path="/TemplatePage" element={<TemplatePage />} />
          <Route path="/AnswerFormPage" element={<AnswerFormPage />} />
          <Route path="/ModifyAnswersPage" element={<ModifyAnswersPage />} />
          <Route path="/SubmitHistoryPage" element={<SubmitHistoryPage />} />
          <Route path="/AnalyticsPage" element={<AnalyticsPage />} />
          <Route
            path="/SubmittedAnswersPage"
            element={<SubmittedAnswersPage />}
          />
          <Route path="/SubmittedAdminPage" element={<SubmittedAdminPage />} />
          <Route path="/NewForm" element={<NewForm />} />
        </Routes>
      </QuestionProvider>
    </>
  );
}

export default App;
