import "./App.css";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import { v4 as uuidv4 } from "uuid";
import ShortAnswer from "./ShortAnswer";
import Paragraph from "./Paragraph";
import Checkboxes from "./Checkboxes";
import NumericAnswer from "./NumericAnswer";

function NewForm(props) {
  const navigate = useNavigate();

  function handleLogout() {
    setQuestions([]);
    setCurrentUser(null);
    setIsAnswering(false);
    navigate("/");
  }

  const {
    input,
    tagInput,
    handleQuestionInput,
    type,
    handleQuestionType,
    addQuestion,
    questions,
    setQuestions,
    checkboxInput,
    handleCheckboxInput,
    checkboxes,
    addCheckbox,
    deleteQuestion,
    formName,
    templateDescription,
    addForm,
    handleFormName,
    handleTemplateDescription,
    selectedTemplate,
    backToManager,
    currentUser,
    setCurrentUser,
    handleTemplateTopic,
    handleTagInput,
    addTag,
    tags,
    deleteTag,
    handleImageChange,
    handleSubmissionMode,
    setIsAnswering,
  } = useQuestion();

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="roleMessage">TEMPLATE CREATOR</div>
          <div className="welcomeMessage">Hi, {currentUser.name}</div>
          <div className="createMessage">
            {selectedTemplate
              ? "Rename your template or add more questions"
              : "Name your template and type your questions:"}
          </div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
      </div>
      {/* QUESTIONS CREATOR */}
      {!selectedTemplate ? (
        <>
          <input
            className="formNameInput"
            placeholder="Template name"
            onChange={handleFormName}
          />
          <input
            className="formNameInput"
            placeholder="Template description"
            onChange={handleTemplateDescription}
          />
          <div className="templateAndTopicContainer">
            <div className="templateTopic">Choose a topic:</div>
            <select
              className="templateTopicSelector"
              onChange={handleTemplateTopic}
            >
              <option className="templateTopicOption" value="General">
                General
              </option>
              <option className="templateTopicOption" value="Work">
                Work
              </option>
              <option className="templateTopicOption" value="Education">
                Education/School
              </option>
              <option className="templateTopicOption" value="Personal">
                Personal
              </option>
              <option className="templateTopicOption" value="interests">
                Interests and hobbies
              </option>
              <option className="templateTopicOption" value="preferences">
                Preferences and Tastes
              </option>
              <option className="templateTopicOption" value="Lifestyle">
                Lifestyle
              </option>
              <option className="templateTopicOption" value="Health">
                Health
              </option>
              <option className="templateTopicOption" value="travel">
                Geography and Travel
              </option>
              <option className="templateTopicOption" value="Technology">
                Technology
              </option>
              <option className="templateTopicOption" value="Science">
                Science
              </option>
              <option className="templateTopicOption" value="Culture">
                Culture
              </option>
              <option className="templateTopicOption" value="Entertainment">
                Entertainment
              </option>
              <option className="templateTopicOption" value="Sports">
                Sports
              </option>
              <option className="templateTopicOption" value="Food">
                Food
              </option>
              <option className="templateTopicOption" value="Fashion">
                Fashion
              </option>
              <option className="templateTopicOption" value="Art">
                Art
              </option>
              <option className="templateTopicOption" value="Music">
                Music
              </option>
              <option className="templateTopicOption" value="Literature">
                Literature
              </option>
              <option className="templateTopicOption" value="History">
                History
              </option>
              <option className="templateTopicOption" value="Politics">
                Politics
              </option>
              <option className="templateTopicOption" value="relationships">
                Relationships and Social life
              </option>
              <option className="templateTopicOption" value="other">
                Other
              </option>
            </select>
            <div className="templateTopic">
              Allow submits by unregistered users?
            </div>
            <select
              className="allowSubmitsSelector"
              onChange={handleSubmissionMode}
            >
              <option className="templateTopicOption" value={false}>
                Yes
              </option>
              <option className="templateTopicOption" value={true}>
                No
              </option>
            </select>
            <div className="templateTopic">Upload an image (optional):</div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
            />
            <div className="tagsCreator">
              <input
                className="tagInput"
                placeholder="Type a tag.."
                onChange={handleTagInput}
                value={tagInput}
              />
              <button className="addButton" onClick={addTag}>
                Add
              </button>
            </div>
          </div>
          <div className="questionsCreator">
            <div className="questionFormat">
              {type !== "checkbox" ? (
                <input
                  className="questionInput"
                  placeholder="Type your question.."
                  onChange={handleQuestionInput}
                  value={input}
                />
              ) : (
                <>
                  <input
                    className="questionInput"
                    placeholder="Type your question.."
                    onChange={handleQuestionInput}
                    value={input}
                  />
                  <div className="multichoiceContainer">
                    <input
                      type="checkbox"
                      value="checkbox"
                      className="multichoiceOptions"
                      id="checkbox"
                    />
                    <input
                      className="multichoiceLabels"
                      placeholder="Type an option"
                      onChange={handleCheckboxInput}
                      value={checkboxInput}
                    />
                  </div>
                  {checkboxes.map((checkbox) => {
                    return (
                      <div className="multichoiceContainer" key={uuidv4()}>
                        <input
                          type="checkbox"
                          value={checkboxes.length + 1}
                          className="multichoiceOptions"
                          id={checkboxes.length + 1}
                        />
                        <span
                          className="multichoiceLabels"
                          value={checkboxInput}
                        >
                          {checkbox}
                        </span>
                      </div>
                    );
                  })}
                  <button className="addCheckboxButton" onClick={addCheckbox}>
                    +
                  </button>
                </>
              )}
            </div>
            <select
              className="questionTypeSelector"
              onChange={handleQuestionType}
            >
              <option className="questionOption" value="short answer">
                short answer
              </option>
              <option className="questionOption" value="paragraph">
                paragraph
              </option>
              <option className="questionOption" value="checkbox">
                checkbox
              </option>
              <option className="questionOption" value="numeric answer">
                numeric answer
              </option>
            </select>
            <button className="addButton" onClick={addQuestion}>
              Add
            </button>
          </div>
        </>
      ) : null}
      {/* QUESTIONS CONTAINER */}
      <div className="questionsContainer">
        <div className="formPreview">Template Previewer</div>
        {!selectedTemplate ? (
          <div className="currentFormHeader">{formName}</div>
        ) : null}
        {!selectedTemplate ? (
          <div className="currentDescriptionHeader">{templateDescription}</div>
        ) : null}
        {questions.map((question, index) => {
          if (question.type == "short answer") {
            return (
              <ShortAnswer
                id={index}
                key={uuidv4()}
                text={question.text}
                type={question.type}
                deleteQuestion={deleteQuestion}
                selectedForm={selectedTemplate}
              />
            );
          } else if (question.type == "paragraph") {
            return (
              <Paragraph
                id={index}
                key={uuidv4()}
                text={question.text}
                type={question.type}
                deleteQuestion={deleteQuestion}
                selectedForm={selectedTemplate}
              />
            );
          } else if (question.type == "checkbox") {
            return (
              <Checkboxes
                id={index}
                key={uuidv4()}
                text={question.text}
                type={question.type}
                checkboxes={checkboxes}
                deleteQuestion={deleteQuestion}
                selectedForm={selectedTemplate}
              />
            );
          } else if (question.type == "numeric answer") {
            return (
              <NumericAnswer
                id={index}
                key={uuidv4()}
                text={question.text}
                type={question.type}
                deleteQuestion={deleteQuestion}
                selectedForm={selectedTemplate}
              />
            );
          }
        })}
      </div>
      <div className="tagsContainer">
        {tags.map((tag, index) => {
          return (
            <div key={index} className="tag" id={index}>
              {tag}
              <div className="deleteTag" onClick={() => deleteTag(index)}>
                x
              </div>
            </div>
          );
        })}
      </div>
      <div className="createOrBackButton">
        <button
          title="back"
          className="backToManagerButton"
          onClick={backToManager}
        >
          <img className="ESAIcon" src="backIcon.svg" />
        </button>
        <button
          title="create template"
          className="formCreated"
          onClick={addForm}
        >
          <img className="ESAIcon" src="createIcon.svg" />
        </button>
      </div>
    </div>
  );
}

NewForm.defaultProps = {
  questions: [],
};

export default NewForm;
