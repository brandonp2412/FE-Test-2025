import React, { useEffect, useState } from 'react';

import { Horse } from '../types/Horse';

// MUI Imports
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

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

  const displayValue = (value: any) => (value !== null && value !== undefined && value !== "") ? value : "-";

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading horse details...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  if (!horse) {
    return <Typography variant="body1">No horse data found.</Typography>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>{displayValue(horse.name)}</Typography>
        <Typography variant="body2" color="text.secondary">ID: {displayValue(horse.id)}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>Classification: {displayValue(horse.classification)}</Typography>

        <Typography variant="h6" component="div" sx={{ mt: 2 }}>Profile:</Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemText primary={`Favourite Food: ${displayValue(horse.profile?.favouriteFood)}`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Physical:" />
            <List dense sx={{ pl: 2 }}>
              <ListItem disablePadding>
                <ListItemText primary={`Height: ${displayValue(horse.profile?.physical?.height)} cm`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary={`Weight: ${displayValue(horse.profile?.physical?.weight)} kg`} />
              </ListItem>
            </List>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default HorseDetails;