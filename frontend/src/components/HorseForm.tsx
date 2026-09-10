import React, { useState, useEffect } from 'react';

import { Horse } from '../types/Horse';

// MUI Imports
import {
  Typography,
  Button,
  TextField,
  Box,
} from '@mui/material';

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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
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
    if (isSaving || !validateForm()) {
      return;
    }
    setIsSaving(true);

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

      onSave();
    } catch (e: any) {
      alert(`Failed to save horse: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>{horse ? 'Edit Horse' : 'Add New Horse'}</Typography>

      <TextField
        fullWidth
        margin="normal"
        id="name"
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!nameError}
        helperText={nameError}
      />

      <TextField
        fullWidth
        margin="normal"
        id="favouriteFood"
        label="Favourite Food"
        variant="outlined"
        value={favouriteFood}
        onChange={(e) => setFavouriteFood(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        id="height"
        label="Height (cm)"
        type="number"
        variant="outlined"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        id="weight"
        label="Weight (kg)"
        type="number"
        variant="outlined"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={isSaving} sx={{ ml: 2 }}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default HorseForm;
