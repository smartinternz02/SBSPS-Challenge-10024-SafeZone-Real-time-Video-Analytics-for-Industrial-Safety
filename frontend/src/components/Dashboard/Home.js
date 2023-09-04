import React from "react";
import { useState, useEffect } from 'react';
import EventCard from "./EventCard";
import { Grid,Card,CardContent,Typography } from "@mui/material";
import SafetyCard from "./SafetyCard";
import GestureCard from "./GestureCard";
import SensorCard from "./SensorCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase";
import { useParams } from 'react-router-dom';
import { useUser } from "./UserContext";


export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [gestureData, setGestureData] = useState([]);
  const [fireData, setFireData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const { loginType } = useParams();
  const { setUserId, setUserType } = useUser();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
        setUserId(uid);
        setUserType(loginType);
  
        const fetchEvents = async () => {
          try {
            const response = await fetch(
              `https://0f1c-103-185-11-79.ngrok-free.app/getdata?user_id=${uid}&user_type=${loginType}`
            );
            const data = await response.json();

            const processedSafetyData = data.safety_gear_data.map((safetyItem) => {
              const text = Object.keys(safetyItem.data)
                .filter((key) => key.startsWith('no-'))
                .map((key) => `${safetyItem.data[key]} No ${key.replace('no-', '')}`)
                .join(', ');

              return {
                ...safetyItem,
                text,
              };
            });

            setEvents(data.camera_data);
            setSafetyData(processedSafetyData);
            setGestureData(data.hand_gesture_data);
            setFireData(data.fire_detection_data);
            setSensorData(data.sensor_data);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        };
  
        fetchEvents(); // Call the fetchEvents function here
  
      } else {
        console.log("user is logged out");
      }
    });
    }, []);
    console.log("events", events);
    return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        margin: '0px',
        width: '100%',
      }}>
              <h1>Dashboard</h1>
              <h2 style={{
                marginTop: "5px",
                marginBottom: "5px",
                marginLeft: "10px",
              }}>Live Stream</h2>
              <div style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "2px",
              }}
              >
                {events.map((event, index) => (
                  <EventCard
                    key={index}
                    imageUrl={event.image_link}
                    location={event.location}
                    videoLink={event.video_link}
                  />
                ))}
              
              </div>
              <Grid container spacing={2} style={{
                paddingRight: '30px',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                textAlign: 'start',
              }}>
                <Grid item xs={12} sm={6}>

                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                      }}>
                        Safety Gear
                      </Typography>
                      <div
                        style={{
                          height: '300px', 
                          overflowY: 'auto',
                        }}
                      >
                      {safetyData.map((safetyItem, index) => (
                        <SafetyCard
                          key={index}
                          location={safetyItem.location}
                          text={safetyItem.text}
                          timestamp={safetyItem.timestamp}
                        />
                      ))}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>

                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                      }}>
                      Hand Gesture
                      </Typography>
                      <div
                        style={{
                          height: '300px', 
                          overflowY: 'auto',
                        }}
                      >
                      {gestureData.map((gestureItem, index) => (
                        <GestureCard
                          key={index}
                          location={gestureItem.location}
                          timestamp={gestureItem.timestamp}
                          video_link={gestureItem.video_link}
                          type = "gesture"
                        />
                      ))}
                      </div>

                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{
                paddingRight: '30px',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                textAlign: 'start',
              }}>
              <Grid item xs={12} sm={6}>
                <div
                    style={{
                      height: '400px', 
                      overflowY: 'auto',
                    }}
                  >
                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                      }}>
                        Fire Detection
                      </Typography>
                      <div
                        style={{
                          height: '300px', 
                          overflowY: 'auto',
                        }}
                      >
                      {fireData.map((fireItem, index) => (
                        <GestureCard
                          key={index}
                          location={fireItem.location}
                          timestamp={fireItem.timestamp}
                          video_link={fireItem.video_link}
                          type = "fire"
                        />
                      ))}
                      </div>
                      
                    </CardContent>
                  </Card>
                  </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div
                    style={{
                      height: '400px', 
                      overflowY: 'auto',
                    }}
                  >
                  <Card>
                    <CardContent>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                      }}>
                        Sensors
                      </Typography>
                      <div
                        style={{
                          height: '300px', 
                          overflowY: 'auto',
                        }}
                      >
                      {sensorData.map((sensorItem, index) => (
                        <SensorCard
                          key={index}
                          location={sensorItem.location}
                          status={sensorItem.status}
                        />
                      ))}
                      </div>
                    </CardContent>
                  </Card>
                  </div>
              </Grid> 
            </Grid>

    </div>
  );
}