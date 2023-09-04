import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import Bg from '../../images/bg.png';

const Banner = () => {

  return (
    <div style={{ padding: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={6} style={{ paddingRight: '1rem' }}>
            <Typography variant="h6" style={{
            }}>
            Enhancing industrial safety by detecting and preventing potential hazards.
            </Typography>
            <Typography variant="h1" style={{
            }}>
            Best in Class Digital <Typography variant='h1'
            style={{
                color: '#0530AD',

            }}>
            Industrial Safety</Typography>  System
            </Typography>
            <Button variant="contained" style={{ 
                margin: '20px',
                backgroundColor: '#0530AD',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '30px',
         }}>
                Watch A Demo
            </Button>
            <Button variant="contained" style={{
                margin: '20px',
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '10px',
                borderRadius: '30px',
            }}>
                Contact Us
            </Button>
        </Grid>
        <Grid item xs={6}>
            <img src={Bg} alt="Image" style={{ maxWidth: '100%' }} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Banner;