import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js"; // Import Fuse library for fuzzy search

const ShowList = ({ shows, onSelectShow }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOption, setSortOption] = useState("default"); // 'default', 'titleAsc', 'titleDesc', 'dateAsc', 'dateDesc'
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShows, setFilteredShows] = useState([]);

  const genreMapping = {
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

  useEffect(() => {
    // Filter shows based on selected genre
    const genreFilteredShows = selectedGenre
      ? shows.filter((show) => show.genres.includes(selectedGenre))
      : shows;

    // Filter shows based on fuzzy matching of title
    const fuse = new Fuse(genreFilteredShows, {
      keys: ["title"],
      includeScore: true,
      threshold: 0.4, // Adjust threshold as needed
    });

    const fuzzyFilteredShows = searchTerm
      ? fuse.search(searchTerm).map(({ item }) => item)
      : genreFilteredShows;

    // Sort the filtered shows
    const sortedShows = [...fuzzyFilteredShows].sort(sortShows);

    setFilteredShows(sortedShows);
  }, [selectedGenre, shows, searchTerm, sortOption]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortShows = (a, b) => {
    switch (sortOption) {
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      case "dateAsc":
        return new Date(a.updated) - new Date(b.updated);
      case "dateDesc":
        return new Date(b.updated) - new Date(a.updated);
      default:
        return 0; // No sorting (default)
    }
  };

  return (
    <div>

      <div className="container">
  {/* Dropdown for selecting genre */}
  <select onChange={(e) => handleGenreChange(Number(e.target.value))} className="select-container">
    <option value="">All Genres</option>
    {Object.entries(genreMapping).map(([id, title]) => (
      <option key={id} value={id}>
        {title}
      </option>
    ))}
  </select>

  {/* Input for searching by title */}
  <input
    type="text"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={handleSearchChange}
  />

  {/* Dropdown for selecting sorting option */}
  <select onChange={(e) => handleSortChange(e.target.value)}>
    <option value="default">Sort by</option>
    <option value="titleAsc">Title A-Z</option>
    <option value="titleDesc">Title Z-A</option>
    <option value="dateAsc">Date Asc</option>
    <option value="dateDesc">Date Desc</option>
  </select>
</div>
       
       {/* Genre labels for clicking */}
      <div>
        {Object.entries(genreMapping).map(([id, title]) => (
          <span
            key={id}
            className={`genre-label ${selectedGenre === Number(id) ? 'selected' : ''}`}
            onClick={() => handleGenreChange(Number(id))}
          >
            {title}
          </span>
        ))}
      </div>
       
      <ul className="list--details">
        {filteredShows.map((show) => (
            
          <Link to={`/show/${show.id}`} key={show.id} className="show--link">
            <div
              className="podcast--info"
              onClick={() => onSelectShow(show.id)}
            >
              <p className="genre">
                Genre:{" "}
                {show.genres
                  .map((genreId) => genreMapping[genreId])
                  .join(", ")}
              </p>
              <img
                src={show.image}
                className="podcast--main--image"
                alt={show.title}
              />
              <h3 className="podcast--title">{show.title}</h3>
              <h3>{`Seasons: ${show.seasons}`}</h3>
              <p className="date--updated">{`Last Updated: ${new Date(
                show.updated
              ).toLocaleDateString()}`}</p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
