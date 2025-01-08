import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import ShortQA from "./ShortQA";
import ParagraphQA from "./ParagraphQA";
import CheckboxQA from "./CheckboxQA";
import NumericQA from "./NumericQA";
import axios from "axios";

function SubmittedAdminPage(props) {
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
    existingAnswers,
    updatedAnswers,
    setUpdatedAnswers,
    BACKEND_URL,
    setIsAnswering,
  } = useQuestion();

  useEffect(() => {
    setUpdatedAnswers(selectedAnswers);
    localStorage.removeItem("authToken");
  }, []);

  async function handleNewAnswerInput(id, type, newAnswer) {
    if (type === "checkbox") {
      const checkboxValue = newAnswer.target.checked ? "checked" : "unchecked";
      newAnswer = checkboxValue;
    }
    setUpdatedAnswers((prevAnswers) => {
      const updated = prevAnswers.map((answer) => {
        if (answer.question_id === id) {
          console.log(`Updating question ${id} with newAnswer: ${newAnswer}`);
          return {
            ...answer,
            answer_text:
              answer.answer_numeric === null ? newAnswer : answer.answer_text,
            answer_numeric: answer.answer_numeric === null ? null : newAnswer,
          };
        }
        return answer;
      });

      const answerExists = prevAnswers.some(
        (answer) => answer.question_id === id
      );

      if (!answerExists) {
        updated.push({
          question_id: id,
          user_id: updatedAnswers[0].user_id,
          answer_text: type !== "numeric answer" ? newAnswer : null,
          answer_numeric: type == "numeric answer" ? newAnswer : null,
          template_id: updatedAnswers[0].template_id,
          form_id: updatedAnswers[0].form_id,
        });
      }
      return updated;
    });
  }

  async function handleUpdateAnswers() {
    try {
      const response = await axios.put(`${BACKEND_URL}/updateForm`, {
        updatedAnswers,
      });
      console.log(response.data.message);
      alert("Answers correctly updated.");
    } catch (error) {
      console.error("Error updating answers.", error);
    }
  }

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
              const safeUpdatedAnswers = Array.isArray(updatedAnswers)
                ? updatedAnswers
                : [];

              const answer = safeUpdatedAnswers.find(
                (element) => element.question_id === question.id
              );
              if (question.question_type == "short answer") {
                return (
                  <ShortQA
                    id={question.id}
                    key={question.id}
                    type={question.question_type}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "(No answer provided)"
                    }
                    value={
                      updatedAnswers.find(
                        (ans) => ans.question_id === question.id
                      )?.answer_text || ""
                    }
                    handleNewAnswerInput={handleNewAnswerInput}
                    existingAnswers={existingAnswers}
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "paragraph") {
                return (
                  <ParagraphQA
                    id={question.id}
                    key={question.id}
                    type={question.question_type}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "(No answer provided)"
                    }
                    value={
                      updatedAnswers.find(
                        (ans) => ans.question_id === question.id
                      )?.answer_text || ""
                    }
                    handleNewAnswerInput={handleNewAnswerInput}
                    existingAnswers={existingAnswers}
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "checkbox") {
                return (
                  <CheckboxQA
                    id={question.id}
                    type={question.question_type}
                    key={question.id}
                    qText={question.question_text}
                    aText={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_text
                        : "unchecked"
                    }
                    value={
                      answer?.answer_text === "checked"
                        ? "checked"
                        : "unchecked"
                    }
                    checkbox={question.options}
                    handleNewAnswerInput={handleNewAnswerInput}
                    existingAnswers={existingAnswers}
                    currentUser={currentUser}
                  />
                );
              } else if (question.question_type == "numeric answer") {
                return (
                  <NumericQA
                    id={question.id}
                    key={question.id}
                    type={question.question_type}
                    qText={question.question_text}
                    aNumeric={
                      selectedAnswers[index]
                        ? selectedAnswers[index].answer_numeric
                        : "(No answer provided)"
                    }
                    value={
                      updatedAnswers.find(
                        (ans) => ans.question_id === question.id
                      )?.answer_numeric || ""
                    }
                    handleNewAnswerInput={handleNewAnswerInput}
                    existingAnswers={existingAnswers}
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
        <button className="formCreated" onClick={handleUpdateAnswers}>
          Update answers
        </button>
      </div>
    </div>
  );
}

SubmittedAdminPage.defaultProps = {
  questions: [],
};

export default SubmittedAdminPage;
