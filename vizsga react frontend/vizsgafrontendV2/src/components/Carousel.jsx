import { useState, useEffect } from 'react';

const images = [
  '/assets/img/part1.jpg',
  '/assets/img/part2.jpg',
  '/assets/img/part3.jpg',
  '/assets/img/part4.jpg'
];

function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel">
      <img src={images[index]} alt="carousel" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
    </div>
  );
}

export default Carousel;