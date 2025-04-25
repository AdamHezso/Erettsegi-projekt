import { useState, useEffect } from 'react';

function WeeklyOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/weekly-offers')
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="weekly-offers">
      <h2>Heti ajánlatok</h2>
      <div className="offers-list">
        {offers.map(offer => (
          <div key={offer.id} className="offer-card">
            <div>{offer.nev}</div>
            <div>{offer.ar} Ft</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyOffers;