import React from 'react';
import '../styles/CoverPageStyle.css'; // Importa o arquivo CSS

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
          <input type="search" placeholder="Search a Movie OR TV Show..." />
          <button>Search</button>
        </div>
      )}
    </div>
  );
};

export default CoverPage;
