import "./App.css";
import { useQuestion } from "./QuestionContext";

function SearchBarUsers(props) {
  const {
    handleSearchUsersButton,
    clearUsersFilterButton,
    handleSearchForUsers,
  } = useQuestion();
  return (
    <div className="searchBar">
      <img
        src="clearFilter.svg"
        title="Clear Filter"
        className="clearFilter"
        onClick={clearUsersFilterButton}
      />
      <input
        className="searchInput"
        placeholder="search by name, role or status"
        style={{ fontSize: "0.90rem" }}
        onChange={(event) => handleSearchForUsers(event)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearchUsersButton();
          }
        }}
      />
      <img
        src="search2Icon.svg"
        alt="search icon"
        title="Search"
        className="searchIcon"
        onClick={handleSearchUsersButton}
      />
    </div>
  );
}

export default SearchBarUsers;
