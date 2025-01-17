import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FormItem from "./FormItem";
import CreateForm from "./CreateForm";
import { useQuestion } from "./QuestionContext";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Button, Typography, Box, TextField, Tooltip } from "@mui/material";

function AdminPage() {
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setTemplates,
    goToCreateSFAccount,
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

  const handleToggleToken = () => {
    setShowToken(!showToken);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUser.odoo_token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  function handleLogout() {
    setCurrentUser(null);
    setIsAnswering(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogoutAdmin">
        <div className="messagesAdmin">
          <div className="adminMessage">ADMIN CONTROL PANEL</div>
          <div className="welcomeMessageAdmin">
            Hi, {currentUser?.name || "Guest"}
          </div>
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
          <button className="publicForms" onClick={goToCreateSFAccount}>
            Link to SaleForce
          </button>
        </div>
        <Box
          className="tokenBox"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 1,
          }}
        >
          <Button
            className="showTokenButton"
            variant="contained"
            size="small"
            onClick={handleToggleToken}
            sx={{ marginLeft: 2 }}
          >
            {showToken ? "Hide oddo Token" : "Show odoo Token"}
          </Button>
          <Tooltip className="clipboardTooltip" arrow>
            <Button
              className="clipboardButton"
              onClick={copyToClipboard}
              variant="outlined"
              color={copied ? "success" : "primary"}
              style={{
                maxWidth: "30px",
                flexShrink: 1,
                fontSize: "0.50rem",
                fontWeight: "bold",
                marginRight: "10px",
                color: "white",
                backgroundColor: copied ? "green" : "#361164",
                display: showToken ? "flex" : "none",
              }}
            >
              {copied ? (
                "Copied!"
              ) : (
                <img src="copyToClipboardIcon.svg" className="clipboardIcon" />
              )}
            </Button>
          </Tooltip>
          <Typography
            className="tokenTypo"
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: showToken ? "text.primary" : "text.disabled",
              fontSize: "0.75rem",
              whiteSpace: "nowrap", // Prevent text from wrapping to the next line
              overflow: "hidden", // Hide the overflowing text
              textOverflow: "ellipsis",
            }}
          >
            {showToken ? currentUser.odoo_token : "************"}
          </Typography>
        </Box>
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

export default AdminPage;
