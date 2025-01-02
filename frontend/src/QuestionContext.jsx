import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [input, setInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("short answer");
  const [selectedImage, setSelectedImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [checkboxInput, setCheckboxInput] = useState("");
  const [checkboxes, setCheckboxes] = useState([]);
  const [error, setError] = useState("");
  const [templateTopic, setTemplateTopic] = useState("general");
  const [submissionMode, setSubmissionMode] = useState(false);
  const [searchBarInput, setSearchBarInput] = useState("");
  const [searchUsersInput, setSearchUsersInput] = useState("");

  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState(null);
  const [templateName, setTemplateName] = useState("Untitled Form");
  const [templateDescription, setTemplateDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [updatedQuestions, setUpdatedQuestions] = useState([]);
  const [updatedAnswers, setUpdatedAnswers] = useState([]);
  const [updatedTags, setUpdatedTags] = useState([]);
  const [selectedFormQuestions, setSelectedFormQuestions] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [existingForm, setExistingForm] = useState(null);
  const [existingAnswers, setExistingAnswers] = useState(null);

  const [templateData, setTemplateData] = useState([]);
  const [formsData, setFormsData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [answersData, setAnswersData] = useState([]);
  const [shortQuestions, setShortQuestions] = useState([]);
  const [paragraphQuestions, setParagraphQuestions] = useState([]);
  const [checkboxQuestions, setCheckboxQuestions] = useState([]);
  const [numericQuestions, setNumericQuestions] = useState([]);
  const [shortAnswers, setShortAnswers] = useState([]);
  const [paragraphAnswers, setParagraphAnswers] = useState([]);
  const [checkboxAnswers, setCheckboxAnswers] = useState([]);
  const [numericAnswers, setNumericAnswers] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [formsByRegistered, setFormsByRegistered] = useState(0);
  const [analyticsTrigger, setAnalyticsTrigger] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTemplate !== null) {
      if (currentUser && !isAnswering) {
        navigate("/TemplatePage");
      } else {
        if (existingAnswers !== null) {
          navigate("/ModifyAnswersPage");
        } else {
          navigate("/AnswerFormPage");
        }
      }
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (analyticsTrigger) {
      navigate("/AnalyticsPage");
    }
  }, [analyticsTrigger]);

  useEffect(() => {
    if (forms !== null) {
      setSelectedForm(null);
      navigate("/SubmitHistoryPage");
    }
  }, [forms]);

  async function newFormPage(templateId) {
    try {
      const response = await axios.post(`${BACKEND_URL}/selectTemplate`, {
        id: templateId,
        userId: currentUser ? currentUser.id : 44,
      });
      const receivedTemplate = response.data.template;
      const receivedQuestions = response.data.questions;
      const receivedTags = response.data.tags;
      const existingForm = response.data.existingForm;
      const answers = response.data.existingAnswers;

      setSelectedQuestions(receivedQuestions);
      setSelectedTags(receivedTags);
      setExistingForm(existingForm);
      setExistingAnswers(answers);
      setForms(null);
      setSelectedTemplate(receivedTemplate);
      setError("");
    } catch (err) {
      console.error("could not select the template.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  async function goToUserManager() {
    try {
      const response = await axios.get(`${BACKEND_URL}/allUsers`);
      const allUsers = response.data.users;
      setUsers(allUsers);
      setError("");
    } catch (err) {
      console.error("could not retrieve all users from data base.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
    navigate("/UserManagerPage");
  }

  function handleSearchForUsers(e) {
    const searchInput = e.target.value;
    setSearchUsersInput(searchInput);
  }

  async function handleSearchUsersButton() {
    try {
      const response = await axios.post(`${BACKEND_URL}/searchUsers`, {
        search: searchUsersInput,
      });
      const searchResults = response.data.matchedUsers;
      setUsers(searchResults);
      setError("");
    } catch (err) {
      console.error("Error trying to search for users.", err);
      setError(err.response ? err.response.data.message : "server Error.");
    }
  }

  function clearUsersFilterButton() {
    goToUserManager();
  }

  async function goToSubmitHistoryPage() {
    try {
      const response = await axios.post(`${BACKEND_URL}/getForms`, {
        templateId: selectedTemplate.id,
      });
      const formSubmissions = response.data.forms;
      setSelectedForm(null);
      setForms(formSubmissions);
    } catch (error) {
      setForms([]);
      console.error("Error getting submissions for this form:", error);
    }
  }

  async function goToAnalyticsPage(templateId) {
    setAnalyticsTrigger(false);

    try {
      const response = await axios.post(`${BACKEND_URL}/getTemplateData`, {
        templateId: templateId,
      });

      const template = response.data.template;
      const forms = response.data.forms;
      const questions = response.data.questions;
      const answers = response.data.answers;

      const shortQuestions = questions.filter(
        (question) => question.question_type === "short answer"
      );

      const paragraphQuestions = questions.filter(
        (question) => question.question_type === "paragraph"
      );

      const checkboxQuestions = questions.filter(
        (question) => question.question_type === "checkbox"
      );

      const numericQuestions = questions.filter(
        (question) => question.question_type === "numeric answer"
      );

      const shortAnswers = answers.filter((answer) =>
        shortQuestions.map((q) => q.id).includes(answer.question_id)
      );

      const paragraphAnswers = answers.filter((answer) =>
        paragraphQuestions.map((q) => q.id).includes(answer.question_id)
      );

      const checkboxAnswers = answers.filter((answer) =>
        checkboxQuestions.map((q) => q.id).includes(answer.question_id)
      );

      const numericAnswers = answers.filter((answer) =>
        numericQuestions.map((q) => q.id).includes(answer.question_id)
      );

      const unansweredQuestions =
        forms.length * questions.length - answers.length;

      const averageOfCompletion =
        (answers.length / (forms.length * questions.length)) * 100;

      const formsByRegistered = forms.filter((form) => form.user_id !== 44);
      const completionByRegistered =
        (formsByRegistered.length / forms.length) * 100;

      setTemplateData(template);
      setFormsData(forms);
      setQuestionsData(questions);
      setAnswersData(answers);
      setShortQuestions(shortQuestions);
      setParagraphQuestions(paragraphQuestions);
      setCheckboxQuestions(checkboxQuestions);
      setNumericQuestions(numericQuestions);
      setShortAnswers(shortAnswers);
      setParagraphAnswers(paragraphAnswers);
      setCheckboxAnswers(checkboxAnswers);
      setNumericAnswers(numericAnswers);
      setUnansweredQuestions(unansweredQuestions);
      setAvgCompletion(averageOfCompletion);
      setFormsByRegistered(completionByRegistered);

      setAnalyticsTrigger(true);
    } catch (err) {
      console.error("could not retrieve template data for analytics.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  async function getAllTemplates() {
    try {
      const response = await axios.get(`${BACKEND_URL}/allTemplates`);
      const allTemplates = response.data.templates;
      setTemplates(allTemplates);
      setError("");
    } catch (err) {
      console.error("could not retrieve all templates.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  async function getUserTemplates() {
    try {
      const response = await axios.post(`${BACKEND_URL}/userTemplates`, {
        currentUserId: currentUser.id,
      });
      const userTemplates = response.data.templates;
      setTemplates(userTemplates);
      setError("");
    } catch (err) {
      console.error("could not retrieve all templates.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  async function backToManager() {
    setQuestions([]);
    setTags([]);
    setQuestion({});
    setCheckboxes([]);
    setInput("");
    setTagInput("");
    setTemplateName("");
    setTemplateDescription("");
    setSelectedImage(null);
    setIsAnswering(false);
    setSelectedTemplate(null);
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);

    if (currentUser == null) {
      getAllTemplates();
      navigate("/FillingPage");
    } else if (currentUser.role == "admin") {
      getAllTemplates();
      navigate("/AdminPage");
    } else if (currentUser.role == "user") {
      getUserTemplates();
      navigate("/ManagerPage");
    }
  }

  async function backToFillingPage() {
    setQuestions([]);
    setQuestion({});
    setIsAnswering(false);

    if (currentUser == null) {
      getAllTemplates();
      navigate("/FillingPage");
    } else if (currentUser.role == "admin") {
      getAllTemplates();
      navigate("/FillingAdminPage");
    } else if (currentUser.role == "user") {
      getUserTemplates();
      navigate("/FillingPage");
    }
  }

  function handleQuestionInput(e) {
    const inputValue = e.target.value;
    setInput(inputValue);
  }

  function handleQuestionType(e) {
    const type = e.target.value;
    setType(type);
    setCheckboxes([]);
  }

  function handleTemplateTopic(e) {
    const topic = e.target.value;
    setTemplateTopic(topic);
  }

  function handleSubmissionMode(e) {
    const mode = e.target.value;
    setSubmissionMode(mode);
  }

  async function addQuestion() {
    const questionType = type;
    const questionText = input;
    const question = {
      text: `${questionText ? questionText : "Untitled question"}`,
      type: `${questionType ? questionType : "short answer"}`,
      checkboxes: `${checkboxes ? checkboxes : null}`,
    };
    if (!selectedTemplate) {
      setQuestions([...questions, question]);
      setInput("");
    } else {
      try {
        const response = await axios.post(`${BACKEND_URL}/addQuestion`, {
          questionToAdd: question,
          templateId: selectedTemplate.id,
        });
        const allQuestions = response.data.questions;
        setSelectedQuestions(allQuestions);
        setUpdatedQuestions(allQuestions);
      } catch (err) {
        console.error("Error trying to add new question to database.", err);
        setError(err.response ? err.response.data.message : "Server Error");
      }
    }
  }

  function handleTagInput(e) {
    const tag = e.target.value;
    if (!tag.includes(" ") && tag.length < 20) {
      setTagInput(tag);
    } else {
      console.log("Tag cannot contain spaces or exceed 20 characters.");
    }
  }

  async function addTag() {
    if (tagInput !== "") {
      if (tagInput.trim().length > 0 && tagInput.trim().length < 20) {
        const tag = tagInput.toLowerCase();
        if (!selectedTemplate) {
          setTags([...tags, tag]);
          setTagInput("");
        } else {
          try {
            const response = await axios.post(`${BACKEND_URL}/addTag`, {
              tagToAdd: tag,
              templateId: selectedTemplate.id,
              userId: currentUser.id,
            });
            const allTags = response.data.tags;
            setSelectedTags(allTags);
            setUpdatedTags(allTags);
          } catch (err) {
            console.error("Error trying to add new tag to database.", err);
            setError(err.response ? err.response.data.message : "Server Error");
          }
        }
      } else {
        console.log(
          "Tag cannot exceed 20 characters per tag or contain spaces."
        );
      }
    } else {
      console.log("Tag cannot be empty or contain spaces.");
    }
  }

  function deleteTag(id) {
    setTags((tags) => {
      return tags.filter((tags, index) => {
        return index !== id;
      });
    });
  }

  async function addTemplate() {
    try {
      const response = await axios.post(`${BACKEND_URL}/addTemplate`, {
        name: `${templateName ? templateName : "Untitled template"}`,
        description: `${templateDescription ? templateDescription : null}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        date: new Date().toLocaleDateString(),
        topic: `${templateTopic ? templateTopic : "General"}`,
        questions: questions,
        role: currentUser.role,
        tags: tags,
        image: selectedImage,
        readOnly: submissionMode,
      });

      console.log(response.data);
      setError("");
      setQuestions([]);
      setSelectedImage(null);
      setTemplates(response.data.userTemplates);
    } catch (err) {
      console.error("no forms from user or error receiving from server.", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
    if (currentUser.role == "user") {
      navigate("/ManagerPage");
    } else {
      navigate("/AdminPage");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const base64Image = e.target.result; // This includes the data URL with prefix
        // Extract the MIME type from the file
        const mimeType = file.type; // e.g., 'image/jpeg', 'image/png'
        const fullBase64 = `data:${mimeType};base64,${
          base64Image.split(",")[1]
        }`;
        setSelectedImage(fullBase64); // Set the image with the correct prefix
      };
      reader.readAsDataURL(file);
    }
  }

  async function deleteTemplate(id) {
    try {
      const response = await axios.post(`${BACKEND_URL}/deleteTemplate`, {
        idToDelete: id,
        authorId: currentUser.id,
      });

      setTemplates(response.data.userTemplates);
      setError("");
      if (response.data.user.role == "user") {
        navigate("/ManagerPage");
      } else {
        navigate("AdminPage");
      }
    } catch (err) {
      console.error("Error trying to delete the template.", err);
      setError(err.response ? err.response.data.message : "server Error");
    }
  }

  function handleTemplateName(e) {
    const name = e.target.value;
    setTemplateName(name);
  }

  function handleTemplateDescription(e) {
    const description = e.target.value;
    setTemplateDescription(description);
  }

  function handleCheckboxInput(e) {
    const checkboxText = e.target.value;
    setCheckboxInput(checkboxText);
  }

  function addCheckbox() {
    const checkboxOption = checkboxInput;
    setCheckboxes([...checkboxes, checkboxOption]);
    setCheckboxInput("");
  }

  async function deleteQuestion(id) {
    if (!selectedTemplate) {
      setQuestions((questions) => {
        return questions.filter((question, index) => {
          return index !== id;
        });
      });
    } else {
      try {
        const response = await axios.post(`${BACKEND_URL}/deleteQuestion`, {
          questionId: id,
          selectedTemplateId: selectedTemplate.id,
        });
        const remainingQuestions = response.data.remainingQuestions;
        setSelectedQuestions(remainingQuestions);
        setError("");
      } catch (err) {
        console.error("Error trying to delete the question.", err);
        setError(err.response ? error.response.data.message : "server Error.");
      }
    }
  }

  function handleCreateForm() {
    setType("short answer");
    setTemplateName("");
    setCheckboxes([]);
    setSelectedTemplate(null);
    navigate("/NewForm");
  }

  function handleAnswerInput(e) {
    const answer = e.target.value;
    console.log(`answer: ${answer}`);
  }

  function handleAnswerCheckbox(id) {
    const answer = id;
    console.log(`answer: ${answer}`);
  }

  function goToFillingPage() {
    setIsAnswering(true);
    getAllTemplates();
    navigate("/FillingPage");
  }

  function goToFillingAdminPage() {
    setIsAnswering(true);
    getAllTemplates();
    navigate("/FillingAdminPage");
  }

  function handleSearchBarInput(e) {
    const searchInput = e.target.value;
    setSearchBarInput(searchInput);
  }

  async function handleSearchButton() {
    setTemplates([]);
    const searchInput = searchBarInput;
    try {
      const response = await axios.post(`${BACKEND_URL}/searchUserTemplates`, {
        search: searchInput,
        user: currentUser,
      });
      const searchResults = response.data.matchedTemplates;
      setTemplates(searchResults);
      setError("");
    } catch (err) {
      console.error("Error trying to search for templates.", err);
      setError(err.response ? err.response.data.message : "server Error.");
    }
  }

  async function handleSearchPublicButton() {
    setTemplates([]);
    const searchInput = searchBarInput;
    try {
      const response = await axios.post(
        `${BACKEND_URL}/searchPublicTemplates`,
        {
          search: searchInput,
          user: currentUser,
        }
      );
      const searchResults = response.data.matchedTemplates;
      setTemplates(searchResults);
      setError("");
    } catch (err) {
      console.error("Error trying to search for templates.", err);
      setError(err.response ? err.response.data.message : "server Error.");
    }
  }

  function clearFilterButton() {
    if (currentUser.role == "admin") {
      getAllTemplates();
    } else if (currentUser.role == "user") {
      getUserTemplates();
    }
  }

  return (
    <QuestionContext.Provider
      value={{
        input,
        tagInput,
        handleQuestionInput,
        type,
        handleQuestionType,
        question,
        addQuestion,
        questions,
        setQuestions,
        checkboxInput,
        handleCheckboxInput,
        addCheckbox,
        checkboxes,
        deleteQuestion,
        forms,
        setForms,
        templates,
        setTemplates,
        addForm: addTemplate,
        formName: templateName,
        templateDescription,
        handleFormName: handleTemplateName,
        handleTemplateDescription,
        newFormPage,
        selectedTemplate,
        setSelectedTemplate,
        updatedQuestions,
        setUpdatedQuestions,
        updatedTags,
        setUpdatedTags,
        selectedQuestions,
        setSelectedQuestions,
        selectedTags,
        setSelectedTags,
        backToManager,
        handleCreateForm,
        deleteTemplate,
        currentUser,
        setCurrentUser,
        handleAnswerInput,
        handleAnswerCheckbox,
        goToUserManager,
        users,
        getAllTemplates,
        isAnswering,
        setIsAnswering,
        selectedForm,
        setSelectedForm,
        selectedAnswers,
        setSelectedAnswers,
        selectedFormQuestions,
        setSelectedFormQuestions,
        goToAnalyticsPage,
        goToFillingPage,
        goToFillingAdminPage,
        templateData,
        formsData,
        questionsData,
        answersData,
        shortQuestions,
        paragraphQuestions,
        checkboxQuestions,
        numericQuestions,
        shortAnswers,
        paragraphAnswers,
        checkboxAnswers,
        numericAnswers,
        setNumericAnswers,
        unansweredQuestions,
        goToSubmitHistoryPage,
        avgCompletion,
        formsByRegistered,
        handleTemplateTopic,
        handleTagInput,
        addTag,
        tags,
        setTags,
        deleteTag,
        searchBarInput,
        handleSearchBarInput,
        handleSearchButton,
        handleSearchPublicButton,
        clearFilterButton,
        searchUsersInput,
        handleSearchForUsers,
        handleSearchUsersButton,
        clearUsersFilterButton,
        handleImageChange,
        handleSubmissionMode,
        submissionMode,
        backToFillingPage,
        submittedAnswers,
        setSubmittedAnswers,
        setUpdatedAnswers,
        updatedAnswers,
        existingAnswers,
        setExistingAnswers,
        BACKEND_URL,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  return useContext(QuestionContext);
}
