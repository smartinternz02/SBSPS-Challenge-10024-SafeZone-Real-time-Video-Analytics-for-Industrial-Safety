import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import WarningIcon from '@mui/icons-material/Warning';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SensorsIcon from '@mui/icons-material/Sensors';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Link from '@mui/material/Link';
import { Grid } from '@mui/material';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    const socket = io('https://0f1c-103-185-11-79.ngrok-free.app/', {
      transports: ['websocket'],
      allowEIO3: true,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('notification', (data) => {
      setNotifications([...notifications, data]);
      setCurrentNotification(data);
      setOpenSnackbar(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [notifications]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getNotificationIcon = () => {
    if (currentNotification && currentNotification.type) {
      if (currentNotification.type === 'fire') {
        return <LocalFireDepartmentIcon fontSize="60px" />;
      } else if (currentNotification.type === 'hand-gesture') {
        return <WarningIcon fontSize="60px" />;
      }
    }
    return <SensorsIcon fontSize="60px" />;
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={12000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 0, width: '30%' }}
      >
        <Alert
          elevation={6}
            onClose={handleCloseSnackbar}
          variant="filled"
          icon={getNotificationIcon()}
          style={{
            color: '#ffffff',
            
            backgroundColor: currentNotification && currentNotification.type === 'fire'
            ? '#FF6B00'
            : currentNotification && currentNotification.type === 'hand-gesture'
            ? '#CC3300'
            : currentNotification && currentNotification.type === 'sensor'
            ? '#0530AD' 
            : '#FF0000', 

          width: '100%',
          }}
        >
        <Grid container>
            <Grid item xs={4} style={{
                justifyContent: "center",
                display: "flex",
            }}>

            <div style={{ marginLeft: '10px'}}>
            {currentNotification && (
                <AlertTitle style={{ fontSize: '20px' }}>{currentNotification.location}</AlertTitle>
            )}
            
          </div>
          </Grid>
            <Grid item xs={6} style={{
                justifyContent: "center",
                display: "flex",
            }}>
            <div style={{ marginLeft: '10px'}}>
            {currentNotification && (
                <AlertTitle style={{ fontSize: '15px' }}>{currentNotification.timestamp}</AlertTitle>
            )}
            </div>
            </Grid>
          <Grid item xs={2} style={{
                justifyContent: "center",
                display: "flex",
            }}>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          {currentNotification && currentNotification.video_link && (
            <Link href={currentNotification.video_link} target="_blank" rel="noopener noreferrer">
              <PlayCircleIcon style={{
                fontSize: '40px',  // Adjust the font size as desired
                color: '#ffffff',
              }} />
            </Link>
          )}
          </div>
          </Grid>
        </Grid>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
