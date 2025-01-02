import "./App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import { v4 as uuidv4 } from "uuid";
import ShortAnswer from "./ShortAnswer";
import Paragraph from "./Paragraph";
import Checkboxes from "./Checkboxes";
import NumericAnswer from "./NumericAnswer";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TemplatePage(props) {
  const navigate = useNavigate();

  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [questionsToDelete, setQuestionsToDelete] = useState([]);
  const [tagsToDelete, setTagsToDelete] = useState([]);

  const {
    input,
    handleQuestionInput,
    tagInput,
    handleTagInput,
    type,
    handleQuestionType,
    addQuestion,
    addTag,
    questions,
    setTags,
    tags,
    setQuestions,
    checkboxInput,
    handleCheckboxInput,
    checkboxes,
    addCheckbox,
    deleteQuestion,
    deleteTag,
    selectedTemplate,
    selectedQuestions,
    updatedQuestions,
    setUpdatedQuestions,
    updatedTags,
    setUpdatedTags,
    selectedTags,
    backToManager,
    deleteTemplate,
    deleteFromSelected,
    currentUser,
    setCurrentUser,
    setSelectedForm,
    goToAnalyticsPage,
    goToSubmitHistoryPage,
    BACKEND_URL,
    setIsAnswering,
  } = useQuestion();

  useEffect(() => {
    setSelectedForm(null);
    setUpdatedName(selectedTemplate.name);
    setUpdatedDescription(selectedTemplate.description);
    setUpdatedQuestions(selectedQuestions);
    setUpdatedTags(selectedTags);
  }, []);

  function handleLogout() {
    setQuestions([]);
    setTags([]);
    setCurrentUser(null);
    setSelectedForm(null);
    setIsAnswering(false);
    navigate("/");
  }

  function handleInputChange(id, newQuestion) {
    setUpdatedQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id
          ? { ...question, question_text: newQuestion }
          : question
      )
    );
  }

  function handleNameChange(e) {
    const newName = e.target.value;
    setUpdatedName(newName);
  }

  function handleDescriptionChange(e) {
    const newDescription = e.target.value;
    setUpdatedDescription(newDescription);
  }

  function handleDragEnd(result) {
    const { destination, source } = result;

    // If dropped outside a valid destination or no movement, do nothing
    if (!destination || destination.index === source.index) return;

    // Reorder the updatedQuestions array
    const reorderedQuestions = Array.from(updatedQuestions);
    const [movedQuestion] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, movedQuestion);

    setUpdatedQuestions(reorderedQuestions); // Update with reordered list
  }

  async function handleSaveChanges() {
    try {
      // Update the `order` property for questions in `updatedQuestions`
      const reorderedQuestions = updatedQuestions.map((q, index) => ({
        ...q,
        order: index + 1, // Assign new order values starting from 1
      }));

      const response = await axios.put(`${BACKEND_URL}/updateTemplate`, {
        updatedQuestions: reorderedQuestions,
        updatedName,
        updatedDescription,
        templateId: selectedTemplate.id,
        deletedQuestions: questionsToDelete,
        deletedTags: tagsToDelete,
      });

      const questionsUpdated = response.data.remainingQuestions;
      const tagsUpdated = response.data.remainingTags;
      setUpdatedQuestions(questionsUpdated);
      setUpdatedTags(tagsUpdated);
      setQuestions([]);
      alert("Changes saved successfully.");
      backToManager();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }

  function handleQuestionsToDelete(id) {
    setQuestionsToDelete((prevQuestions) =>
      prevQuestions.includes(id)
        ? prevQuestions.filter((existingId) => existingId !== id)
        : [...prevQuestions, id]
    );
  }

  function handleTagsToDelete(id) {
    setTagsToDelete((prevTags) =>
      prevTags.includes(id)
        ? prevTags.filter((existingId) => existingId !== id)
        : [...prevTags, id]
    );
  }

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="templateEditor">TEMPLATE EDITOR</div>
        <div className="editorAndSubmitButtons">
          <button title="editor">
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
            Rename your template, add, edit or delete your questions
          </div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
      </div>
      {/* QUESTIONS CREATOR */}
      <>
        <div className="tagsAdder">
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
                      <span className="multichoiceLabels" value={checkboxInput}>
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
      {/* QUESTIONS CONTAINER */}
      <div className="questionsContainer">
        <input
          className="currentFormHeader"
          key={selectedTemplate.name}
          value={updatedName}
          onChange={handleNameChange}
        />
        <textarea
          className="currentDescriptionHeader"
          key={selectedTemplate.description}
          value={updatedDescription}
          onChange={handleDescriptionChange}
          wrap="soft"
        />
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {updatedQuestions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {question.question_type === "short answer" && (
                          <ShortAnswer
                            id={index}
                            key={question.id}
                            value={
                              updatedQuestions.find(
                                (element) => element.id === question.id
                              )?.question_text || ""
                            }
                            handleInputChange={handleInputChange}
                            questionId={question.id}
                            text={question.question_text}
                            type={question.question_type}
                            questionsToDelete={questionsToDelete}
                            handleQuestionsToDelete={handleQuestionsToDelete}
                            deleteQuestion={deleteQuestion}
                            deleteFromSelected={deleteFromSelected}
                            selectedForm={selectedTemplate}
                          />
                        )}
                        {question.question_type === "paragraph" && (
                          <Paragraph
                            id={index}
                            selectedId={question.id}
                            key={question.id}
                            value={
                              updatedQuestions.find(
                                (element) => element.id === question.id
                              )?.question_text || ""
                            }
                            handleInputChange={handleInputChange}
                            questionId={question.id}
                            text={question.question_text}
                            type={question.question_type}
                            questionsToDelete={questionsToDelete}
                            handleQuestionsToDelete={handleQuestionsToDelete}
                            deleteQuestion={deleteQuestion}
                            deleteFromSelected={deleteFromSelected}
                            selectedForm={selectedTemplate}
                          />
                        )}
                        {question.question_type === "checkbox" && (
                          <Checkboxes
                            id={index}
                            selectedId={question.id}
                            key={question.id}
                            value={
                              updatedQuestions.find(
                                (element) => element.id === question.id
                              )?.question_text || ""
                            }
                            handleInputChange={handleInputChange}
                            questionId={question.id}
                            text={question.question_text}
                            type={question.question_type}
                            questionsToDelete={questionsToDelete}
                            handleQuestionsToDelete={handleQuestionsToDelete}
                            checkboxes={question.options}
                            deleteQuestion={deleteQuestion}
                            deleteFromSelected={deleteFromSelected}
                            selectedForm={selectedTemplate}
                          />
                        )}
                        {question.question_type === "numeric answer" && (
                          <NumericAnswer
                            id={index}
                            selectedId={question.id}
                            key={question.id}
                            value={
                              updatedQuestions.find(
                                (element) => element.id === question.id
                              )?.question_text || ""
                            }
                            handleInputChange={handleInputChange}
                            questionId={question.id}
                            text={question.question_text}
                            type={question.question_type}
                            questionsToDelete={questionsToDelete}
                            handleQuestionsToDelete={handleQuestionsToDelete}
                            deleteQuestion={deleteQuestion}
                            deleteFromSelected={deleteFromSelected}
                            selectedForm={selectedTemplate}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* NEW ADDED QUESTIONS */}
        {questions.map((question, index) => {
          if (question.type == "short answer") {
            return (
              <ShortAnswer
                id={index}
                key={uuidv4()}
                handleInputChange={handleInputChange}
                questionId={question.id}
                value={question.text}
                text={question.text}
                type={question.type}
                questionsToDelete={questionsToDelete}
                handleQuestionsToDelete={handleQuestionsToDelete}
                deleteQuestion={deleteQuestion}
                deleteFromSelected={deleteFromSelected}
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
        {updatedTags.map((tag, index) => {
          return (
            <div
              key={index}
              className="tag"
              id={index}
              style={{
                textDecoration: selectedTemplate
                  ? tagsToDelete.includes(tag.id)
                    ? "line-through"
                    : "none"
                  : null,
                color: selectedTemplate
                  ? tagsToDelete.includes(tag.id)
                    ? "#721c24"
                    : "#000000"
                  : null,
              }}
            >
              {tag.tag}
              <div
                className="deleteTag"
                onClick={() => {
                  selectedTemplate
                    ? handleTagsToDelete(tag.id)
                    : deleteTag(tag.id);
                }}
              >
                x
              </div>
            </div>
          );
        })}
        {/* NEW ADDED TAGS */}
        {tags.map((tag, index) => {
          return (
            <div
              key={index}
              className="tag"
              id={index}
              style={{
                textDecoration: selectedTemplate
                  ? tagsToDelete.includes(tag.id)
                    ? "line-through"
                    : "none"
                  : null,
                color: selectedTemplate
                  ? tagsToDelete.includes(tag.id)
                    ? "#721c24"
                    : "#000000"
                  : null,
              }}
            >
              {tag}
              <div
                className="deleteTag"
                onClick={() => {
                  selectedTemplate
                    ? handleTagsToDelete(tag.id)
                    : deleteTag(tag.id);
                }}
              >
                x
              </div>
            </div>
          );
        })}
      </div>
      <div className="createOrBackButton" style={{ marginBottom: "20px" }}>
        <button
          className="backToManagerButton"
          onClick={backToManager}
          title="back"
        >
          <img className="ESAIcon" src="./backIcon.svg" />
        </button>
        <button
          className="formCreated"
          onClick={handleSaveChanges}
          title="save changes"
        >
          <img className="ESAIcon" src="./save4Icon.svg" />
        </button>
        <button
          className="formDeleted"
          title="delete template"
          onClick={() => {
            deleteTemplate(selectedTemplate.id);
          }}
        >
          <img className="ESAIcon" src="./deleteTemplateIcon.svg" />
        </button>
      </div>
    </div>
  );
}

TemplatePage.defaultProps = {
  questions: [],
};

export default TemplatePage;
