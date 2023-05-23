import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [currentPerson, setCurrentPerson] = useState({});
  const [fetchNew, setFetchNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fetchNew) {
      console.log("Fetch New One");
      setFetchNew(false);
      axios
        .get("http://localhost:23523/pooling")
        .then((res) => {
          setCurrentPerson(res.data);
          setErrorMessage("");
        })
        .catch((err) => {
          setErrorMessage(err?.message);
        });
    }

    return () => {};
  }, [fetchNew]);

  useEffect(() => {
    let timeout;
    if (fetchNew === false) {
      timeout = setTimeout(() => {
        setFetchNew(true);
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [fetchNew]);

  return (
    <div>
      <div>Select Citizen</div>
      {JSON.stringify(currentPerson)}
      <div>{errorMessage}</div>
    </div>
  );
}

export default App;
