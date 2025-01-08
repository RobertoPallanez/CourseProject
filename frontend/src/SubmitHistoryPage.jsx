import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import SubmissionRow from "./SubmissionRow";
import axios from "axios";

function SubmitHistoryPage(props) {
  const navigate = useNavigate();

  const {
    setQuestions,
    selectedTemplate,
    setSelectedFormQuestions,
    currentUser,
    setCurrentUser,
    forms,
    setForms,
    selectedForm,
    setSelectedForm,
    setSelectedAnswers,
    goToAnalyticsPage,
    BACKEND_URL,
    setIsAnswering,
  } = useQuestion();

  function handleLogout() {
    setQuestions([]);
    setCurrentUser(null);
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);
    setIsAnswering(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  function goToTemplatePage() {
    setForms(null);
    navigate("/TemplatePage");
  }

  async function goToSubmittedAnswersPage(form_Id) {
    try {
      const response = await axios.post(`${BACKEND_URL}/selectForm`, {
        formId: form_Id,
      });
      setSelectedAnswers(response.data.sortedAnswers);
      setSelectedFormQuestions(response.data.questions);
      setSelectedForm(response.data.form);
    } catch (error) {
      console.error("Error receiving the selectedForm and answers.", error);
    }
  }

  useEffect(() => {
    localStorage.removeItem("authToken");
    if (selectedForm !== null) {
      if (currentUser.role === "admin") {
        navigate("/SubmittedAdminPage");
      } else if (currentUser.role === "user") {
        navigate("/SubmittedAnswersPage");
      }
    }
  }, [selectedForm]);

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="templateEditor">SUBMISSIONS HISTORY</div>
        <div className="editorAndSubmitButtons">
          <button onClick={goToTemplatePage} title="editor">
            <img className="ESAIcon" src="./editorIcon.svg" />
          </button>
          <button title="submissions">
            <img className="ESAIcon" src="./submissionsIcon.svg" />
          </button>
          <button
            onClick={() => goToAnalyticsPage(selectedTemplate.id)}
            title="analytics"
          >
            <img className="ESAIcon" src="./analyticsIcon.svg" />
          </button>
        </div>
        <div className="messages">
          <div className="welcomeMessage">Hi, {currentUser.name}</div>
          <div className="createMessage">
            These are all the submissions for your template:{" "}
            {selectedTemplate.name}
          </div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
      </div>
      {/* QUESTIONS CONTAINER */}
      <div className="questionsContainer">
        <div className="currentFormHeader">
          SUBMISSIONS ({forms ? forms.length : null})
        </div>
        <div className="submissionHeaders">
          <span>user name</span>
          <span className="emailSpan">user email</span>
          <span>submission date</span>
        </div>
        {forms ? (
          forms.length == 0 ? (
            <div>There are no submissions for this template yet.</div>
          ) : (
            forms.map((form) => {
              return (
                <SubmissionRow
                  key={form.id}
                  userName={form.user_name}
                  userEmail={form.user_email}
                  submissionDate={form.submission_date}
                  goToSubmittedAnswersPage={goToSubmittedAnswersPage}
                  formId={form.id}
                />
              );
            })
          )
        ) : null}
      </div>
      <div className="createOrBackButton">
        <button
          title="back"
          className="backToManagerButton"
          onClick={goToTemplatePage}
          style={{ marginBottom: "20px" }}
        >
          <img className="ESAIcon" src="backIcon.svg" />
        </button>
      </div>
    </div>
  );
}

SubmitHistoryPage.defaultProps = {
  questions: [],
};

export default SubmitHistoryPage;
