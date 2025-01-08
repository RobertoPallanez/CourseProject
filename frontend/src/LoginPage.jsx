import "./App.css";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "./QuestionContext";
import { useState, useEffect } from "react";
import axios from "axios";

function LoginPage(props) {
  const navigate = useNavigate();

  const { setCurrentUser, setTemplates, setForms, BACKEND_URL } = useQuestion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function navigateSignupPage() {
    navigate("/SignupPage");
  }

  async function handleLoginButton(e) {
    setIsLoading(true);
    try {
      e.preventDefault();
      const response = await axios.post(`${BACKEND_URL}/Login`, {
        email: email,
        password: password,
      });
      const token = response.data.token;
      console.log(`token generated`);
      localStorage.setItem("authToken", token);
      localStorage.setItem("loggedUser", JSON.stringify(response.data.user));
      localStorage.setItem(
        "templates",
        JSON.stringify(response.data.userTemplates)
      );
      props.setIsAuthenticated(true);
      setIsLoading(false);
      console.log(`response message: ${response.data.message}`);
      if (response.data.message == "Login successful.") {
        //User Login
        setForms(null);
        setTemplates(response.data.userTemplates);
        setError("");
        setCurrentUser(response.data.user);
        navigate("/ManagerPage");
      } else if (response.data.message == "admin Login successful.") {
        //Admin Login
        setTemplates(response.data.userTemplates);
        setError("");
        setCurrentUser(response.data.user);
        navigate("/AdminPage");
      } else if (response.data.message == "Invalid email or password") {
        setError("Incorrect username or password");
      } else {
        setError("User blocked. Please contact your supervisor.");
      }
    } catch (err) {
      console.error("Incorrect username or password", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  async function handleContinueButton() {
    try {
      const response = await axios.get(`${BACKEND_URL}/allTemplates`);
      const allTemplates = response.data.templates;

      setTemplates(allTemplates);
      setForms(null);
      setError("");
    } catch (err) {
      console.error("Couldnt retrieve all fillable forms.");
      setError(err.response ? err.response.data.message : "Server Error");
    }
    navigate("/FillingPage");
  }

  function handleEmailInput(e) {
    const emailInput = e.target.value;
    setEmail(emailInput);
  }

  function handlePasswordInput(e) {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
  }

  return (
    <div className="loginPage">
      <NavBar />
      <form className="loginForm">
        <h1 className="loginHeader">
          The easiest way to <span className="sloganSpan">share</span>,{" "}
          <span className="sloganSpan">create</span> and{" "}
          <span className="sloganSpan">manage</span> forms.
        </h1>
        <h2 className="h3 mb-3 fw-normal">Sign in to your account:</h2>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={handleEmailInput}
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={handlePasswordInput}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button
          className="btn btn-primary w-100 py-2 my-3"
          type="submit"
          onClick={handleLoginButton}
        >
          Sign in
        </button>
        {isLoading && (
          <div className="spinner2-container">
            <div className="spinner2"></div>
          </div>
        )}
        <p className="mt-1 mb-1 text-body-secondary">
          <span className="signUpButton" onClick={handleContinueButton}>
            Continue
          </span>{" "}
          without login to answer a form.
        </p>
        <p className="mt-4 mb-3 text-body-secondary">
          Dont have an account?{" "}
          <span className="signUpButton" onClick={navigateSignupPage}>
            Sign up
          </span>{" "}
          for free.
        </p>
        {error !== "" ? <span>{error}</span> : null}
      </form>
    </div>
  );
}

export default LoginPage;
