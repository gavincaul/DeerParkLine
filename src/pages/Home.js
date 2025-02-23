import React, { useState } from "react";
import "./Home.css";
import { NavBar } from "../components/NavBar.tsx";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [deerPark, setDeerPark] = useState(false);
  let waitTime = 3;
  


  function checkStorage() {
    navigator.geolocation.getCurrentPosition(getPosition, (err) =>
      console.error("Geolocation error:", err)
    );
  }
  function getPosition(position) {
    const coords = position.coords;
    if (coords.accuracy <= 100) {
      sessionStorage.setItem("location", JSON.stringify(coords));
      setLocation(coords);
      setDeerPark(checkLocation(coords.latitude, coords.longitude));
    } else {
      console.log("Error getting your location");
    }
  }

  function checkLocation(lat, long) {
    if (39.6828 < lat && lat < 39.6836 && -75.7561 < long && long < -75.7557) {
      return true
    } else {
      document.getElementById("title")?.classList.add("strike");
      return true
    }
  }
  

  return (
    <div className="background">
      <NavBar />
      <div id="title" className="title">
        Current wait time is
      </div>
      {location ? (
        deerPark ? (
          <div>
            <div className="minute">{waitTime}</div>
            <div className="text">minutes</div>
          </div>
        ) : (
          <div>
            <div style={{ marginTop: "3rem" }} />
            <div className="text">You are not at DeerPark</div>
            <div className="subtext">(or there was an issue getting your location)</div>
            <div style={{ marginTop: "10rem" }} />
            <div className="lightText">
              You can check the current (estimated) wait time here!
            </div>
            <div className="locationButton">
              <button className="button-34">Check Wait Time</button>
            </div>
          </div>
        )
      ) : (
        <div>
          <div className="text">...</div>
          <div style={{ marginTop: "5rem" }} />
          <div className="lightText">
            You need to share your location to find your wait time.
          </div>
          <div className="locationButton">
            <button className="button-34" onClick={checkStorage}>
              Share Location
            </button>
          </div>
          <div style={{ marginTop: "10rem" }} />
          <div className="lightText">
            Or check the current (estimated) wait time.
          </div>
          <div className="locationButton">
            <button className="button-34">Check Wait Time</button>
          </div>
        </div>
      )}
    </div>
  );
}
