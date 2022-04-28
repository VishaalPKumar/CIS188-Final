import React from "react";
import Calendar from "react-calendar";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import axios from "axios";

const App = () => {
  const [date, setDate] = useState(new Date());
  const nameRef = React.createRef();
  const descriptionRef = React.createRef();
  const dateRef = React.createRef();
  const timeRef = React.createRef();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
    // add event to data
    setData([...data, eventObj]);
    axios
      .post("/api/updateEvents", { events: data })
      .then((res) => {
        console.log(res);
      })
      .catch(alert);
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
    console.log("fData:", fData);
    setFilteredData(fData);
  }, [data, setData]);

  useEffect(() => {
    axios.get("/api/events").then((res) => {
      const events = res.data.events;
      setData(res.data.events);
      const fData = events.filter((item) => {
        const checkDate = new Date(item.date);
        return checkDate.toDateString() === date.toDateString();
      });
      console.log("fData:", fData);
      setFilteredData(fData);
    });
  }, []);

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
