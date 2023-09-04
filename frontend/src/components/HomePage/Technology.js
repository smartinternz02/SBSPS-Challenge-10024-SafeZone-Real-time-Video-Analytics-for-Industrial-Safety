import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import GppGoodIcon from '@mui/icons-material/GppGood';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SensorsIcon from '@mui/icons-material/Sensors';

const Tech = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h2" style={{
                marginTop: '8rem',
                fontWeight: 'bold',
            }}>Our technologies that benefit you
            </Typography>
            <Grid container spacing={4} style={{
                marginTop: '2rem',
            }}>
                <Grid item xs={3}>
                <div style={{ padding: '1rem' }}>
                    <GppGoodIcon color='primary' sx={{ fontSize: 60 }}/>

                    <h2 style={{
                        fontWeight: 'bold',
                    }}>Safety Gear Detection</h2>
                    <p>Workers could be monitored to check if they are wearing safety gear like helmets, gloves, etc.</p>
                </div>
                </Grid>
                <Grid item xs={3}>
                <div style={{ padding: '1rem' }}>
                    <WavingHandIcon color='primary' sx={{ fontSize: 60 }}/>
                    <h2 style={{
                        fontWeight: 'bold',
                    }}> Hand Gesture Recognition</h2>
                    <p>
                        Workers could use hand gestures to control machines, or to alert authorities in case of an emergency.
                    </p>
                </div>
                </Grid>
                <Grid item xs={3}>
                <div style={{ padding: '1rem' }}>
                    <ReportProblemIcon color='primary' sx={{ fontSize: 60 }}/>
                    <h2 style={{
                        fontWeight: 'bold',
                    }}>Fire Detection</h2>
                    <p>Factory Fires could be detected and prevented using this module and avoided using immediate alerts</p>
                </div>
                </Grid>
                <Grid item xs={3}>
                <div style={{ padding: '1rem' }}>
                    <SensorsIcon color='primary' sx={{ fontSize: 60 }}/>
                    <h2 style={{
                        fontWeight: 'bold',
                    }}>Sensor Data</h2>
                    <p>Temperature, Humidity, Pressure, etc. could be monitored using sensors and alerts could be sent in case of any abnormality</p>
                </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Tech;