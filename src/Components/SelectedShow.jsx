// SelectedShow.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SelectedShow.css';
import AudioPlayer from './AudioPlayer';

const SelectedShow = () => {
  const { showId } = useParams();
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://podcast-api.netlify.app/id/${showId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched selected show data:', data);
        setSelectedShow(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching selected show data:', error);
        setLoading(false);
      });
  }, [showId]);

  const handlePlay = episode => {
    setCurrentEpisode(episode);
  };

  const handlePause = () => {
    setCurrentEpisode(null);
  };

  const handleSeasonChange = seasonNumber => {
    setCurrentSeason(seasonNumber);
  };

  const toggleFavorite = episode => {
    const isFavorite = favorites.some(fav => fav.title === episode.title);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.title !== episode.title));
    } else {
      setFavorites([...favorites, episode]);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (currentEpisode) {
        const message = 'Are you sure you want to leave? Your audio will stop playing.';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentEpisode]);

  if (!selectedShow) {
    return <p>Loading...</p>;
  }

  const { title, image, description, seasons } = selectedShow;

  return (
    <div className="selected-show-container">
      <Link to="/" className="back-button">
        <i className="fas fa-arrow-left"></i> Back to All Shows
      </Link>
      <h1>{title}</h1>
      <img src={image} alt={title} className="selected-show-image" />
      <p>{description}</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="season-buttons">
            {seasons.map(season => (
              <a
                href="#list"
                key={season.season}
                className={currentSeason === season.season ? 'active' : ''}
                onClick={() => handleSeasonChange(season.season)}
              >
                Season {season.season}
              </a>
            ))}
          </div>

          {currentSeason !== null && (
            <div className="episodes-list" id="list">
              <h2>Episodes - Season {currentSeason}</h2>
              <p>Total Episodes: {seasons.find(season => season.season === currentSeason)?.episodes.length}</p>
              {seasons
                .find(season => season.season === currentSeason)
                ?.episodes?.map(episode => (
                  <div key={episode.title}>
                    <h3>{episode.title}</h3>
                    <p>{episode.description}</p>
                    <p>Episode: {episode.episode}</p>

                    <audio controls>
                      <source src={episode.file} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>

                    <div className="audio-player-container">
                      {/* Include the AudioPlayer component */}
                      <AudioPlayer currentEpisode={currentEpisode} onPause={handlePause} />
                    </div>

                    <button onClick={() => toggleFavorite(episode)}>
                      {favorites.some(fav => fav.title === episode.title)
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'}
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Display the list of favorite episodes */}
          {favorites.length > 0 && (
            <div className="favorites-list">
              <h2>Favorite Episodes</h2>
              {favorites.map(fav => (
                <div key={fav.title}>
                  <h3>{fav.title}</h3>
                  <p>{fav.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedShow;
