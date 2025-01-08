import "./App.css";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useQuestion } from "./QuestionContext";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const { currentUser, setCurrentUser, setTemplates, BACKEND_URL } =
    useQuestion();

  async function handleSignupButton(e) {
    try {
      e.preventDefault();
      const response = await axios.post(`${BACKEND_URL}/Register`, {
        name: name,
        email: email,
        password: password,
      });

      if (response.data.message !== "User email already taken.") {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("loggedUser", JSON.stringify(response.data.user));
        localStorage.setItem(
          "templates",
          JSON.stringify(response.data.userTemplates)
        );
        setUser(response.data.user);
        setError("");
        setCurrentUser(response.data.user);
        setTemplates([]);
        navigate("/ManagerPage");
      } else if (response.data.message == "User email already taken.") {
        setError("User email already taken.");
        console.log(error);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response ? err.response.data.message : "Server Error");
    }
  }

  function handleNameInput(e) {
    const nameInput = e.target.value;
    setName(nameInput);
  }

  function handleEmailInput(e) {
    const emailInput = e.target.value;
    setEmail(emailInput);
  }

  function handlePasswordInput(e) {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
  }

  function navigateToLoginPage() {
    navigate("/");
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
        <h2 className="h3 mb-3 fw-normal">Create a new account:</h2>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Your name"
            onChange={handleNameInput}
          />
          <label htmlFor="floatingInput">Name</label>
        </div>

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
          className="btn btn-primary w-100 py-2 mt-3"
          type="submit"
          onClick={handleSignupButton}
        >
          Sign up
        </button>
        <p className="mt-5 mb-3 text-body-secondary">
          Already have an account?{" "}
          <span className="signUpButton" onClick={navigateToLoginPage}>
            Sign in
          </span>
          {"."}
        </p>
        {error !== "" ? <span>{error}</span> : null}
      </form>
    </div>
  );
}

export default SignupPage;
