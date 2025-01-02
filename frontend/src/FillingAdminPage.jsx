import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import { useQuestion } from "./QuestionContext";
import SearchBar from "./SearchBar";

function FillingAdminPage() {
  const navigate = useNavigate();

  const {
    templates,
    newFormPage,
    currentUser,
    setCurrentUser,
    goToUserManager,
    backToManager,
  } = useQuestion();

  function handleLogout() {
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="adminMessage">ADMIN CONTROL PANEL</div>
          <div className="welcomeMessage">Hi, {currentUser.name}</div>
          <div className="createMessage">
            Pick one of all users templates to submit your answers:
          </div>
        </div>
        <div className="formsAndUsers">
          <button className="adminForms" onClick={backToManager}>
            templates
          </button>
          <button className="adminUsers" onClick={goToUserManager}>
            users
          </button>
          <button className="adminForms">submit a form</button>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
        <SearchBar />
      </div>
      <div className="formsContainer">
        {templates.map((template, index) => {
          return (
            <FormItem
              key={index}
              id={template.id}
              name={template.name}
              author={template.author_name}
              date={template.creation_date}
              topic={template.topic}
              questions={template.questions}
              newFormPage={newFormPage}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FillingAdminPage;
