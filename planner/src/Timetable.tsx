import React, { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from "react";
import axiosInstance from "./axios";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {db} from "./firebase";
import { Route, Routes, useLocation } from "react-router-dom";
import { OrgContext } from "./context/orgContext";
import { OrgType } from "./lib/formatTimeTable";
import { BACKEND_URL } from "./lib/constants";
import styles from "./Timetable.module.css"
import tableStyles from "./tableStyles.module.css"
import Loader from "./Loader";

function TimeTable() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>();
  const [username, setUsername] = useState<string>("")
  const [freeSpots, setFreeSpots] = useState<null | OrgType>()
  const location = useLocation();
  // undefined: new user -> show banner, true: loading, false: posted
  const [posting, setPosting] = useState<boolean | undefined>(undefined)
  const [showAll, setShowAll] = useState<boolean>(false)


  useEffect(() => {
    const path = location.pathname.split("/")
    const org = path[path.length-1]
    const unsub = onSnapshot(doc(db, "/organisations/" + org), (doc) => {
      // update ui
      if (doc.exists() === false) return
      // @ts-ignore
      const data: OrgType = doc.data()
      data.free.sort((a, b) => {
        if (a.starred && b.starred) return 0
        else if (a.starred) return -1
        else if (b.starred) return 1
        else return -Infinity
      })
      // console.log("setting")
      setFreeSpots(data)
    })
    return () => {
      unsub()
    }
  }, [])

  useEffect(() => {
    // console.log("s")
    if (selectedFiles.length === 0) {
      setError("⚠️ missing file")
    } else if (username.length < 3) {
      setError("⚠️ too small username")
    } else {
      setError(null)
    }
  }, [selectedFiles, username])

 

  const submitHandler = (e: any) => {
    e.preventDefault(); //prevent the form from submitting
    if (selectedFiles.length === 0) {
      return setError("⚠️ missing file")
    } else if (username.length < 3) {
      return setError("⚠️ too small username")
    }
    // verify size 
    // @ts-ignore
    if(selectedFiles[0].size > 10 * 1024 * 1024){ // 10mb
      return setError("⚠️ File is must be under 10 MB")
   }
    let formData = new FormData();
    const path = location.pathname.split("/")
    const orgToken = path[path.length-1]
    formData.append("file", selectedFiles[0]);
    formData.append("username", username);
    formData.append("orgToken", orgToken);

    
    //Clear the error message
    setError("");
    setPosting(true)
    axiosInstance
      .post(BACKEND_URL + "/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          // @ts-ignore
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      }).then(response => {
        setPosting(false)
        setProgress(undefined)
      })
      .catch((error) => {
        const { code } = error?.response?.data;
        console.log(error);
        setPosting(undefined)
        setProgress(undefined)
        switch (code) {
          case "FILE_MISSING":
            setError("❌ Please select a file before uploading!");
            break;
          case "LIMIT_FILE_SIZE":
            setError("❌ File size is too large. Please upload files below 10MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "❌ This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
            );
            break;
          case "INVALID_PDF":
            setError(
              "❌ invalid file - must be pronote timetable"
            )
            break
          default:
            setError("❌ Sorry! Something went wrong. Please try again later");
            break;
        }
      })
  };
  // console.log("rerender", freeSpots)
  return (
    <div className={styles.main}>
      <div className="upper">
        <h2>Planning a Meeting for {freeSpots ? freeSpots.orgName : "your organisation"}</h2>
        {freeSpots && <p style={{fontSize: 12}}>{freeSpots.orgInfo}</p>}
      </div>
      {posting !== false && <div className={styles.actions}>
        <form
          className={styles.form}
          action="https://warm-papayas-greet.loca.lt/upload_file"
          method="post"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
            <label htmlFor="file-upload" className={styles['custom-file-upload']}>
                {selectedFiles.length === 0 && "Select Timetable"} 
                {selectedFiles.length !== 0 && "✅ Change Timetable"}
            </label>
            <input
              id="file-upload"
              name="file"
              type="file"
              accept='application/pdf'
              onChange={(e) => {
                // @ts-ignore
                setSelectedFiles(e.target.files);
              }}
            />
            <div>
            <input type="text" placeholder="your name" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
           {!progress && <button type="submit">
              Submit
            </button>}
          {error && error}
          {!error && progress && <div>uploading ... {progress}%</div>}
        </form>
      </div>}
    {posting && <p><Loader width="70px" height="70px" /></p>}
      {/* <div>{(freeSpots && freeSpots.free) && freeSpots.free.splice(0, 5).map((free, users) => {
        return (
          <div key={free.time}>
            <div>{free.time}</div>
            <div>{free.users.map((user: any) => <React.Fragment key={Math.random()}><>{user}</><>;</></React.Fragment>)}</div>
          </div>
        )//0123456789
      })}</div> */}
      {freeSpots && <table className={tableStyles.table}>
        <tbody>
            <tr key={0}>
            <th style={{width: "min-width"}}></th>
            <th>Time</th>
            <th>people available</th>
          </tr>
          {!showAll && freeSpots.free.slice(0, 6).map((slot, index) => {
          return (
              <tr key={index+1}>
                <th className={slot.starred ? tableStyles.starred : undefined}>{slot.starred ? "starred" : ""}</th>
                {/* need to be ablse to inially set the satrres -> bug */}
                {/* @ts-ignore */}
                <th>{slot.time}</th>
                {/* @ts-ignore */}
                <th className={tableStyles.people}>{slot.users.map(user => (<p className={tableStyles.user} key={(index+1)/10}>{user}</p>))}</th>
              </tr>
            )
        })}
        {showAll && freeSpots.free.map((slot, index) => {
            return (
                <tr key={index+1}>
                    <th className={slot.starred ? tableStyles.starred : undefined}>{slot.starred ? "starred" : ""}</th>
                    {/* need to be ablse to inially set the satrres -> bug */}
                    {/* @ts-ignore */}
                    <th>{slot.time}</th>
                    {/* @ts-ignore */}
                    <th className={tableStyles.people}>{slot.users.map(user => (<p className={tableStyles.user} key={(index+1)/10}>{user}</p>))}</th>
                </tr>
            )
        })}
        </tbody>
    </table>}
    {freeSpots && freeSpots.free.length > 0 && <button onClick={() => setShowAll(prevState => !prevState)}>{showAll ? "Show less" : "Show all"}</button>}
    {posting !== undefined && (!freeSpots || freeSpots.free.length) == 0 && <p>No data available</p>}
      
    </div>
  );
}

export default TimeTable;