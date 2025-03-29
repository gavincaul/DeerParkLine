import { useState } from "react";

export default function DebugAdmin() {
  const [latLong, setLatLong] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const [waitTime, setWaitTime] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResult, setJsonResult] = useState(null); // Store full JSON response

  const handleLatLong = (event) => setLatLong(event.target.value);
  const handleDay = (event) => setDay(event.target.value);
  const handleHour = (event) => setHour(event.target.value);
  const handleMin = (event) => setMin(event.target.value);

  const getLocation = () => {
    if (latLong) {
      getSetPosition(latLong);
      return;
    }
    setError("");
    setLocationStatus("");
    navigator.geolocation.getCurrentPosition(getPosition, handleError);
  };
  const getSetPosition = async (latLong) => {
    const [lat, lon] = latLong.split(",").map((coord) => coord.trim());
    const data = await getWaitTime(lat, lon);
    setJsonResult(data);
    console.log(data);
  };
  const handleError = (err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Permission denied. Please enable location access.");
        break;
      case err.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case err.TIMEOUT:
        setError("The request to get your location timed out.");
        break;
      default:
        setError("An unknown error occurred while retrieving location.");
    }
  };

  const getPosition = async (position) => {
    const { latitude, longitude, accuracy } = position.coords;

    if (accuracy > 1000) {
      setLocationStatus(`Error: Accuracy too low (${accuracy} meters).`);
      return;
    }

    try {
      const data = await getWaitTime(latitude, longitude);
      const isAtDeerPark = checkLocation(data.wait_time);

      if (isAtDeerPark === 111000) {
        setLocationStatus("DeerPark is Closed. Go home.");
      } else if (isAtDeerPark) {
        setLocationStatus(`You are at DeerPark, wait time: ${data.wait_time}`);
      } else {
        setLocationStatus("You are not at DeerPark.");
      }

      setJsonResult(data); // Store full JSON response
    } catch (error) {
      setLocationStatus(`Error getting wait time: ${error.message}`);
    }
  };

  const getWaitTime = async (lat, lon) => {
    const url =
      day && hour && min
        ? `https://waittime-api.onrender.com/calculate-wait-time-debug?lat=${lat}&lon=${lon}&day=${day}&hour=${hour}&min=${min}`
        : `https://waittime-api.onrender.com/calculate-wait-time-debug?lat=${lat}&lon=${lon}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const data = await response.json();
    setJsonResult(data); // Store full JSON response
    return data;
  };

  const getPrediction = async () => {
    setLoading(true);
    setError("");
    setWaitTime("");
    setJsonResult(null); // Clear previous results before new request

    const url =
      day && hour && min
        ? `https://waittime-api.onrender.com/predict-wait-time-debug?day=${day}&hour=${hour}&min=${min}`
        : "https://waittime-api.onrender.com/predict-wait-time-debug";

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();
      setWaitTime(data.wait_time);
      setJsonResult(data); // Store full JSON response
    } catch (error) {
      setError(`Error fetching prediction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkLocation = (waitTime) => {
    if (waitTime === 111000) return 111000;
    return waitTime !== 101010;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Debug Admin</h2>

      <input
        type="text"
        value={latLong}
        onChange={handleLatLong}
        placeholder="Lat, Lon test"
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          value={day}
          onChange={handleDay}
          placeholder="Day (Mon=0, Sun=6)"
        />
        <input
          type="text"
          value={hour}
          onChange={handleHour}
          placeholder="Hour (0-23)"
        />
        <input
          type="text"
          value={min}
          onChange={handleMin}
          placeholder="Minute"
        />
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={getLocation}>Get Location</button>
        <button onClick={getPrediction} disabled={loading}>
          {loading ? "Loading..." : "Get Prediction"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {locationStatus && (
        <div style={{ marginTop: "10px" }}>{locationStatus}</div>
      )}
      {waitTime && (
        <div style={{ marginTop: "10px" }}>Wait Time: {waitTime}</div>
      )}

      {jsonResult && (
        <div style={{ marginTop: "20px" }}>
          <h3>Full JSON Response:</h3>
          <pre
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(jsonResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
