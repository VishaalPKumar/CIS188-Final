import React from "react";
import Calendar from "react-calendar";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import Data from "./data.json";

const App = () => {
  const [date, setDate] = useState(new Date());
  const nameRef = React.createRef();
  const descriptionRef = React.createRef();
  const dateRef = React.createRef();
  const timeRef = React.createRef();
  const [data, setData] = useState(Data);
  const fData = Data.filter((item) => {
    const checkDate = new Date(item.date);
    return checkDate.toDateString() === date.toDateString();
  });
  const [filteredData, setFilteredData] = useState(fData);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("name:", nameRef.current.value);
    console.log("description:", descriptionRef.current.value);
    console.log("date:", dateRef.current.value);
    console.log("time:", timeRef.current.value);
    const date = dateRef.current.value.replaceAll("-", "/");
    // create event object
    const eventObj = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      date: date,
      time: timeRef.current.value,
    };
    console.log(eventObj);
    // add event to data
    setData([...data, eventObj]);

    // clear form
    nameRef.current.value = "";
    descriptionRef.current.value = "";
    dateRef.current.value = "";
    timeRef.current.value = "";
  }

  function onChange(date) {
    setDate(date);
    dateRef.current.valueAsDate = date;
  }

  useEffect(() => {
    const fData = data.filter((item) => {
      const checkDate = new Date(item.date);
      return checkDate.toDateString() === date.toDateString();
    });
    setFilteredData(fData);
  }, [date, data, setFilteredData]);

  useEffect(() => {
    fetch("http://calendar.cis188.org/events", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
      .then((res) => res.json())
      .then((res) => setData(res.events));
  }, []);

  useEffect(() => {
    fetch("http://calendar.cis188.org/updateEvents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Origin": "*",
      body: JSON.stringify({ events: data }),
    }).catch(alert);
  }, [data]);

  return (
    <div className="row">
      <div className="calendar-container column left">
        <h1> Calendar </h1>
        <Calendar onChange={onChange} value={date} />
        <p>
          <span className="bold"> Date:</span> {date.toDateString()}
        </p>
      </div>
      <div className="form column middle">
        <h1> Add Event </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control ref={nameRef} type="text" placeholder="Enter name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              ref={descriptionRef}
              type="text"
              placeholder="Enter description"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control ref={dateRef} type="date" placeholder="Enter date" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control ref={timeRef} type="time" placeholder="Enter time" />
          </Form.Group>
          <button type="submit">Submit</button>
        </Form>
      </div>
      <div className="events column right">
        <h1>Events</h1>
        <ul>
          {filteredData.map((item, index) => (
            <li key={index}>
              <span className="bold">Name:</span> {item.name}
              <br />
              <span className="bold">Description:</span> {item.description}
              <br />
              <span className="bold">Date:</span> {item.date}
              <br />
              <span className="bold">Time:</span> {item.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
