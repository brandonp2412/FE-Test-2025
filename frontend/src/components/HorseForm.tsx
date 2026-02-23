import React, { useState, useEffect } from 'react';

import { Horse, Physical, HorseProfile } from '../types/Horse'; // Import from shared types

interface HorseFormProps {
  horse?: Horse; // Optional horse for editing
  onSave: () => void; // Callback to refresh the list
  onCancel: () => void; // Callback to cancel form
}

const HorseForm: React.FC<HorseFormProps> = ({ horse, onSave, onCancel }) => {
  const [name, setName] = useState(horse?.name || '');
  const [favouriteFood, setFavouriteFood] = useState(horse?.profile?.favouriteFood || '');
  const [height, setHeight] = useState<string>(horse?.profile?.physical?.height?.toString() || '');
  const [weight, setWeight] = useState<string>(horse?.profile?.physical?.weight?.toString() || '');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form fields when a different horse is selected for editing
    setName(horse?.name || '');
    setFavouriteFood(horse?.profile?.favouriteFood || '');
    setHeight(horse?.profile?.physical?.height?.toString() || '');
    setWeight(horse?.profile?.physical?.weight?.toString() || '');
    setNameError(null);
  }, [horse]);

  const validateForm = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError(null);
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const horseData: Horse = {
      name: name,
      profile: {
        favouriteFood: favouriteFood || null,
        physical: {
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
        },
      },
    };

    try {
      const url = horse?.id
        ? `http://localhost:3016/horse/${horse.id}`
        : 'http://localhost:3016/horse';

      const method = horse?.id ? 'PUT' : 'POST'; // API docs say PUT for both add and update. Let's use PUT as instructed.
      // Assuming PUT /horse adds a new horse and returns the new id (as per API docs)
      // And PUT /horse/{id} updates the horse (as per API docs)

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(horseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onSave(); // Call onSave to refresh the horse list
    } catch (e: any) {
      alert(`Failed to save horse: ${e.message}`);
    }
  };

  return (
    <div>
      <h2>{horse ? 'Edit Horse' : 'Add New Horse'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
        </div>
        <div>
          <label htmlFor="favouriteFood">Favourite Food:</label>
          <input
            id="favouriteFood"
            type="text"
            value={favouriteFood}
            onChange={(e) => setFavouriteFood(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="height">Height (cm):</label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default HorseForm;