import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CoverPageStyle.css";

interface CoverProps {
  title: string;
  description: string;
  catchyPhrase: string;
  headerImage: string;
  showHeaderImage: boolean;
  showSearch: boolean;
}

const CoverPage: React.FC<CoverProps> = ({
  title,
  description,
  catchyPhrase,
  headerImage,
  showHeaderImage,
  showSearch,
}) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div className="cover">
      <div className="coverText">
        <h1>{title}</h1>
        <p>{description}</p>
        <em>{catchyPhrase}</em>
      </div>
      {showHeaderImage && <img src={headerImage} alt="img" />}
      {showSearch && (
        <div className="searchBar">
          <input
            type="search"
            placeholder="Search a Movie OR TV Show..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}
    </div>
  );
};

export default CoverPage;
