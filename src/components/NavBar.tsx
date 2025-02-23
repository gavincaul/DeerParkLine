import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export function NavBar() {
  // eslint-disable-next-line
  function clear() {
    sessionStorage.clear();
    window.location.reload();
  }
  return (
    <div>
      <div className="navbar">
        <NavLink className="link" to="/">
          Home
        </NavLink>
        <NavLink className="link" to="/about">
          About
        </NavLink>
        {/* <button id="refresh" className="refreshButton" onClick={clear}>
          Refresh
        </button> */}
      </div>
    </div>
  );
}
