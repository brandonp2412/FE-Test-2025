import React, { useEffect, useState } from 'react';

import { Horse, getHorseClassification } from '../types/Horse';

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
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setHorse(null);

    const fetchHorseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3016/horse/${horseId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Horse = await response.json();
        if (!controller.signal.aborted) {
          setHorse(data);
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError' && !controller.signal.aborted) {
          setError(e?.message || 'Failed to load horse details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHorseDetails();
    return () => controller.abort();
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
        <Typography variant="body1" sx={{ mt: 1 }}>Classification: {displayValue(getHorseClassification(horse))}</Typography>

        <Typography variant="h6" component="div" sx={{ mt: 2 }}>Profile:</Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemText primary={`Favourite Food: ${displayValue(horse.profile?.favouriteFood)}`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary={`Physical: ${displayValue(horse.profile?.physical?.height)} cm x ${displayValue(horse.profile?.physical?.weight)} kg`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default HorseDetails;
