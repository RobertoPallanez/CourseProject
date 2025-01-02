import "./App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import ShortSubmit from "./ShortSubmit";
import ParaSubmit from "./ParaSubmit";
import CheckSubmit from "./CheckSubmit";
import NumericSubmit from "./NumericSubmit";
import axios from "axios";

function AnswerFormPage(props) {
  const navigate = useNavigate();
  const [answersToSubmit, setAnswersToSubmit] = useState([]);

  function handleLogout() {
    setCurrentUser(null);
    setQuestions([]);
    navigate("/");
  }

  const {
    questions,
    setQuestions,
    deleteQuestion,
    selectedTemplate,
    backToManager,
    deleteFromSelected,
    currentUser,
    setCurrentUser,
    selectedQuestions,
    existingAnswers,
    BACKEND_URL,
  } = useQuestion();

  useEffect(() => {
    const initialAnswers = selectedQuestions.map((question) => ({
      questionId: question.id,
      userId: currentUser !== null ? currentUser.id : Number(44),
      userName: currentUser !== null ? currentUser.name : "Unregistered User",
      userEmail: currentUser !== null ? currentUser.email : null,
      templateId: selectedTemplate.id,
      answerText: question.question_type === "checkbox" ? "unchecked" : null,
      answerNumeric: question.question_type === "numeric answer" ? null : null,
    }));

    setAnswersToSubmit(initialAnswers);
  }, [questions, currentUser, selectedTemplate]);

  function handleAnswerInputChange(questionId, questionType, event) {
    const value =
      questionType === "checkbox"
        ? event.target.checked
          ? "checked"
          : "unchecked"
        : event.target.value;

    setAnswersToSubmit((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.questionId === questionId
      );

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        if (questionType === "numeric answer") {
          updatedAnswers[existingAnswerIndex].answerNumeric = value; // Update numeric answer
        } else {
          updatedAnswers[existingAnswerIndex].answerText = value; // Update text answer
        }
        return updatedAnswers;
      } else {
        return [
          ...prevAnswers,
          {
            questionId: questionId,
            userId: currentUser !== null ? currentUser.id : Number(44),
            userName:
              currentUser !== null ? currentUser.name : "Unregistered User",
            userEmail: currentUser !== null ? currentUser.email : null,
            templateId: selectedTemplate.id,
            answerText:
              questionType !== "numeric answer"
                ? questionType == "checkboxes"
                  ? event.target.checked
                    ? "checked"
                    : "unchecked"
                  : value
                : null,
            answerNumeric: questionType == "numeric answer" ? value : null,
          },
        ];
      }
    });
  }

  async function handleSubmitAnswers() {
    try {
      const response = await axios.post(`${BACKEND_URL}/submitAnswers`, {
        answersToSubmit,
      });

      console.log(response.data.message);
      alert("Form successfuly submitted. Thanks for your answers.");
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
      console.error("Error submitting answers.", error);
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
        <div className="currentFormHeaderText">
          {selectedTemplate ? selectedTemplate.name : null}
        </div>
        <div className="currentDescriptionHeaderText">
          {selectedTemplate ? selectedTemplate.description : null}
        </div>
        <div className="topicHeader">
          {selectedTemplate ? selectedTemplate.topic : null}
        </div>
        <div
          className="imageContainer"
          style={{
            display: selectedTemplate
              ? selectedTemplate.image_url
                ? "flex"
                : "none"
              : null,
          }}
        >
          <p className="imageHeader">Reference Image:</p>
          <img
            src={selectedTemplate ? selectedTemplate.image_url : null}
            className="templateImage"
            alt="Template Image"
          />
        </div>
        {selectedQuestions.map((question, index) => {
          if (question.question_type == "short answer") {
            return (
              <ShortSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                templateId={selectedTemplate ? selectedTemplate.id : null}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleAnswerInputChange={handleAnswerInputChange}
                existingAnswers={existingAnswers}
                value=""
              />
            );
          } else if (question.question_type == "paragraph") {
            return (
              <ParaSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                templateId={selectedTemplate ? selectedTemplate.id : null}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleAnswerInputChange={handleAnswerInputChange}
                existingAnswers={existingAnswers}
                value=""
              />
            );
          } else if (question.question_type == "checkbox") {
            return (
              <CheckSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                templateId={selectedTemplate ? selectedTemplate.id : null}
                checkboxes={question.options}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleAnswerInputChange={handleAnswerInputChange}
                existingAnswers={existingAnswers}
                value=""
              />
            );
          } else if (question.question_type == "numeric answer") {
            return (
              <NumericSubmit
                id={question.id}
                key={question.id}
                text={question.question_text}
                type={question.question_type}
                templateId={selectedTemplate ? selectedTemplate.id : null}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
                selectedTemplate={selectedTemplate}
                handleAnswerInputChange={handleAnswerInputChange}
                existingAnswers={existingAnswers}
                value=""
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
            <button className="formCreated" onClick={handleSubmitAnswers}>
              Submit answers
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AnswerFormPage;
