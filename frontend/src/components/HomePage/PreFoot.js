import React from 'react';
import { Grid, Typography, Button } from '@mui/material';

const PreFoot = () => {
    return (
        <div style={{ 
            backgroundColor: '#0530AD',
        }}>
            <Grid container spacing={4} style={{
                marginTop: '2rem',
            }}>
                <Grid item xs={8} >
                    <div style={{ padding: '5rem' }}>
                        <h1 style={{
                            color: 'white',
                            fontSize: '3rem',
                        }}>
                        Start Your 14 Days Free Trial of Our Safety System
                        </h1>
                        <p style={{
                            color: 'white',
                        }}>
                        SafetyNet is a comprehensive industrial safety and surveillance system designed to enhance workplace safety and security. Leveraging live video streams from multiple areas within an industrial environment, it utilizes advanced computer vision and machine learning algorithms and IOT sensors  to monitor worker compliance with safety gear, detect signs of fire, gas leaks and recognize distress signals. By providing real-time alerts and notifications to both workers and supervisors, SafetyNet aims to minimize workplace accidents, ensure prompt responses to emergencies, and improve overall safety conditions in industrial settings.
                        </p>
                        <Button variant="contained" style={{
                            backgroundColor: 'black',
                            borderRadius: '30px',
                            padding: '1rem 2rem',
                        }}>Watch A Demo</Button>
                        <Button variant="contained" style={{
                            backgroundColor: 'transparent',
                            borderRadius: '30px',
                            padding: '1rem 2rem',
                            marginLeft: '1rem',
                            border: '0.5px solid white',
                        }}>Contact Us</Button>
                    </div>

                </Grid>
                <Grid item xs={4} >
                </Grid>
            </Grid>
        </div>
    )
}

export default PreFoot