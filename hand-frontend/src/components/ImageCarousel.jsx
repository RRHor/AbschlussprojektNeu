import React from 'react';
import { useState, useEffect } from 'react';
import image1 from '../assets/carousel/image1.jpg';
import image2 from '../assets/carousel/image2.jpg';
import image3 from '../assets/carousel/image3.jpg';
import image4 from '../assets/carousel/image4.jpg';
import image5 from '../assets/carousel/image5.jpg';

import './ImageCarousel.css';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={images[current]} alt={`Slide ${current}`} className="carousel-image" />
    </div>
  );
}

export default ImageCarousel;