import "./App.css";
import { useQuestion } from "./QuestionContext";

function SearchBarPublic(props) {
  const { handleSearchBarInput, handleSearchPublicButton, clearFilterButton } =
    useQuestion();

  return (
    <div className="searchBar">
      <img
        src="clearFilter.svg"
        title="Clear Filter"
        className="clearFilter"
        onClick={clearFilterButton}
      />
      <input
        className="searchInput"
        placeholder="Search for a form"
        onChange={(event) => handleSearchBarInput(event)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearchPublicButton();
          }
        }}
      />
      <img
        src="search2Icon.svg"
        alt="search icon"
        title="Search"
        className="searchIcon"
        onClick={handleSearchPublicButton}
      />
    </div>
  );
}

export default SearchBarPublic;
