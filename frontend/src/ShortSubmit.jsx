import "./App.css";

function ShortSubmit(props) {
  return (
    <div className="questionObject">
      <div className="questionAndType">
        <div className="questionText">
          <span className="questionContentText">
            <strong>-</strong> {props.text}
          </span>
        </div>
      </div>
      <input
        className="answerInput"
        placeholder="Write your answer here"
        value={props.existingAnswers !== null ? props.value : null}
        onChange={(e) => {
          props.existingAnswers == null
            ? props.handleAnswerInputChange(props.id, props.type, e)
            : props.handleNewAnswerInput(props.id, props.type, e.target.value);
        }}
      />
    </div>
  );
}

export default ShortSubmit;
