import React, { useState } from "react";
import "./Home.css";
import { NavBar } from "../components/NavBar.tsx";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [deerPark, setDeerPark] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const [projectError, setProjectError] = useState(null);


  function getLocation() {
    navigator.geolocation.getCurrentPosition(getPosition, handleError);
  }


  function handleError(err) {
    console.error("Geolocation error:", err);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setProjectError("Permission denied. Please enable location access.");
        break;
      case err.POSITION_UNAVAILABLE:
        setProjectError("Location information is unavailable.");
        break;
      case err.TIMEOUT:
        setProjectError("The request to get your location timed out.");
        break;
      default:
        setProjectError("An unknown error occurred while retrieving location.");
        break;
    }
  }
  


  function getPosition(position) {
    const coords = position.coords;
    if (coords.accuracy <= 1000) {
      setLocation(coords);


      getWaitTime(coords.latitude, coords.longitude)
        .then((waitTime) => {
          const isAtDeerPark = checkLocation(waitTime); 
          setDeerPark(isAtDeerPark);

          if (isAtDeerPark) {
            console.log("You are at DeerPark, wait time is:", waitTime);
            setWaitTime(waitTime);
          } else {
            console.log("You are not at DeerPark");
            document.getElementById("title").style.textDecoration = "line-through";
          }
        })
        .catch((error) => {
          console.error("Error getting wait time:", error);
          setProjectError("Error: Failed to fetch wait time.");
        });
    } else {
      setProjectError(`Error: Your location accuracy is too low.::Accuracy ${coords.accuracy}`);
      console.log(`Error getting your location, accuracy was too low: ${coords.accuracy}`);
    }
  }


  const getWaitTime = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://waittime-api.onrender.com/calculate-wait-time?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.wait_time; 
    } catch (error) {
      console.error("Error fetching wait time:", error);
      throw error; 
    }
  };

  function checkLocation(waitTime) {
  
    return waitTime !== 101010;
  }

  return (
    <div className="background">
      <NavBar />
      <div id="title" className="title">
        {projectError ? projectError : "Current wait time is"}
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
            <button className="button-34" onClick={getLocation}>
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
