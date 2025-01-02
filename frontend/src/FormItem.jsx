import "./App.css";

function FormItem(props) {
  const date = new Date(props.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  return (
    <div
      className="formBody"
      onClick={() => {
        {
          props.newFormPage(props.id);
        }
      }}
    >
      <span className="formName" title={props.name}>
        {props.name}
      </span>
      <span className="formTopic">{props.topic}</span>
      <span className="formAuthor" title={props.author}>
        Created by: {props.author}
      </span>
      <span className="formDate">Creation date: {dateString}</span>
    </div>
  );
}

export default FormItem;
