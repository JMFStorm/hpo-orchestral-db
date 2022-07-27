import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { parseCsv } from "../utils.js/csvParse";
import { uploadCsvData, loginUser } from "../api/request";

import UploadErrors from "./UploadErrors";

const Admin = () => {
  const [fileData, setFileData] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [loginPassword, setLoginPassword] = useState("");
  const [userToken, setUserToken] = useState(undefined);
  const [loginError, setLoginError] = useState(false);
  const [seedMessages, setSeedMessages] = useState({
    default: "",
    symphonies: "",
    concerts: "",
    performances: "",
    result: "",
  });

  // Sockets
  useEffect(() => {
    if (userToken) {
      const socket = io("ws://localhost:4001");
      socket.on("connect_message", (message) => {
        console.log(message);
      });
      socket.on("db_seed", (data) => {
        setSeedMessages((prev) => ({ ...prev, [data.type]: data.message }));
      });
    }
  }, [userToken]);

  const submitLogin = async () => {
    setLoginError(false);
    const { result, error } = await loginUser(loginPassword);
    setLoginPassword("");
    if (error) {
      setLoginError(true);
    }
    if (result) {
      setUserToken(result);
    }
  };

  if (!userToken) {
    return (
      <>
        <div>
          <label>Kirjaudu</label>
          <input
            name="password"
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
          />
        </div>
        <button onClick={submitLogin}>Kirjaudu</button>
        {loginError && <div>Kirjautuminen ei onnistunut</div>}
      </>
    );
  }

  const parseCallback = (results) => {
    if (results.errors) {
      results.errors.forEach((err) => {
        if (results.data && err.row === results.data.length - 1) {
          // Slice last row off
          results.data = results.data.slice(0, results.data.length - 1);
        } else if (results.data && err.row !== results.data.length - 1) {
          console.error("Csv reader error:", err);
        }
      });
    }
    if (results.data) {
      setFileData(results.data);
    }
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    parseCsv(inputFile, parseCallback);
  };

  const onFileUpload = async () => {
    setUploadErrors([]);
    const { error } = await uploadCsvData(fileData, userToken);
    if (error) {
      setUploadErrors(error.errors);
    }
  };

  return (
    <>
      <button onClick={() => setUserToken(undefined)}>Kirjaudu ulos</button>
      <div>
        <input type="file" onChange={(e) => onFileChange(e)} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      <div>
        <div>{seedMessages.default}</div>
        <div>{seedMessages.symphonies}</div>
        <div>{seedMessages.concerts}</div>
        <div>{seedMessages.performances}</div>
        <div>{seedMessages.result}</div>
      </div>
      <UploadErrors uploadErrors={uploadErrors} />
    </>
  );
};

export default Admin;
