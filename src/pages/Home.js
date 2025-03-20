import React, { useState } from "react";
import "./Home.css";
import { NavBar } from "../components/NavBar.tsx";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [deerPark, setDeerPark] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const [predicted, setPredicted] = useState(false);
  const [projectError, setProjectError] = useState(null);
  const [pseudo, setPseudo] = useState(false);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(getPosition, handleError);
  }

  function handleError(err) {
    console.error("Geolocation error:", err);
    setDeerPark(false);
    setLocation(null);
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
          if (isAtDeerPark === 111000) {
            return (
              <div>
                <div className="text">DeerPark is Closed</div>
                <div className="lightText">Go home.</div>
              </div>
            )
          }
          setDeerPark(isAtDeerPark);

          if (isAtDeerPark) {
            console.log("You are at DeerPark, wait time is:", waitTime);
            setWaitTime(waitTime);
          } else {
            console.log("You are not at DeerPark");
            document.getElementById("title").style.textDecoration =
              "line-through";
          }
        })
        .catch((error) => {
          console.error("Error getting wait time:", error);
          setProjectError("Error: Failed to fetch wait time.");
        });
    } else {
      setProjectError(`Error: Your location accuracy is too low.`);
      console.log(
        `Error getting your location, accuracy was too low: ${coords.accuracy}`
      );
    }
  }
  const getPrediction = async () => {
    try {
      const response = await fetch(
        `https://waittime-api.onrender.com/predict-wait-time`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.message === "1") {
          setPredicted(true);
          setPseudo(true);
          document.getElementById("title").style.textDecoration =
            "line-through";
          setWaitTime(data.pseudo);
        } else if (data.message === "0") {
          console.log("Actual prediction:", data.message);
          setWaitTime(data.wait_time_prediction);
        }
      } else {
        throw new Error(`Unexpected error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching wait time:", error);
    }
  };

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
    if (waitTime === 111000) {
      return 111000;
    }
    return waitTime !== 101010;
  }
  return (
    <div className="background">
      <NavBar />
      <div id="title" className="title">
        {projectError ? projectError : "Current wait time is"}
      </div>
      {predicted ? (
        pseudo ? (
          <div>
            <div style={{ marginTop: "5rem" }} />
            <div className="lightText">
              Sorry, without enough data, we can't accurately predict a wait
              time right now. However, from studied and documented trends, we
              can suggest the line to take{" "}
            </div>
            <div className="minute">{waitTime}</div>
            <div className="text">minutes</div>
            <div style={{ marginTop: "2rem" }} />
            <div className="lightText">Please refresh to try again later.</div>
          </div>
        ) : (
          <div>
            <div className="minute">{waitTime}</div>
            <div className="text">minutes</div>
            <div className="lightText">
              This data was calculated and predicted from recent users at
              DeepPark
            </div>
          </div>
        )
      ) : location ? (
        deerPark ? (
          <div>
            <div className="minute">{waitTime}</div>
            <div className="text">minutes</div>
          </div>
        ) : (
          <div>
            <div style={{ marginTop: "3rem" }} />
            <div className="text">You are not at DeerPark</div>
            <div className="subtext">
              (or there was an issue getting your location)
            </div>
            <div style={{ marginTop: "10rem" }} />
            <div className="lightText">
              You can check the current (estimated) wait time here!
            </div>
            <div className="locationButton">
              <button className="button-34" onClick={getPrediction}>
                Check Wait Time
              </button>
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
            <button className="button-34" onClick={getPrediction}>
              Check Wait Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
