import React from "react";

export default function Home() {
  if (navigator.geolocation) {
    let x = navigator.geolocation.getCurrentPosition(showPosition);
    console.log(x);
  }

  function showPosition(position) {
    console.log(position)
  }
  return <div> Hello </div>;
}
