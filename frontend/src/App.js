import React, { useState, useEffect } from "react";
import Axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  const temp = (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );

  return (
    <div className="App">
      <h1>CRUD Practice</h1>
      <div className="form">
        <label>Movie Name:</label>
        <input
          type="text"
          name="movieName"
          onChange={(e) => {
            setMovie(e.target.value);
          }}
        />
        <label>Movie Review:</label>
        <input
          type="text"
          name="movieReview"
          onChange={(e) => {
            setReview(e.target.value);
          }}
        />

        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
