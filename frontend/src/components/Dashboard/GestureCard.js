import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const SafetyCard = props => {
  const renderIcon = () => {
    if (props.type === "gesture") {
      return <WarningIcon sx={{ fontSize: 30, color: '#FF0000' }} />;
    } else if (props.type === "fire") {
      return <LocalFireDepartmentIcon sx={{ fontSize: 30, color: '#FF6B00' }} />;
    } else {
      return null;
    }
  };

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
                {renderIcon()}
            </Grid>
            <Grid item xs={8}>
                <p style={{
                    fontSize: "1.2rem",
                    color: props.type === "gesture" ? "#FF0000" : "#FF6B00",
                    marginBottom: "0rem",
                }}>
                    {props.location}
                </p>
                <p style={{
                    marginTop: "0rem",
                    fontSize: "1rem",
                }}>{props.timestamp}</p>
            </Grid>
            <Grid item xs={2} style={{
                justifyContent: "center",
                display: "flex",
            }}>
                <a href={props.video_link} target="_blank" rel="noopener noreferrer">
                <PlayCircleIcon sx={{ fontSize: 30,color: '#0530AD', }}/>
                </a>
            </Grid>
        </Grid>
        </CardContent>
    </Card>
  );
}
export default SafetyCard;
