import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { useQuestion } from "./QuestionContext";

function Checkboxes(props) {
  const { selectedTemplate } = useQuestion();

  return (
    <div className="questionObject">
      <div className="questionAndType">
        <div className="questionText">
          {selectedTemplate !== null ? (
            <img src="drag2Icon.svg" className="dragIcon" />
          ) : null}
          <span className="questionName">question:</span>
          <input
            className="questionContent"
            key={props.selectedId}
            style={{
              textDecoration: selectedTemplate
                ? props.questionsToDelete.includes(props.questionId)
                  ? "line-through"
                  : "none"
                : null,
              color: selectedTemplate
                ? props.questionsToDelete.includes(props.questionId)
                  ? "#721c24"
                  : "#000000"
                : null,
            }}
            value={!selectedTemplate ? props.text : props.value}
            onChange={(e) =>
              props.handleInputChange(props.questionId, e.target.value)
            }
          />
        </div>
        <div className="typeAndDeleteButton">
          <div className="selectedType">{props.type}</div>
          <img
            src="deleteIcon.svg"
            className="deleteIcon"
            onClick={() => {
              selectedTemplate
                ? props.handleQuestionsToDelete(props.questionId)
                : props.deleteQuestion(props.id);
            }}
          />
        </div>
      </div>
      {!selectedTemplate
        ? props.checkboxes.map((checkbox) => {
            return (
              <div className="multichoiceContainer" key={uuidv4()}>
                <input className="multichoiceCheckbox" type="checkbox" />
                <span className="multichoiceLabels" value={props.checkboxInput}>
                  {checkbox}
                </span>
              </div>
            );
          })
        : props.checkboxes.split(",").map((option, index) => (
            <div className="multichoiceContainer" key={index}>
              <input className="multichoiceCheckbox" type="checkbox" />
              <span className="multichoiceLabels" value={props.checkboxInput}>
                {option.trim()}
              </span>
            </div>
          ))}
    </div>
  );
}

export default Checkboxes;