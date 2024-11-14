// CalendarComponent.jsx

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import CSS to style the calendar

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState("");

  const onDateChange = newDate => {
    setDate(newDate);
  };

  const onTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks(prevTasks => ({
        ...prevTasks,
        [date.toDateString()]: [...(prevTasks[date.toDateString()] || []), taskInput]
      }));
      setTaskInput("");
    }
  };

  return (
    <div className="calendar-component">
      <h2>Calendar</h2>
      <Calendar
        onChange={onDateChange}
        value={date}
      />
      <br></br>
      <div className="selected-date">
        <h3>Selected Date: {date.toDateString()}</h3>
      </div>
      <div className="task-input">
        <input
          type="text"
          value={taskInput}
          onChange={onTaskInputChange}
          placeholder="Add a task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <br></br>
      <div className="task-list">
        <h4>Tasks for {date.toDateString()}:</h4>
        <ul>
          {(tasks[date.toDateString()] || []).map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent;