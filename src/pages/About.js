import React from "react";
import { NavBar } from "../components/NavBar.tsx";
import "./About.css";
import gavinPic from "../data/gavinpic.jpg";
import eliPic from "../data/elipic.jpg";

export default function About() {
  return (
    <div className="background">
      <NavBar />
      <div className="title">About</div>
      <div className="gridcontainer">
        <div className="grid">
          <div className="profile">
          <img src={gavinPic} style={{"cursor": "pointer"}} alt="Gavin" onClick={() => window.location.href = "https://gavincaulfield.com"} />
            <div className="name" >Gavin Caulfield</div>
          </div>
          <div className="profile">
          <img src={eliPic} alt="Eli" style={{"cursor": "pointer"}}  onClick={() => window.location.href = "https://github.com/EliBrignac"} />
            <div className="name">Eli Brignac</div>
          </div>
        </div>
      </div>
      <div className="abouttxt">We made this website to get VIP cards at Deer Park Tavern. It uses geolocation and machine learning predicition analysis to estimate your wait time to enter Deer Park. The algorithm factors in time, day, weather, and our very precise impatience meter. WE DO NOT SAVE YOUR GEOLOCATION INFORMATION. We do however collect it for prediction analysis to improve the algorithm. Your device information is never taken into account, and we will never ask for your personal information. This is a tool.</div>
      <div className="abouttxt">Drink responsibly; Tip your bartenders.</div>
    </div>
  );
}
