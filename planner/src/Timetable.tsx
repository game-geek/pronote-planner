import React, { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from "react";
import axiosInstance from "./axios";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {db} from "./firebase";
import { Route, Routes, useLocation } from "react-router-dom";
import { OrgContext } from "./context/orgContext";
import { OrgType } from "./lib/formatTimeTable";

function TimeTable() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState<string>();
  const [username, setUsername] = useState<string>("")
  const [freeSpots, setFreeSpots] = useState<null | OrgType>()
  const location = useLocation();


  useEffect(() => {
    const path = location.pathname.split("/")
    const org = path[path.length-1]
    const unsub = onSnapshot(doc(db, "/organisations/" + org), (doc) => {
      // update ui
      if (doc.exists() === false) return
      // @ts-ignore
      const data: Orgs = doc.data()
      setFreeSpots(data)
    })
    return () => {
      unsub()
    }
  }, [])



  const submitHandler = (e: any) => {
    e.preventDefault(); //prevent the form from submitting
    if (selectedFiles.length == 0 || username.length < 3) return setError("missing file, or too small username")
    let formData = new FormData();
    const path = location.pathname.split("/")
    const orgToken = path[path.length-1]
    formData.append("file", selectedFiles[0]);
    formData.append("username", username);
    formData.append("orgToken", orgToken);
    
    //Clear the error message
    setError("");
    axiosInstance
      .post(process.env.SERVER + "/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          // @ts-ignore
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .catch((error) => {
        const { code } = error?.response?.data;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading!");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
            );
            break;
          case "INVALID_PDF":
            setError(
              "invalid file - must be pronote timetable"
            )
            break
          default:
            setError("Sorry! Something went wrong. Please try again later");
            break;
        }
      });
  };
  return (
    <div>
      <div>{(freeSpots && freeSpots.free) && freeSpots.free.splice(0, 5).map((free, users) => {
        return (
          <div key={free.time}>
            <div>{free.time}</div>
            <div>{free.users.map((user: any) => <React.Fragment key={Math.random()}><>{user}</><>;</></React.Fragment>)}</div>
          </div>
        )//0123456789
      })}</div>
      <form
        action="https://warm-papayas-greet.loca.lt/upload_file"
        method="post"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
          <input
            id="exampleFormControlFile1"
            name="file"
            type="file"
            onChange={(e) => {
              // @ts-ignore
              setSelectedFiles(e.target.files);
            }}
          />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button type="submit">
            Upload
          </button>
        {error && error}
        {!error && progress && <div>{progress}%</div>}
      </form>
    </div>
  );
}

export default TimeTable;