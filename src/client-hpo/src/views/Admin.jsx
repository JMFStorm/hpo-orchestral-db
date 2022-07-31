import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import LoadingIcon from "./LoadingIcon";
import { parseCsv } from "../utils.js/csvParse";
import { uploadCsvData, loginUser } from "../api/request";
import { serverUrl } from "../config";
import UploadValidateErrors from "./UploadValidateErrors";

const Admin = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [loginPassword, setLoginPassword] = useState("");
  const [userToken, setUserToken] = useState(undefined);
  const [loginError, setLoginError] = useState(false);
  const [seedMessages, setSeedMessages] = useState({
    default: "",
    total: "",
    result: "",
  });
  const [seedWarnings, setSeedWarnings] = useState([]);
  const [seedInProgress, setSeedInProgress] = useState(false);

  // Sockets
  useEffect(() => {
    if (userToken) {
      const socket = io(serverUrl);
      socket.on("connect_message", (message) => {
        console.log(message);
      });
      socket.on("db_seed", (data) => {
        if (data.type === "warning") {
          setSeedWarnings((prev) => prev.concat(data.message));
        } else {
          setSeedMessages((prev) => ({ ...prev, [data.type]: data.message }));
        }
        setSeedInProgress(!data.completed);
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
      setUserToken(result.token);
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
    setSeedMessages({
      default: "",
      total: "",
      result: "",
    });
    setSeedInProgress(true);
    setSeedWarnings([]);
    const { error } = await uploadCsvData(fileData, userToken);
    if (error) {
      setUploadErrors(error.errors);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setUserToken(undefined);
          navigate("/admin");
        }}
      >
        Kirjaudu ulos
      </button>
      <div>
        <input type="file" onChange={(e) => onFileChange(e)} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      <div>
        <div>{seedMessages.default}</div>
        <div>{seedMessages.total}</div>
        <div>{seedMessages.result}</div>
        {seedInProgress && <LoadingIcon sizePixels={50} />}
        {seedWarnings.length > 0 && (
          <div>
            <h3>Teosten nimikonflikteja:</h3>
            <ul>
              {seedWarnings
                .filter((current, index, self) => index === self.findIndex((x) => x === current))
                .map((warning) => (
                  <li>{warning}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <UploadValidateErrors uploadErrors={uploadErrors} />
    </>
  );
};

export default Admin;
