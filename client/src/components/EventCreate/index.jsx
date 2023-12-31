/* eslint-disable no-unused-vars */
// client/src/components/CreateEvent/index.jsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_EVENT, GET_USER } from "../../utils/queries";
import { useNavigate } from "react-router-dom";
import moment from "moment";
// Import AuthService at the top of your file
import AuthService from '../../utils/auth'; // Update the path accordingly


const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    ticketQuantity: 0,
    ticketPrice: 0,
    image: "",
  });

  const navigate = useNavigate();

  const [addEvent, { loading, error }] = useMutation(ADD_EVENT)
  //   , {
  //   update(cache, { data: { addEvent } }) {
  //     const { events } = cache.readQuery({ query: GET_USER });
  //     cache.writeQuery({
  //       query: GET_USER,
  //       data: { events: [...events, addEvent] },
  //     });
  //   },
  // });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name=="ticketQuantity" || name=="ticketPrice"){
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseInt(value),
      }));
    }
    else{
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date using moment
    const formattedDate = moment(formData.date).format("MM/DD/YYYY");
    try {
      const token = AuthService.getToken();
      const headers = { Authorization: `Bearer ${token}` };
      console.log(formData)
      console.log(typeof formData.ticketPrice)
      // console.log("this is formdata before adding to the event: ", formData)
      await addEvent({
        variables: { ...formData, date: formattedDate }
      });

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };
  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        {/* Include your event form fields here */}
        <label>
          Event Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ticket Quantity:
          <input
            type="number"
            name="ticketQuantity"
            value={formData.ticketQuantity}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ticket Price:
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          Add Event
        </button>
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};


export default CreateEvent;
