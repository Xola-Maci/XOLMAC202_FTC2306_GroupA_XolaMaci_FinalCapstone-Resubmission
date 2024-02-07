import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ShowList from './ShowList';
import SelectedShow from './SelectedShow';
import './SlidingCarousel.css';
import Header from './Header';

const PodcastComponent = () => {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredShows, setFeaturedShows] = useState([]);

  useEffect(() => {
    // Fetch shows data
    fetch('https://podcast-api.netlify.app/shows')
      .then(response => response.json())
      .then(data => {
        setShows(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shows:', error);
        setLoading(false);
      });

    // Fetch featured shows data
    fetch('https://podcast-api.netlify.app/shows')
      .then(response => response.json())
      .then(data => {
        setFeaturedShows(data);
      })
      .catch(error => {
        console.error('Error fetching featured shows:', error);
      });
  }, []);

  const handleSelectShow = showId => {
    setLoading(true);
    fetch(`https://podcast-api.netlify.app/id/${showId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedShow(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching selected show data:', error);
        setLoading(false);
      });
  };

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className='featured-shows-container'>
              <Header/>
              <h1 className='featured-shows-title'>Featured Shows</h1>
              <Slider {...carouselSettings}>
                {featuredShows.map(show => (
                  <div key={show.id} className='show-card'>
                    <img src={show.image} alt={show.title} className='show-image' />
                    <h3 className='show-title'>{show.title} </h3>
                  </div>
                ))}
              </Slider>
              <h1>All Shows</h1>
              <ShowList shows={shows} onSelectShow={handleSelectShow} />
            </div>
          }
        />
        <Route
          path="/show/:showId"
          element={<SelectedShow selectedShow={selectedShow} />}
        />
      </Routes>
    </Router>
  );
};

export default PodcastComponent;
