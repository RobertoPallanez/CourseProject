import "./App.css";

function NumericSubmit(props) {
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
        type="number"
        className="answerInput"
        placeholder="Write your answer here (only numbers accepted)"
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

export default NumericSubmit;
