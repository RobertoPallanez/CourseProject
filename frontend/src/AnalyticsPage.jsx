import "./App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

function AnalyticsPage(props) {
  const navigate = useNavigate();
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    ChartDataLabels
  );

  const [questionToAnalyze, setQuestionToAnalyze] = useState(null);
  const [answeredRate, setAnsweredRate] = useState(0);
  const [averageAnswer, setAverageAnswer] = useState(null);
  const [avgLenghtAnswer, setAvgLengthAnswer] = useState(null);
  const [uncheckedPercentage, setUncheckedPercentage] = useState(null);

  const {
    setQuestions,
    selectedTemplate,
    setSelectedFormQuestions,
    currentUser,
    setCurrentUser,
    setForms,
    setSelectedForm,
    setSelectedAnswers,
    formsData,
    questionsData,
    answersData,
    shortQuestions,
    paragraphQuestions,
    checkboxQuestions,
    numericQuestions,
    unansweredQuestions,
    avgCompletion,
    goToSubmitHistoryPage,
    formsByRegistered,
    setIsAnswering,
  } = useQuestion();

  function handleLogout() {
    setQuestions([]);
    setCurrentUser(null);
    setSelectedForm(null);
    setSelectedAnswers(null);
    setSelectedFormQuestions(null);
    setForms(null);
    setIsAnswering(false);
    navigate("/");
  }

  function goToTemplatePage() {
    navigate("/TemplatePage");
  }

  function handleQuestionSelector(e) {
    const questionId = e.target.value;

    const question = questionsData.find((q) => q.id == questionId);
    const answers = answersData.filter((a) => a.question_id == questionId);
    const answeredRate = (answers.length / formsData.length) * 100;

    const numericAnswers = answers.filter((a) => a.answer_numeric !== null);
    const textAnswers = answers.filter((a) => a.answer_text !== null);
    const uncheckedAnswers = answers.filter(
      (a) => a.answer_text == "unchecked"
    );

    let sumOfAnswers = 0;
    for (let i = 0; i < numericAnswers.length; i++) {
      sumOfAnswers = sumOfAnswers + Number(numericAnswers[i].answer_numeric);
    }
    const avgAnswer = sumOfAnswers / numericAnswers.length;

    let sumOfChars = 0;
    for (let i = 0; i < textAnswers.length; i++) {
      sumOfChars = sumOfChars + textAnswers[i].answer_text.length;
    }
    const avgTextAnswer = sumOfChars / textAnswers.length;
    const uncheckedPercentage =
      (uncheckedAnswers.length / answers.length) * 100;

    setQuestionToAnalyze(question);
    setAnsweredRate(answeredRate);
    setAverageAnswer(avgAnswer);
    setAvgLengthAnswer(avgTextAnswer);
    setUncheckedPercentage(uncheckedPercentage);
  }

  const chartEachType = {
    labels: ["Short answer", "Paragraph", "Checkbox", "Numeric Answer"],
    datasets: [
      {
        data: [
          shortQuestions.length,
          paragraphQuestions.length,
          checkboxQuestions.length,
          numericQuestions.length,
        ],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartCompletion = {
    labels: ["completion rate", "uncompleted"],
    datasets: [
      {
        data: [avgCompletion.toFixed(2), (100 - avgCompletion).toFixed(2)],
        backgroundColor: ["#33FF57", "#FF5733"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartTotalUnanswered = {
    labels: ["answered Q.", "unanswered Q."],
    datasets: [
      {
        data: [
          questionsData.length * formsData.length - unansweredQuestions,
          unansweredQuestions,
        ],
        backgroundColor: ["#33FF57", "#FF5733"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartRegisteredUsers = {
    labels: ["registered users", "unregistered users"],
    datasets: [
      {
        data: [
          formsByRegistered.toFixed(2),
          (100 - formsByRegistered).toFixed(2),
        ],
        backgroundColor: ["#33FF57", "#FF5733"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: "black",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value) => (value !== 0 ? `${value}` : null),
        padding: 6, // Padding inside each slice to position the label
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 10,
            weight: "bold",
            color: "black",
          },
        },
      },
    },
  };

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="templateEditor">TEMPLATE ANALYTICS</div>
        <div className="editorAndSubmitButtons">
          <button onClick={goToTemplatePage} title="editor">
            <img className="ESAIcon" src="./editorIcon.svg" />
          </button>
          <button title="submissions" onClick={goToSubmitHistoryPage}>
            <img className="ESAIcon" src="./submissionsIcon.svg" />
          </button>
          <button title="analytics">
            <img className="ESAIcon" src="./analyticsIcon.svg" />
          </button>
        </div>
        <div className="messages">
          <div className="welcomeMessage">Hi, {currentUser.name}</div>
          <div className="createMessage">
            This is a data analysis for the template: {selectedTemplate.name}
          </div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
      </div>
      {/* QUESTIONS CONTAINER */}
      <div className="questionsContainer">
        <div className="currentFormHeader">DATA ANALYSIS OF TEMPLATE</div>
        <div className="templateDataContainer">
          <div className="templateDataGrid">
            <div className="templateData">
              # of short answer questions:{" "}
              <strong>{shortQuestions.length}</strong>
            </div>
            <div className="templateData">
              # of paragraph questions:{" "}
              <strong>{paragraphQuestions.length}</strong>
            </div>
            <div className="templateData">
              # of checkbox questions:{" "}
              <strong>{checkboxQuestions.length}</strong>
            </div>
            <div className="templateData">
              # of numeric answer questions:{" "}
              <strong>{numericQuestions.length}</strong>
            </div>
            <div className="templateData">
              % average of completion:{" "}
              <strong>
                {isNaN(avgCompletion) ? "" : `${avgCompletion.toFixed(2)}%`}
              </strong>
            </div>
            <div className="templateData">
              # total submissions: <strong>{formsData.length}</strong>
            </div>
            <div className="templateData">
              # of unanswered questions per form:{" "}
              <strong>
                {isNaN(unansweredQuestions / formsData.length)
                  ? ""
                  : (unansweredQuestions / formsData.length).toFixed(2)}
              </strong>
            </div>
            <div className="templateData">
              # of unanswered questions (all forms):{" "}
              <strong>{unansweredQuestions}</strong>
            </div>
            <div className="templateData">
              % completion by{" "}
              <strong style={{ color: "#4725c2" }}> registered users</strong>:{" "}
              <strong>
                {isNaN(formsByRegistered)
                  ? ""
                  : `${formsByRegistered.toFixed(2)}%`}
              </strong>
            </div>
            <div className="templateData">
              % completion by{" "}
              <strong style={{ color: "red" }}> unregistered users</strong>:{" "}
              <strong>
                {isNaN(100 - formsByRegistered)
                  ? ""
                  : `${(100 - formsByRegistered).toFixed(2)}%`}
              </strong>
            </div>
          </div>
          <div className="templatePieChartsContainer">
            <div
              className="pieChart"
              style={{
                display: isNaN(chartEachType.datasets[0].data[0])
                  ? "none"
                  : "flex",
              }}
            >
              {isNaN(chartEachType.datasets[0].data[0]) ? null : (
                <Pie data={chartEachType} options={chartOptions} />
              )}
            </div>
            <div
              className="pieChart"
              style={{
                display: isNaN(chartCompletion.datasets[0].data[0])
                  ? "none"
                  : "flex",
              }}
            >
              <Pie data={chartCompletion} options={chartOptions} />
            </div>
            <div
              className="pieChart"
              style={{
                display: isNaN(chartTotalUnanswered.datasets[0].data[0])
                  ? "none"
                  : "flex",
              }}
            >
              <Pie data={chartTotalUnanswered} options={chartOptions} />
            </div>
            <div
              className="pieChart"
              style={{
                display: isNaN(chartRegisteredUsers.datasets[0].data[0])
                  ? "none"
                  : "flex",
              }}
            >
              <Pie data={chartRegisteredUsers} options={chartOptions} />
            </div>
          </div>
        </div>
        {/* PIE CHARTS FOR TEMPLATE CONTAINER */}
        <div className="currentFormHeader">DATA ANALYSIS BY QUESTION</div>
        <div className="QASelectorContainer">
          <div>Select the question you want to analyse:</div>
          <select className="QASelector" onChange={handleQuestionSelector}>
            <option className="QAOption" value="" disabled selected>
              select a question
            </option>
            {questionsData.map((question) => {
              return (
                <option
                  className="QAOption"
                  value={question.id}
                  key={question.id}
                  type={question.question_type}
                >
                  {question.question_text}
                </option>
              );
            })}
          </select>
        </div>
        {questionToAnalyze ? (
          <div className="answerDataContainer">
            <div className="questionTextAndTypeContainer">
              <div className="questionDataText">
                question: {questionToAnalyze.question_text}
              </div>
            </div>
            <div className="answerDataPoints">
              <div className="templateData">
                type: <strong>{questionToAnalyze.question_type}</strong>
              </div>
              <div className="templateData">
                answered rate:{" "}
                <strong>
                  {isNaN(answeredRate.toFixed(2))
                    ? "0%"
                    : `${answeredRate.toFixed(2)}%`}
                </strong>
              </div>
              <div className="templateData">
                average answer (numeric):{" "}
                <strong>{isNaN(averageAnswer) ? "" : averageAnswer}</strong>
              </div>
              <div className="templateData">
                average answer length (characters):
                <strong>
                  {isNaN(avgLenghtAnswer) ? "" : avgLenghtAnswer.toFixed(2)}
                </strong>
              </div>
              <div className="templateData">
                <strong className="strongCheck2">
                  checked <img className="checkedIcon" src="checked2Icon.svg" />
                </strong>
                answer rate:{" "}
                <strong>
                  {questionToAnalyze.question_type == "checkbox"
                    ? isNaN(100 - uncheckedPercentage)
                      ? "No answers Yet"
                      : `${(100 - uncheckedPercentage).toFixed(2)}%`
                    : null}
                </strong>
              </div>
              <div className="templateData">
                <strong className="strongCheck">
                  unchecked{" "}
                  <img className="checkedIcon" src="unchecked2Icon.svg" />
                </strong>
                answer rate:{" "}
                <strong>
                  {questionToAnalyze.question_type == "checkbox"
                    ? isNaN(uncheckedPercentage)
                      ? "No answers Yet"
                      : `${uncheckedPercentage.toFixed(2)}%`
                    : null}
                </strong>
              </div>
            </div>
          </div>
        ) : null}
        <div className="createOrBackButton">
          <button
            title="back"
            className="backToManagerButton"
            onClick={goToTemplatePage}
            style={({ marginBottom: "10px" }, { marginTop: "5px" })}
          >
            <img className="ESAIcon" src="backIcon.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}

AnalyticsPage.defaultProps = {
  questions: [],
};

export default AnalyticsPage;
