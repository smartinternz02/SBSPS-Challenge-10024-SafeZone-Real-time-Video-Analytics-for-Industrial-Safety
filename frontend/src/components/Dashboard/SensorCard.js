import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';

const SensorCard = props => {
    return (
        <Card style={{
            margin: '5px',
        }}>
            <CardContent>
                <Grid container spacing={1} direction="row" alignItems="center" >
                    <Grid item xs={2} style={{
                        justifyContent: "center",
                        display: "flex",
                    }}>
                        {props.status === true ? (
                            <SensorsIcon sx={{ fontSize: 30, color: '#00FF00' }} />
                        ) : (
                            <SensorsOffIcon sx={{ fontSize: 30, color: '#FF0000' }} />
                        )}
                    </Grid>
                    <Grid item xs={10}>
                        <p style={{
                            fontSize: "1rem",
                            color: props.status === true ? "#00FF00" : "#FF0000",
                        }}>
                            {props.location}
                        </p>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default SensorCard;
