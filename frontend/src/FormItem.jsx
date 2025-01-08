import "./App.css";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";

function FormItem(props) {
  const date = new Date(props.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  const update = new Date(props.last_update);
  const dayUpdated = String(update.getDate()).padStart(2, "0");
  const monthUpdated = String(update.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const yearUpdated = update.getFullYear();
  const updateString = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

  return (
    <div
      className="formBody"
      onClick={() => {
        props.newFormPage(props.id);
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
      <span className="formLastUpdate">Last updated: {updateString}</span>
    </div>
  );
}

export default FormItem;
