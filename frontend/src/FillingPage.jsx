import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import { useQuestion } from "./QuestionContext";
import SearchBarPublic from "./SearchBarPublic";

function FillingPage() {
  const navigate = useNavigate();

  const {
    templates,
    newFormPage,
    currentUser,
    setCurrentUser,
    backToManager,
    setIsAnswering,
    answerFormPage,
  } = useQuestion();

  function handleLogout() {
    setCurrentUser(null);
    setIsAnswering(false);
    navigate("/");
  }

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="roleMessage">FORMS LIST</div>
          <div className="welcomeMessage">
            Below, you can see all the available public forms
          </div>
          <div className="createMessage">
            Pick one of these public forms to asnwer
          </div>
        </div>
        {currentUser ? (
          <div className="myTemplatesAndPublicForms">
            <button className="userTemplates" onClick={backToManager}>
              My templates
            </button>
            <button className="publicForms">Public Forms</button>
          </div>
        ) : null}
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Exit
          </div>
        </div>
        <SearchBarPublic />
      </div>
      <div className="formsContainer">
        {templates.map((template, index) => {
          return (
            <FormItem
              key={template.id}
              id={template.id}
              name={template.name}
              author={template.author_name}
              date={template.creation_date}
              topic={template.topic}
              questions={template.questions}
              newFormPage={newFormPage}
              answerFormPage={answerFormPage}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FillingPage;
