import "./App.css";

function ParaSubmit(props) {
  return (
    <div className="questionObject">
      <div className="questionAndType">
        <div className="questionText">
          <span className="questionContentText">
            <strong>-</strong> {props.text}
          </span>
        </div>
      </div>
      <textarea
        rows="4"
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

export default ParaSubmit;
