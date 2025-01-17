import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import { useQuestion } from "./QuestionContext";
import SearchBar from "./SearchBar";
import { useEffect } from "react";

function FillingAdminPage() {
  const navigate = useNavigate();

  const {
    templates,
    setTemplates,
    newFormPage,
    currentUser,
    setCurrentUser,
    goToUserManager,
    backToManager,
    setIsAnswering,
    goToCreateSFAccount,
  } = useQuestion();

  function handleLogout() {
    setCurrentUser(null);
    setIsAnswering(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser");
    setCurrentUser(loggedUser ? JSON.parse(loggedUser) : null);

    try {
      const userTemplates = localStorage.getItem("templates");
      setTemplates(userTemplates ? JSON.parse(userTemplates) : []);
    } catch (error) {
      console.error("Invalid templates JSON:", error);
      setTemplates([]);
    }
  }, []);

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="adminMessage">ADMIN CONTROL PANEL</div>
          <div className="welcomeMessage">
            Hi, {currentUser?.name || "Guest"}
          </div>
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
          <button className="publicForms" onClick={goToCreateSFAccount}>
            Link to SaleForce
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
        {templates.map((template, index) => {
          return (
            <FormItem
              key={index}
              id={template.id}
              name={template.name}
              author={template.author_name}
              date={template.creation_date}
              last_update={template.last_update}
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
