import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import ShortSubmit from "./ShortSubmit";
import ParaSubmit from "./ParaSubmit";
import CheckSubmit from "./CheckSubmit";
import NumericSubmit from "./NumericSubmit";
import axios from "axios";

function ModifyAnswersPage(props) {
  const navigate = useNavigate();

  function handleLogout() {
    setCurrentUser(null);
    setQuestions([]);
    setIsAnswering(false);
    navigate("/");
  }

  const {
    setQuestions,
    deleteQuestion,
    selectedTemplate,
    backToManager,
    deleteFromSelected,
    currentUser,
    setCurrentUser,
    selectedQuestions,
    existingAnswers,
    updatedAnswers,
    setUpdatedAnswers,
    setSelectedForm,
    BACKEND_URL,
    setIsAnswering,
  } = useQuestion();

  useEffect(() => {
    setSelectedForm(null);
    setUpdatedAnswers(existingAnswers);
  }, []);

  function handleNewAnswerInput(id, type, newAnswer) {
    if (type === "checkbox") {
      const checkboxValue = newAnswer.target.checked ? "checked" : "unchecked";
      newAnswer = checkboxValue;
    }
    setUpdatedAnswers((prevAnswers) => {
      const updated = prevAnswers.map((answer) => {
        if (answer.question_id === id) {
          return {
            ...answer,
            // Update answer_text if the answer is text-based
            answer_text:
              answer.answer_numeric === null ? newAnswer : answer.answer_text,
            // Nullify answer_numeric if we're updating answer_text
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
      alert("Answers correctly updated.");
      if (currentUser !== null) {
        if (currentUser.role == "user") {
          navigate("/FillingPage");
        } else if (currentUser.role == "admin") {
          navigate("/FillingAdminPage");
        }
      } else {
        navigate("/FillingPage");
      }
    } catch (error) {
      console.error("Error updating answers.", error);
    }
  }

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="roleMessage">FORM SUBMIT</div>
          <div className="welcomeMessage">
            Thank you for taking the time to answer these questions
          </div>
          <div className="createMessage">
            Please, answer the following questions
          </div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Exit
          </div>
        </div>
      </div>
      {/* /QUESTIONS CONTAINER/ */}
      <div className="questionsContainer">
        <div className="currentFormHeaderText">{selectedTemplate.name}</div>
        <div className="currentDescriptionHeaderText">
          {selectedTemplate.description}
        </div>
        <div className="topicHeader">{selectedTemplate.topic}</div>
        <div
          className="imageContainer"
          style={{ display: selectedTemplate.image_url ? "flex" : "none" }}
        >
          <p className="imageHeader">Reference Image:</p>
          <img
            src={selectedTemplate.image_url}
            className="templateImage"
            alt="Template Image"
          />
        </div>
        {selectedQuestions.map((question, index) => {
          const safeUpdatedAnswers = Array.isArray(updatedAnswers)
            ? updatedAnswers
            : [];

          const answer = safeUpdatedAnswers.find(
            (element) => element.question_id === question.id
          );

          if (question.question_type == "short answer") {
            return (
              <ShortSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                value={
                  updatedAnswers.find((ans) => ans.question_id === question.id)
                    ?.answer_text || ""
                }
                templateId={selectedTemplate.id}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleNewAnswerInput={handleNewAnswerInput}
                existingAnswers={existingAnswers}
              />
            );
          } else if (question.question_type == "paragraph") {
            return (
              <ParaSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                value={
                  updatedAnswers.find((ans) => ans.question_id === question.id)
                    ?.answer_text || ""
                }
                templateId={selectedTemplate.id}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleNewAnswerInput={handleNewAnswerInput}
                existingAnswers={existingAnswers}
              />
            );
          } else if (question.question_type == "checkbox") {
            return (
              <CheckSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                value={
                  answer?.answer_text === "checked" ? "checked" : "unchecked"
                }
                templateId={selectedTemplate.id}
                checkboxes={question.options}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleNewAnswerInput={handleNewAnswerInput}
                existingAnswers={existingAnswers}
              />
            );
          } else if (question.question_type == "numeric answer") {
            return (
              <NumericSubmit
                id={question.id}
                key={question.id}
                number={question.answer_numeric}
                type={question.question_type}
                value={
                  updatedAnswers.find((ans) => ans.question_id === question.id)
                    ?.answer_numeric || ""
                }
                templateId={selectedTemplate.id}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleNewAnswerInput={handleNewAnswerInput}
                existingAnswers={existingAnswers}
              />
            );
          }
        })}
      </div>
      <div className="createOrBackButton">
        {selectedTemplate.readOnly ? (
          <div className="declineContainer">
            <p className="declineMessage">
              Only registered users can answer this form.
            </p>
            <button
              title="back"
              className="backToManagerButton"
              onClick={backToManager}
            >
              <img className="ESAIcon" src="backIcon.svg" />
            </button>
          </div>
        ) : (
          <>
            <button
              title="back"
              className="backToManagerButton"
              onClick={backToManager}
            >
              <img className="ESAIcon" src="backIcon.svg" />
            </button>
            <button className="formCreated" onClick={handleUpdateAnswers}>
              Update answers
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ModifyAnswersPage;
