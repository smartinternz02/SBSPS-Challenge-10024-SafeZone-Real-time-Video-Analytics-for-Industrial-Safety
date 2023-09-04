import React  from "react";
import Navbar from "../Navbar";
import Banner from "./Banner";
import Goals from "./Aboutus";
import Tech from "./Technology";
import PreFoot from "./PreFoot";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <Banner />
            <Goals />
            <Tech />
            <PreFoot />
        </div>
    )
}

export default HomePage;