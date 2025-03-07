import { Route, Routes } from "react-router-dom";
import TimeTable from "./Timetable";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    try {
      const func = async () => {
        const req = await fetch(
          "https://pronote-planner-backend.onrender.com/ip"
        );
        const data = await req.text();
        console.log("launched server", data);
      };
      func();
    } catch (err) {
      console.log("server error", err);
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/org/*" element={<TimeTable />} />
    </Routes>
  );
};

export default App;

// import { ChangeEvent, useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// import pdf from 'pdf-parse';
// import axios from 'axios';
// function file2Buffer (file: Blob): Promise<Buffer> {
//   return new Promise(function (resolve, reject) {
//     const reader = new FileReader()
//     const readFile = function(event: any) {
//       const buffer = reader.result
//       // @ts-ignore
//       resolve(buffer)
//     }

//     reader.addEventListener('load', readFile)
//     reader.readAsArrayBuffer(file)
//   })
// }

// function App() {
//   return <>
//     <form method="POST" action="https://musical-yodel-4969gqvg54xcjpxg-3000.app.github.dev/upload" encType="multipart/form-data">
//       <input type="file" name="myFile" />
//       <input type="submit" />
//     </form>
//   </>

// }

// export default App
