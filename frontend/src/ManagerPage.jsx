import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import CreateForm from "./CreateForm";
import { useQuestion } from "./QuestionContext";
import SearchBar from "./SearchBar";
import { useEffect } from "react";

function ManagerPage() {
  const navigate = useNavigate();

  const {
    input,
    handleQuestionInput,
    type,
    handleQuestionType,
    question,
    addQuestion,
    questions,
    checkboxInput,
    handleCheckboxInput,
    checkboxes,
    addCheckbox,
    deleteQuestion,
    templates,
    setTemplates,
    newFormPage,
    currentUser,
    setCurrentUser,
    setIsAnswering,
    goToFillingPage,
  } = useQuestion();

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser");
    setCurrentUser(loggedUser ? JSON.parse(loggedUser) : null);

    const userTemplates = localStorage.getItem("templates");
    setTemplates(
      userTemplates
        ? userTemplates !== undefined
          ? JSON.parse(userTemplates)
          : []
        : null
    );
  }, []);

  function handleLogout() {
    setIsAnswering(false);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="roleMessage">USER CONTROL PANEL</div>
          <div className="welcomeMessage">
            Hi, {currentUser?.name || "Guest"}
          </div>
          <div className="createMessage">
            Pick one of your forms or start a new
          </div>
        </div>
        <div className="myTemplatesAndPublicForms">
          <button className="userTemplates">My templates</button>
          <button className="publicForms" onClick={goToFillingPage}>
            Public Forms
          </button>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
        <SearchBar />
      </div>
      <div className="formsContainer">
        <CreateForm
          input={input}
          type={type}
          questions={questions}
          question={question}
          checkboxInput={checkboxInput}
          checkboxes={checkboxes}
          handleQuestionInput={handleQuestionInput}
          handleQuestionType={handleQuestionType}
          addQuestion={addQuestion}
          handleCheckboxInput={handleCheckboxInput}
          addCheckbox={addCheckbox}
          deleteQuestion={deleteQuestion}
        />
        {templates.map((template, index) => {
          return (
            <FormItem
              key={template.id}
              id={template.id}
              name={template.name}
              author={template.author_name}
              date={template.creation_date}
              last_update={template.last_update}
              questions={template.questions}
              topic={template.topic}
              newFormPage={newFormPage}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ManagerPage;
