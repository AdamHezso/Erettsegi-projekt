import { useState, useEffect } from 'react';

function Carousel() {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel">
      <img src={images[currentIndex]} alt="Carousel" />
    </div>
  );
}

export default Carousel;