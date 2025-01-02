import "./App.css";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import ShortQA from "./ShortQA";
import ParagraphQA from "./ParagraphQA";
import CheckboxQA from "./CheckboxQA";
import NumericQA from "./NumericQA";

function SubmittedAnswersPage(props) {
  const navigate = useNavigate();

  const {
    setQuestions,
    selectedTemplate,
    selectedFormQuestions,
    setSelectedFormQuestions,
    currentUser,
    setCurrentUser,
    setForms,
    selectedForm,
    setSelectedForm,
    selectedAnswers,
    setSelectedAnswers,
    goToAnalyticsPage,
    setIsAnswering,
  } = useQuestion();

  function handleLogout() {
    setQuestions([]);
    setCurrentUser(null);
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);
    setIsAnswering(false);
    navigate("/");
  }

  function goToTemplatePage() {
    setForms(null);
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);
    navigate("/TemplatePage");
  }

  function goToSubmitHistoryPage() {
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);
    navigate("/SubmitHistoryPage");
  }

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="templateEditor">SUBMITTED ANSWERS</div>
        <div className="editorAndSubmitButtons">
          <button onClick={goToTemplatePage} title="editor">
            <img className="ESAIcon" src="./editorIcon.svg" />
          </button>
          <button onClick={goToSubmitHistoryPage} title="submissions">
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
            These are the submitted answers for your template:{" "}
            {selectedTemplate.name}
          </div>
          <div className="createMessage">
            User: {selectedForm ? selectedForm.user_name : null}
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
        <div className="currentFormHeader">ANSWERS</div>
        {selectedFormQuestions
          ? selectedFormQuestions.map((question, index) => {
              if (question.question_type == "short answer") {
                return (
                  <ShortQA
                    key={question.id}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "(No answer provided)"
                    }
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "paragraph") {
                return (
                  <ParagraphQA
                    key={question.id}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "(No answer provided)"
                    }
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "checkbox") {
                return (
                  <CheckboxQA
                    key={question.id}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "unchecked"
                    }
                    checkbox={question.options}
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "numeric answer") {
                return (
                  <NumericQA
                    key={question.id}
                    qText={question.question_text}
                    aNumeric={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_numeric
                        : "(No answer provided)"
                    }
                    currentUser={currentUser}
                  />
                );
              }
            })
          : null}
      </div>
      <div className="createOrBackButton">
        <button
          title="back"
          className="backToManagerButton"
          onClick={goToSubmitHistoryPage}
          style={{ marginBottom: "20px" }}
        >
          <img className="ESAIcon" src="backIcon.svg" />
        </button>
      </div>
    </div>
  );
}

SubmittedAnswersPage.defaultProps = {
  questions: [],
};

export default SubmittedAnswersPage;
