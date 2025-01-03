import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import CreateForm from "./CreateForm";
import { useQuestion } from "./QuestionContext";
import SearchBar from "./SearchBar";

function AdminPage() {
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
    newFormPage,
    currentUser,
    setCurrentUser,
    goToUserManager,
    goToFillingAdminPage,
    setIsAnswering,
  } = useQuestion();

  function handleLogout() {
    setCurrentUser(null);
    navigate("/");
    setIsAnswering(false);
  }

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogoutAdmin">
        <div className="messagesAdmin">
          <div className="adminMessage">ADMIN CONTROL PANEL</div>
          <div className="welcomeMessageAdmin">Hi, {currentUser.name}</div>
          <div className="createMessageAdmin">
            <strong>Pick one of all users templates or start a new:</strong>
          </div>
        </div>
        <div className="formsAndUsers">
          <button className="adminForms">templates</button>
          <button className="adminUsers" onClick={goToUserManager}>
            users
          </button>
          <button className="adminForms" onClick={goToFillingAdminPage}>
            submit a form
          </button>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
        <SearchBar />
      </div>
      <div className="formsContainerAdmin">
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

export default AdminPage;
