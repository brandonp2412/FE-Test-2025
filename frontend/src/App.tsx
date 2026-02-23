import React, { useEffect, useState } from 'react';
import './App.css';

import { Horse } from './types/Horse';
import HorseDetails from './components/HorseDetails';
import HorseForm from './components/HorseForm';
import HorseComparison from './components/HorseComparison'; // Import HorseComparison

function App() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingHorse, setIsAddingHorse] = useState<boolean>(false);
  const [horseToEdit, setHorseToEdit] = useState<Horse | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorsesForComparison, setSelectedHorsesForComparison] = useState<Horse[]>([]); // New state for comparison
  const [isComparing, setIsComparing] = useState<boolean>(false); // New state for comparison view

  const fetchHorses = async () => {
    try {
      const response = await fetch('http://localhost:3016/horse');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Horse[] = await response.json();
      setHorses(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, [isAddingHorse, horseToEdit, isComparing]); // Re-fetch when adding/editing or comparison is done

  if (loading) {
    return <div className="App">Loading horses...</div>;
  }

  // Handler functions for form
  const handleAddClick = () => {
    setIsAddingHorse(true);
    setSelectedHorseId(null); // Clear selection when adding
    setHorseToEdit(null);
    setSelectedHorsesForComparison([]); // Clear comparison selection
    setIsComparing(false); // Exit comparison view
  };

  const handleEditClick = (horse: Horse) => {
    setHorseToEdit(horse);
    setIsAddingHorse(false);
    setSelectedHorseId(null); // Clear selection when editing
    setSelectedHorsesForComparison([]); // Clear comparison selection
    setIsComparing(false); // Exit comparison view
  };

  const handleFormSave = () => {
    setIsAddingHorse(false);
    setHorseToEdit(null);
    // Re-fetch horses to update the list (useEffect dependency handles this)
  };

  const handleFormCancel = () => {
    setIsAddingHorse(false);
    setHorseToEdit(null);
  };

  const handleHorseSelectForComparison = (horse: Horse, isChecked: boolean) => {
    setSelectedHorsesForComparison(prevSelected => {
      if (isChecked) {
        if (prevSelected.length < 2) {
          return [...prevSelected, horse];
        }
      } else {
        return prevSelected.filter(s => s.id !== horse.id);
      }
      return prevSelected; // If more than 2 selected, do nothing
    });
  };

  const handleCompareClick = () => {
    if (selectedHorsesForComparison.length === 2) {
      setIsComparing(true);
      setSelectedHorseId(null); // Clear single horse selection
      setIsAddingHorse(false); // Exit add view
      setHorseToEdit(null); // Exit edit view
    }
  };

  const handleBackFromComparison = () => {
    setIsComparing(false);
    setSelectedHorsesForComparison([]);
  };

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
        <h1>Horse List</h1>
        <button onClick={handleAddClick}>Add New Horse</button>
        <button
          onClick={handleCompareClick}
          disabled={selectedHorsesForComparison.length !== 2}
          style={{ marginLeft: '10px' }}
        >
          Compare Selected Horses
        </button>

        {isAddingHorse && (
          <HorseForm onSave={handleFormSave} onCancel={handleFormCancel} />
        )}

        {!isAddingHorse && !horseToEdit && !isComparing && (
          <ul>
            {horses.slice(0, 10).map((horse: Horse) => (
              <li key={horse.id} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedHorsesForComparison.some(s => s.id === horse.id)}
                  onChange={(e) => handleHorseSelectForComparison(horse, e.target.checked)}
                  disabled={selectedHorsesForComparison.length === 2 && !selectedHorsesForComparison.some(s => s.id === horse.id)}
                />
                <span onClick={() => setSelectedHorseId(horse.id!)} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                  {horse.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {isComparing && selectedHorsesForComparison.length === 2 && (
          <HorseComparison
            horse1={selectedHorsesForComparison[0]}
            horse2={selectedHorsesForComparison[1]}
            onBack={handleBackFromComparison}
          />
        )}

        {!isAddingHorse && !horseToEdit && !isComparing && selectedHorseId && (
          <div>
            <HorseDetails horseId={selectedHorseId} />
            <button onClick={() => {
              const horse = horses.find(h => h.id === selectedHorseId);
              if (horse) handleEditClick(horse);
            }}>Edit Horse</button>
          </div>
        )}
        {!isAddingHorse && !horseToEdit && !isComparing && !selectedHorseId && (
          <div>Select a horse to view details, edit, or select up to two for comparison.</div>
        )}
      </div>
    </div>
  );
}

export default App;