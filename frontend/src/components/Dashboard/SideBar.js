import React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import {  signOut } from "firebase/auth";
import { auth } from "../../Firebase";

export default function IconMenu({ activeComponent, onHomeClick, onStatisticsClick }) {
  const navigate = useNavigate();
  const handleLogout = () => {               
      signOut(auth).then(() => {
          navigate("/login");
          console.log("Signed out successfully")
      }).catch((error) => {
      });
  }

  const handleMenuItemClick = (event, index) => {
    if (index === 0) {
      onHomeClick(); 
    } else if (index === 1) {
      onStatisticsClick(); 
    }
    console.log("activeComponent:", activeComponent);
    console.log("index:", index);
  };

  return (
    <Paper
      sx={{
        width: 250,
        borderRadius: "20px",
        maxWidth: "100%",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "1rem",
        margin: "1rem",
      }}
    >
      <h2>SafetyNet.</h2>
      <MenuList>
        <MenuItem
          selected={activeComponent === "home"}
          onClick={(event) => handleMenuItemClick(event, 0)}
          style={{
            backgroundColor: activeComponent === "home" ? "#1F1F1F" : "transparent",
            borderRadius: "10px",
          }}
        >
          <ListItemIcon>
            <HomeOutlinedIcon fontSize="large" style={{ color: "#ffffff" }} />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        <MenuItem
          selected={activeComponent === "statistics"}
          onClick={(event) => handleMenuItemClick(event, 1)}
          style={{
            backgroundColor: activeComponent === "statistics" ? "#1F1F1F" : "transparent",
            borderRadius: "10px",
          }}
        >
          <ListItemIcon>
            <BarChartOutlinedIcon fontSize="large" style={{ color: "#ffffff" }} />
          </ListItemIcon>
          <ListItemText>Statistics</ListItemText>
        </MenuItem>
        <MenuItem
          selected={activeComponent === "teams"}
          onClick={(event) => handleMenuItemClick(event, 2)}
          style={{
            backgroundColor: activeComponent === "teams" ? '#1F1F1F' : 'transparent',
            borderRadius: '10px',
          }}
        >
          <ListItemIcon>
            <Groups2OutlinedIcon fontSize="large" style={{
              color: '#ffffff'
            }} />
          </ListItemIcon>
          <ListItemText>Teams</ListItemText>
          
        </MenuItem>
        <MenuItem
          selected={activeComponent === "settings"}
          onClick={(event) => handleMenuItemClick(event, 3)}
          style={{
            backgroundColor: activeComponent === "settings" ? '#1F1F1F' : 'transparent',
            borderRadius: '10px',
            marginTop: '21rem',
          }}
        >
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="large" style={{
              color: '#ffffff'
            }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
          
        </MenuItem>
        <MenuItem
          selected={activeComponent === "logout"}
          onClick={handleLogout}
          style={{
            backgroundColor: activeComponent === "logout" ? '#1F1F1F' : 'transparent',
            borderRadius: '10px',
          }}

        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="large" style={{
              color: '#ffffff'
            }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
          
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
