import "./App.css";
import { useQuestion } from "./QuestionContext";

function CreateForm() {
  const { handleCreateForm } = useQuestion();
  return (
    <div className="createForm" onClick={handleCreateForm}>
      <img className="addFormIcon" src="plusIcon.svg" />
    </div>
  );
}

export default CreateForm;
