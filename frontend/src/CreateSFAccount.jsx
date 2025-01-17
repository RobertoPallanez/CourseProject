import "./App.css";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "./QuestionContext";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import axios from "axios";

function CreateSFAccount(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [phoneInput, setPhoneInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleLogout() {
    setQuestions([]);
    setCheckboxes([]);
    setCurrentUser(null);
    setIsAnswering(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  const {
    setQuestions,
    setCheckboxes,
    backToManager,
    currentUser,
    setCurrentUser,
    setIsAnswering,
    BACKEND_URL,
    userPhone,
  } = useQuestion();

  useEffect(() => {
    setFormData(currentUser);
    localStorage.removeItem("authToken");
  }, []);

  function handlePhoneInput(e) {
    const phone = e.target.value;
    setPhoneInput(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/salesforce/create-contact`,
        {
          name: formData.name,
          email: formData.email,
          phone: phoneInput,
        }
      );
      setMessage(response.data.message);
      console.log(message);

      setIsLoading(false);
      if (response.data.id == undefined) {
        alert("Account already linked.");
      } else {
        setError("");
        alert("Account linked succesfully!.");
      }
      backToManager();
    } catch (message) {
      console.log(message);
      setMessage("Failed to create account");
    }
  }

  return (
    <div className="newFormPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="roleMessage">LINK ACCOUNT TO SALESFORCE</div>
          <div className="welcomeMessage">Hi, {currentUser.name}</div>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
      </div>
      <div className="saleforceFormContainer">
        <form className="saleforceForm" onSubmit={handleSubmit}>
          <h4 className="saleforceFormText">Link your account to SalesForce</h4>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Your name"
              value={currentUser.name}
              disabled={true}
              //   onChange={handleChange}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={currentUser.email}
              disabled={true}
              //   onChange={handleChange}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingPassword"
              placeholder="Phone number"
              value={currentUser.linked_sf ? userPhone : phoneInput}
              onChange={handlePhoneInput}
              disabled={currentUser.linked_sf ? true : false}
            />
            <label htmlFor="floatingPassword">Phone number</label>
          </div>
          <button
            className="btn btn-primary w-100 py-2 mt-3 linkedButton"
            type="submit"
            style={{
              backgroundColor: currentUser.linked_sf ? "green" : "#6928b8",
            }}
            disabled={currentUser.linked_sf == true ? true : false}
          >
            <div className="linkedText">
              {currentUser.linked_sf ? "Account linked" : "Link account"}
            </div>
            {currentUser.linked_sf ? (
              <img src="checkedLinkedIcon2.svg" className="linkedIcon" />
            ) : null}
          </button>
          {isLoading && (
            <div className="spinner2-container">
              <div className="spinner2"></div>
            </div>
          )}
          {error !== "" ? <span>{error}</span> : null}
        </form>
        <div className="createOrBackButton">
          <button
            title="back"
            className="backToManagerButton"
            onClick={backToManager}
          >
            <img className="ESAIcon" src="backIcon.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}

CreateSFAccount.defaultProps = {
  questions: [],
};

export default CreateSFAccount;
