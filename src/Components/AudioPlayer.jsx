// AudioPlayer.js
import React from 'react';

const AudioPlayer = ({ currentEpisode, onPause }) => {
  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="audio-player">
      <h3>Now Playing</h3>
      <p>{currentEpisode.title}</p>
      <audio controls onEnded={onPause}>
        <source src={currentEpisode.file} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
