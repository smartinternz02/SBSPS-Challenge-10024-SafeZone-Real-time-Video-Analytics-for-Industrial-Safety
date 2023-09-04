import React, { useState } from "react";
import SideBar from "./SideBar";
import { Grid } from "@mui/material";
import WebSocketComponent from "../WebSocket";
import Home from "./Home";
import Statistics from "./Statistics"; // Import the Statistics component

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("home");

  const switchToHome = () => {
    setActiveComponent("home");
  };

  const switchToStatistics = () => {
    setActiveComponent("statistics");
  };

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <SideBar
            activeComponent={activeComponent}
            onHomeClick={switchToHome}
            onStatisticsClick={switchToStatistics}
          />
        </Grid>
        <Grid item xs={9}>
          {activeComponent === "home" ? <Home /> : <Statistics />}
        </Grid>
      </Grid>
      <div>
        <WebSocketComponent />
      </div>
    </div>
  );
}
