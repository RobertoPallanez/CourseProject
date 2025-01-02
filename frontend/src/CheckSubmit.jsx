import "./App.css";

function CheckSubmit(props) {
  return (
    <div className="questionObject">
      <div className="questionAndType">
        <div className="questionText">
          <span className="questionContentText">
            <strong>-</strong> {props.text}
          </span>
        </div>
      </div>
      {props.checkboxes.split(",").map((option, index) => (
        <div className="multichoiceContainer" key={index}>
          <input
            className="multichoiceCheckbox"
            type="checkbox"
            checked={
              props.existingAnswers !== null ? props.value === "checked" : null
            }
            value={props.value}
            onChange={(e) => {
              props.existingAnswers == null
                ? props.handleAnswerInputChange(props.id, props.type, e)
                : props.handleNewAnswerInput(props.id, props.type, e);
            }}
          />
          <span className="multichoiceLabels" value={props.checkboxInput}>
            {option.trim()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CheckSubmit;
