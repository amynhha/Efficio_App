import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskCard from "./components/TaskCard"

function App() {
  return (
    <>
    <TaskCard task={{title: "Water the Garden", description: "South Park", deadline: "01/24/2025"}}/>
    </>
  );
}

export default App;
