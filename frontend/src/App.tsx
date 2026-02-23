import React, { useEffect, useState } from 'react';
import './App.css'; // Keep this for potential global styles or overrides

import { Horse } from './types/Horse';
import HorseDetails from './components/HorseDetails';
import HorseForm from './components/HorseForm';
import HorseComparison from './components/HorseComparison';

// MUI Imports
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#red', // Using a simple string for now, could be theme.palette.error.main
    },
  },
});

function App() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingHorse, setIsAddingHorse] = useState<boolean>(false);
  const [horseToEdit, setHorseToEdit] = useState<Horse | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorsesForComparison, setSelectedHorsesForComparison] = useState<Horse[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

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
  }, [isAddingHorse, horseToEdit, isComparing]);

  const handleAddClick = () => {
    setIsAddingHorse(true);
    setSelectedHorseId(null);
    setHorseToEdit(null);
    setSelectedHorsesForComparison([]);
    setIsComparing(false);
  };

  const handleEditClick = (horse: Horse) => {
    setHorseToEdit(horse);
    setIsAddingHorse(false);
    setSelectedHorseId(null);
    setSelectedHorsesForComparison([]);
    setIsComparing(false);
  };

  const handleFormSave = () => {
    setIsAddingHorse(false);
    setHorseToEdit(null);
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
      return prevSelected;
    });
  };

  const handleCompareClick = () => {
    if (selectedHorsesForComparison.length === 2) {
      setIsComparing(true);
      setSelectedHorseId(null);
      setIsAddingHorse(false);
      setHorseToEdit(null);
    }
  };

  const handleBackFromComparison = () => {
    setIsComparing(false);
    setSelectedHorsesForComparison([]);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component={Box} sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>Loading horses...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component={Box} sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" color="error" gutterBottom>Error: {error}</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Horse Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component={Box} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Panel: Horse List and Add Button */}
          <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2" gutterBottom>Horse List</Typography>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={handleAddClick}>Add New Horse</Button>
              <Button
                variant="contained"
                onClick={handleCompareClick}
                disabled={selectedHorsesForComparison.length !== 2}
                sx={{ ml: 2 }}
              >
                Compare Selected Horses
              </Button>
            </Box>

            {(!isAddingHorse && !horseToEdit && !isComparing) && (
              <List>
                {horses.slice(0, 10).map((horse: Horse) => (
                  <ListItem key={horse.id} disablePadding>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedHorsesForComparison.some(s => s.id === horse.id)}
                          onChange={(e) => handleHorseSelectForComparison(horse, e.target.checked)}
                          disabled={selectedHorsesForComparison.length === 2 && !selectedHorsesForComparison.some(s => s.id === horse.id)}
                        />
                      }
                      label={
                        <Typography
                          component="span"
                          onClick={() => setSelectedHorseId(horse.id!)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {horse.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Right Panel: Details, Edit Form, or Comparison */}
          <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
            {(isAddingHorse || horseToEdit) && (
              <HorseForm 
                horse={horseToEdit || undefined} 
                onSave={handleFormSave} 
                onCancel={handleFormCancel} 
              />
            )}

            {!(isAddingHorse || horseToEdit) && isComparing && selectedHorsesForComparison.length === 2 && (
              <HorseComparison
                horse1={selectedHorsesForComparison[0]}
                horse2={selectedHorsesForComparison[1]}
                onBack={handleBackFromComparison}
              />
            )}

            {!(isAddingHorse || horseToEdit) && !isComparing && selectedHorseId && (
              <Box>
                <HorseDetails horseId={selectedHorseId} />
                <Button variant="contained" onClick={() => {
                  const horse = horses.find(h => h.id === selectedHorseId);
                  if (horse) handleEditClick(horse);
                }} sx={{ mt: 2 }}>Edit Horse</Button>
              </Box>
            )}
            {!(isAddingHorse || horseToEdit) && !isComparing && !selectedHorseId && (
              <Typography variant="body1">Select a horse to view details, edit, or select up to two for comparison.</Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
