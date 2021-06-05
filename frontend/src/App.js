import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

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
        <input type="text" name="movieName" />
        <label>Movie Review:</label>
        <input type="text" name="movieReview" />

        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
