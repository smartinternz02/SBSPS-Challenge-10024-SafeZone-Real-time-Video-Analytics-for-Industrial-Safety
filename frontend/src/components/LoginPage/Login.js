import React, { useState } from "react";
import Bg from "../../images/LoginBg.png";
import { Grid, TextField, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Bg2 from "../../images/LoginBg2.png";
import { Link, useNavigate } from 'react-router-dom';
import {auth} from '../../Firebase';
import {  signInWithEmailAndPassword   } from 'firebase/auth';


const Login = () => {
    const [loginType, setLoginType] = useState("admin");
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginTypeChange = (event, newLoginType) => {
        if (newLoginType !== null) {
            setLoginType(newLoginType);
        }
    };

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (loginType === "admin") {
                var type = "admin";
            } else {
                var type = "managers";
            }
            navigate(`/dashboard/${type}`);
            console.log(user);
            console.log(type);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: loginType === "admin" ? `url(${Bg})` : `url(${Bg2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100vh",
        }}>
            <Grid container>
                <Grid item xs={7}>
                    <h1
                        style={{
                            color: 'white',
                            fontSize: '8rem',
                        }}>SafetyNet.</h1>
                </Grid>
                <Grid item xs={5}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '30px',
                        margin: '2rem',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <GppGoodIcon sx={{ fontSize: 60, color: '#0530AD' }} />
                        <h1 style={{
                            marginTop: '0',
                        }}> SafetyNet.</h1>
                        <h2 style={{
                            marginTop: '0',
                        }}> Login</h2>
                        <ToggleButtonGroup
                            value={loginType}
                            exclusive
                            onChange={handleLoginTypeChange}
                            aria-label="login type"
                            style={{
                                marginBottom: '1rem',
                            }}
                        >
                            <ToggleButton
                                value="admin"
                                aria-label="admin"
                                style={{
                                    borderRadius: loginType === "admin" ? '30px' : '30px 0px 0px 30px',
                                    width: '10rem',
                                    backgroundColor: loginType === "admin" ? '#0530AD' : 'white',
                                    color: loginType === "admin" ? 'white' : 'black',
                                    marginRight: loginType === "admin" ? '0px' : '0px',
                                }}
                            >
                                Admin
                            </ToggleButton>
                            <ToggleButton
                                value="manager"
                                aria-label="manager"
                                style={{
                                    borderRadius: loginType === "manager" ? '30px' : '0px 30px 30px 0px',
                                    width: '10rem',
                                    backgroundColor: loginType === "manager" ? '#0530AD' : 'white',
                                    color: loginType === "manager" ? 'white' : 'black',
                                    marginLeft: loginType === "manager" ? '-30px' : '0px',

                                }}
                            >
                                Manager
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <TextField id="outlined-basic"  onChange={(e) => setEmail(e.target.value)} label="Username" variant="outlined"
                            style={{
                                width: '80%',
                            }} />
                        <TextField id="outlined-basic" onChange={(e) => setPassword(e.target.value)} label="Password" type="password" variant="outlined"
                            style={{
                                marginTop: '1rem',
                                width: '80%',
                            }} />
                        <Button variant="contained" onClick={onLogin} style={{
                            backgroundColor: '#0530AD',
                            borderRadius: '30px',
                            padding: '1rem 2rem',
                            marginTop: '1rem',
                        }}>Login</Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login;
