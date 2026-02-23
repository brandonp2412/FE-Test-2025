import React from 'react';
import { Horse } from '../types/Horse';

// MUI Imports
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface HorseComparisonProps {
  horse1: Horse;
  horse2: Horse;
  onBack: () => void;
}

const HorseComparison: React.FC<HorseComparisonProps> = ({ horse1, horse2, onBack }) => {
  const displayValue = (value: any) => (value !== null && value !== undefined && value !== "") ? value : "-";

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>Horse Comparison</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Card sx={{ flex: 1 }} variant="outlined">
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>{displayValue(horse1.name)}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {displayValue(horse1.id)}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>Classification: {displayValue(horse1.classification)}</Typography>
            <Typography variant="subtitle1" component="div" sx={{ mt: 2 }}>Profile:</Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemText primary={`Favourite Food: ${displayValue(horse1.profile?.favouriteFood)}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="Physical:" />
                <List dense sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemText primary={`Height: ${displayValue(horse1.profile?.physical?.height)} cm`} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText primary={`Weight: ${displayValue(horse1.profile?.physical?.weight)} kg`} />
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }} variant="outlined">
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>{displayValue(horse2.name)}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {displayValue(horse2.id)}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>Classification: {displayValue(horse2.classification)}</Typography>
            <Typography variant="subtitle1" component="div" sx={{ mt: 2 }}>Profile:</Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemText primary={`Favourite Food: ${displayValue(horse2.profile?.favouriteFood)}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="Physical:" />
                <List dense sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemText primary={`Height: ${displayValue(horse2.profile?.physical?.height)} cm`} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText primary={`Weight: ${displayValue(horse2.profile?.physical?.weight)} kg`} />
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
      <Button variant="contained" onClick={onBack} sx={{ mt: 3 }}>Back to List</Button>
    </Box>
  );
};

export default HorseComparison;
export {}; // Add this line to make it a module
