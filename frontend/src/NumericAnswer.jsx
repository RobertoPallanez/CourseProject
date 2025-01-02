import "./App.css";
import { useQuestion } from "./QuestionContext";

function NumericAnswer(props) {
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
            key={props.key}
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
      <input
        className="answerInput"
        placeholder="Write your answer here"
        onChange={props.handleAnswerInput}
      />
    </div>
  );
}

export default NumericAnswer;
