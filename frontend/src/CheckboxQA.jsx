import "./App.css";

function CheckboxQA(props) {
  return (
    <div className="QABody">
      <span className="questionBody">
        <strong>question:</strong> {props.qText}
      </span>
      <span className="answerBody">
        {props.currentUser.role === "admin" ? (
          <>
            <span className="checkboxLabelForAnswer">{props.checkbox}</span>
            <input
              className="answerInputCheckbox"
              type="checkbox"
              checked={props.value === "checked"}
              value={props.value}
              onChange={(e) => {
                props.handleNewAnswerInput(props.id, props.type, e);
              }}
            />
          </>
        ) : (
          <span className="answerText">
            <strong>answer:</strong> {props.aText}
          </span>
        )}
      </span>
    </div>
  );
}

export default CheckboxQA;
