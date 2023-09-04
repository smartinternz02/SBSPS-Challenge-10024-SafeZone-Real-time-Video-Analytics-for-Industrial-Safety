import React from 'react';
import { Grid, Typography, Button, Paper } from '@mui/material';
import Bg from '../../images/bg2.png';

const Goal = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <Grid container spacing={4}>
                <Grid item xs={6} style={{ paddingRight: '1rem' }}>
                    <Typography variant="h1" style={{
                        fontWeight: 'bolder',
                        marginTop: '8rem',
                    }}>Our Goal
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" style={{
                        marginTop: '2rem',
                        padding: '2rem',
                    }}>
                        SafetyNet is a comprehensive industrial safety and surveillance system designed to enhance workplace safety and security. Leveraging live video streams from multiple areas within an industrial environment, it utilizes advanced computer vision and machine learning algorithms and IOT sensors  to monitor worker compliance with safety gear, detect signs of fire, gas leaks and recognize distress signals. By providing real-time alerts and notifications to both workers and supervisors, SafetyNet aims to minimize workplace accidents, ensure prompt responses to emergencies, and improve overall safety conditions in industrial settings.
                    </Typography>
                </Grid>
            </Grid>
            <img src={Bg} alt="Image" style={{ 
                width: '80%',
                marginTop: '8rem' }} />
        </div>
    )
}

export default Goal;