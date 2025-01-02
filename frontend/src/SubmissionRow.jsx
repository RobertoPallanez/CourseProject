import "./App.css";

function SubmissionRow(props) {
  const date = new Date(props.submissionDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  return (
    <div
      className="submissionRow"
      onClick={() => props.goToSubmittedAnswersPage(props.formId)}
    >
      <span>{props.userName}</span>
      <span className="emailSpan">{props.userEmail}</span>
      <span>{dateString}</span>
    </div>
  );
}

export default SubmissionRow;
