import React, { useEffect, useState } from 'react';

import { Horse } from '../types/Horse'; // Only import Horse

interface HorseDetailsProps {
  horseId: string;
}

const HorseDetails: React.FC<HorseDetailsProps> = ({ horseId }) => {
  const [horse, setHorse] = useState<Horse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHorseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3016/horse/${horseId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Horse = await response.json();
        
        // Determine classification based on weight
        if (data.profile?.physical?.weight !== null && data.profile?.physical?.weight !== undefined) {
          data.classification = data.profile.physical.weight >= 400 ? 'Horse' : 'Pony';
        }
        setHorse(data);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHorseDetails();
  }, [horseId]);

  if (loading) {
    return <div>Loading horse details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!horse) {
    return <div>No horse data found.</div>;
  }

  // Helper to display a value or "-" if null/undefined
  const displayValue = (value: any) => (value !== null && value !== undefined && value !== "") ? value : "-";

  return (
    <div>
      <h2>{displayValue(horse.name)}</h2>
      <p>ID: {displayValue(horse.id)}</p>
      <h3>Profile:</h3>
      <p>Classification: {displayValue(horse.classification)}</p>
      <ul>
        <li>Favourite Food: {displayValue(horse.profile?.favouriteFood)}</li>
        <li>
          Physical:
          <ul>
            <li>Height: {displayValue(horse.profile?.physical?.height)} cm</li>
            <li>Weight: {displayValue(horse.profile?.physical?.weight)} kg</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default HorseDetails;
