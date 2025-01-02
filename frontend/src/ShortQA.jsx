import "./App.css";

function ShortQA(props) {
  return (
    <div className="QABody">
      <span className="questionBody">
        <strong>question:</strong> {props.qText}
      </span>
      <span className="answerBody">
        {props.currentUser.role === "admin" ? (
          <input
            className="answerInput"
            type="text"
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

export default ShortQA;
