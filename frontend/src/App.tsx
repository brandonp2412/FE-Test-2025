import React, { useEffect, useState } from 'react';
import './App.css';

import { Horse, Physical, HorseProfile } from './types/Horse'; // Import from shared types
import HorseDetails from './components/HorseDetails';
import HorseForm from './components/HorseForm';

function App() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingHorse, setIsAddingHorse] = useState<boolean>(false);
  const [horseToEdit, setHorseToEdit] = useState<Horse | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  }, [isAddingHorse, horseToEdit]); // Re-fetch when adding/editing is done

  if (loading) {
    return <div className="App">Loading horses...</div>;
  }

  // Handler functions for form
  const handleAddClick = () => {
    setIsAddingHorse(true);
    setSelectedHorseId(null); // Clear selection when adding
    setHorseToEdit(null);
  };

  const handleEditClick = (horse: Horse) => {
    setHorseToEdit(horse);
    setIsAddingHorse(false);
    setSelectedHorseId(null); // Clear selection when editing
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

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
        <h1>Horse List</h1>
        <button onClick={handleAddClick}>Add New Horse</button>
        {isAddingHorse && (
          <HorseForm onSave={handleFormSave} onCancel={handleFormCancel} />
        )}
        {!isAddingHorse && !horseToEdit && ( // Only show list if not adding/editing
          <ul>
            {horses.slice(0, 10).map((horse) => (
              <li key={horse.id} onClick={() => setSelectedHorseId(horse.id)} style={{ cursor: 'pointer' }}>
                {horse.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {horseToEdit && (
          <HorseForm horse={horseToEdit} onSave={handleFormSave} onCancel={handleFormCancel} />
        )}
        {!isAddingHorse && !horseToEdit && selectedHorseId && (
          <div>
            <HorseDetails horseId={selectedHorseId} />
            <button onClick={() => {
              const horse = horses.find(h => h.id === selectedHorseId);
              if (horse) handleEditClick(horse);
            }}>Edit Horse</button>
          </div>
        )}
        {!isAddingHorse && !horseToEdit && !selectedHorseId && (
          <div>Select a horse to view details or edit.</div>
        )}
      </div>
    </div>
  );
}

export default App;
