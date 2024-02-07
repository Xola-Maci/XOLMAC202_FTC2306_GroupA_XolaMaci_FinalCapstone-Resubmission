import React from "react";
import logo from "./Logo/THE X-WAY PODCAST.png";

export default function Header() {
  const podcastName = "THE X-WAY";

  return (
    <header className="header">
      {/* Logo */}
      <img src={logo} alt={`${podcastName} Logo`} className="logo" />

      {/* Podcast Name */}
      <h1 className="podcast-name">{podcastName}</h1>
    </header>
  );
}
