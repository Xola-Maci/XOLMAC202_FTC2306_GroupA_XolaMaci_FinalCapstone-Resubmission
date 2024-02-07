// FavoriteEpisodes.js
import React from 'react';

const FavoriteEpisodes = ({ favorites }) => {
  return (
    <div>
      <h2>Favorite Episodes</h2>
      {favorites.map(fav => (
        <div key={fav.title}>
          <h3>{fav.title}</h3>
          <p>{fav.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FavoriteEpisodes;
