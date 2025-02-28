import "./App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { useQuestion } from "./QuestionContext";
import axios from "axios";
import SearchBarUsers from "./SearchBarUsers";

function UserManagerPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const {
    currentUser,
    setCurrentUser,
    backToManager,
    users,
    setUsers,
    goToUserManager,
    goToFillingAdminPage,
    BACKEND_URL,
    setIsAnswering,
    goToCreateSFAccount,
  } = useQuestion();

  useEffect(() => {
    const allUsers = localStorage.getItem("users");
    setUsers(JSON.parse(allUsers));
    const loggedUser = localStorage.getItem("loggedUser");
    setCurrentUser(JSON.parse(loggedUser));
  }, []);

  function handleLogout() {
    setCurrentUser(null);
    setIsAnswering(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  async function promoteToAdmin(userId) {
    try {
      const response = await axios.post(`${BACKEND_URL}/promoteToAdmin`, {
        id: userId,
      });
      const promotedUser = response.data.user.name;
      console.log(`promoted ${promotedUser} to admin`);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error trying to promote user to admin.", error);
    }
  }

  async function removeFromAdmins(userId) {
    try {
      const response = await axios.post(`${BACKEND_URL}/removeFromAdmins`, {
        id: userId,
      });
      const demotedUser = response.data.user.name;
      console.log(`promoted ${demotedUser} to admin`);
      if (currentUser.id == userId) {
        navigate("/");
      } else {
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error trying to remove user from admins.", error);
    }
  }

  async function blockOrUnblockUser(userId) {
    try {
      const response = await axios.post(`${BACKEND_URL}/blockOrUnblockUser`, {
        id: userId,
      });
      const user = response.data.user;
      console.log(`user ${user.name} blocked/unblocked.`);
      if (user.status == "blocked" && currentUser.id == userId) {
        alert("You have been blocked. Please contact an admin.");
        navigate("/");
      } else {
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error trying to block/unblock user.", error);
    }
  }

  async function deleteUser(userId, userEmail) {
    try {
      const response = await axios.post(`${BACKEND_URL}/deleteUser`, {
        id: userId,
        email: userEmail,
      });
      const user = response.data.userToDelete.name;
      console.log(`user ${user} delete from SALESFORCE and database`);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error trying to delete user.", error);
    }
  }

  useEffect(() => {
    goToUserManager();
  }, [refresh]);

  return (
    <div className="managerPage">
      <NavBar />
      <div className="messagesAndLogout">
        <div className="messages">
          <div className="adminMessage">ADMIN CONTROL PANEL</div>
          <div className="welcomeMessage">
            Hi, {currentUser?.name || "Guest"}
          </div>
          <div className="createMessage">
            Manage admin roles, block and delete users:
          </div>
        </div>
        <div className="formsAndUsers">
          <button className="adminForms" onClick={backToManager}>
            templates
          </button>
          <button className="adminUsers">users</button>
          <button className="adminForms" onClick={goToFillingAdminPage}>
            submit a form
          </button>
          <button className="publicForms" onClick={goToCreateSFAccount}>
            Link to SaleForce
          </button>
        </div>
        <div className="bannerAndLogout">
          <div onClick={handleLogout} className="logoutButton">
            Logout
          </div>
        </div>
        <SearchBarUsers />
      </div>
      <div className="usersContainer">
        <div className="userTableHeaders">
          <span className="userName">user name</span>
          <span className="userEmail">user email</span>
          <span className="userName">role</span>
          <span className="userName">status</span>
          <span className="userRole">manage</span>
        </div>
        {users.map((user, index) => {
          return (
            <div
              className="userInfo"
              key={index}
              style={
                user.role == "admin"
                  ? user.status == "blocked"
                    ? { backgroundColor: "rgb(255, 211, 211)" }
                    : { backgroundColor: "rgb(217, 238, 255)" }
                  : user.status == "blocked"
                  ? { backgroundColor: "rgb(255, 211, 211)" }
                  : null
              }
            >
              <span className="userName">{user.name}</span>
              <span className="userEmail">{user.email}</span>
              <span className="userName">{user.role}</span>
              <span className="userName">{user.status}</span>
              <div className="manageUserOptions">
                <img
                  title="make admin"
                  src="promote2Icon.svg"
                  className="demoteIcon"
                  onClick={() => promoteToAdmin(user.id)}
                />
                <img
                  title="make user"
                  src="demote2Icon.svg"
                  className="demoteIcon"
                  onClick={() => removeFromAdmins(user.id)}
                />
                <img
                  title="block/unblock"
                  src="blockIcon.svg"
                  className="demoteIcon"
                  onClick={() => blockOrUnblockUser(user.id)}
                />
                <img
                  title="delete"
                  src="deleteUserIcon.svg"
                  className="demoteIcon"
                  onClick={() => deleteUser(user.id, user.email)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserManagerPage;
