import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const EventCard = ({ imageUrl, location, videoLink }) => {
  return (
    <Card sx={{ maxWidth: 250, backgroundColor: 'transparent', boxShadow: '0', margin: '5px' }}>
      <a href={videoLink} target="_blank" rel="noopener noreferrer">
        <div style={{ position: 'relative' }}>
          <img
            height="150"
            width="250"
            src={imageUrl}
            style={{
              objectFit: 'cover',
              borderRadius: '20px',
            }}
            alt="Event Image"
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <PlayCircleFilledWhiteIcon
              style={{
                fontSize: '3rem',
                color: 'white',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </a>
      <CardContent style={{
        margin: '0',
        paddingTop: '0',
        paddingBottom: '0',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        textAlign: 'left',
      }}>
        <Typography variant="body2" style={{
          fontSize: '1rem',
        }}>
          {location}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
