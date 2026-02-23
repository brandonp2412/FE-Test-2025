import React from 'react';
import { Horse } from '../types/Horse';

interface HorseComparisonProps {
  horse1: Horse;
  horse2: Horse;
  onBack: () => void;
}

const HorseComparison: React.FC<HorseComparisonProps> = ({ horse1, horse2, onBack }) => {
  const displayValue = (value: any) => (value !== null && value !== undefined && value !== "") ? value : "-";

  return (
    <div>
      <h2>Horse Comparison</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ flex: 1, padding: '10px', border: '1px solid #eee', margin: '5px' }}>
          <h3>{displayValue(horse1.name)}</h3>
          <p>ID: {displayValue(horse1.id)}</p>
          <p>Classification: {displayValue(horse1.classification)}</p>
          <h4>Profile:</h4>
          <ul>
            <li>Favourite Food: {displayValue(horse1.profile?.favouriteFood)}</li>
            <li>
              Physical:
              <ul>
                <li>Height: {displayValue(horse1.profile?.physical?.height)} cm</li>
                <li>Weight: {displayValue(horse1.profile?.physical?.weight)} kg</li>
              </ul>
            </li>
          </ul>
        </div>
        <div style={{ flex: 1, padding: '10px', border: '1px solid #eee', margin: '5px' }}>
          <h3>{displayValue(horse2.name)}</h3>
          <p>ID: {displayValue(horse2.id)}</p>
          <p>Classification: {displayValue(horse2.classification)}</p>
          <h4>Profile:</h4>
          <ul>
            <li>Favourite Food: {displayValue(horse2.profile?.favouriteFood)}</li>
            <li>
              Physical:
              <ul>
                <li>Height: {displayValue(horse2.profile?.physical?.height)} cm</li>
                <li>Weight: {displayValue(horse2.profile?.physical?.weight)} kg</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <button onClick={onBack}>Back to List</button>
    </div>
  );
};

export default HorseComparison;
export {}; // Add this line to make it a module
