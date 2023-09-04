import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const SafetyCard = props => {
  return (
    <Card style={{
        marginTop: "1rem",
    }}>
      <CardContent style={{
            padding: "0rem",
            margin: "0rem",
      }}>
        <Grid container spacing={1} direction="row" alignItems="center" >
            <Grid item xs={2} style={{
                justifyContent: "center",
                display: "flex",
            }}>
                <WarningIcon sx={{ fontSize: 30, color: '#FFB800' }}/>
            </Grid>
            <Grid item xs={8}>
                <p style={{
                    fontSize: "1.2rem",
                    color: '#FFB800',
                    marginBottom: "0rem",
                }}>
                    {props.location}
                </p>
                <p style={{
                    marginTop: "0rem",
                    fontSize: "1rem",
                    marginBottom: "0rem",
                }}>{props.text}</p>
                <p style={{
                    marginTop: "0rem",
                    fontSize: "1rem",
                    color: 'grey',
                }}>{props.timestamp}</p>
                
            </Grid>
            <Grid item xs={2} style={{
                justifyContent: "center",
                display: "flex",
            }}>
                <PriorityHighIcon sx={{ fontSize: 30,color: '#FFB800', }}/>
            </Grid>

        </Grid>
        </CardContent>
    </Card>
  );
}
export default SafetyCard;