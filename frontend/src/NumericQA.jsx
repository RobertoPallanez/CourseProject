import "./App.css";

function NumericQA(props) {
  return (
    <div className="QABody">
      <span className="questionBody">
        <strong>question:</strong> {props.qText}
      </span>
      <span className="answerBody">
        {props.currentUser.role === "admin" ? (
          <input
            className="answerInput"
            type="number"
            value={props.value}
            onChange={(e) => {
              props.handleNewAnswerInput(props.id, props.type, e.target.value);
            }}
          />
        ) : (
          <span className="answerText">
            <strong>answer:</strong> {props.aText}
          </span>
        )}
      </span>
    </div>
  );
}

export default NumericQA;
