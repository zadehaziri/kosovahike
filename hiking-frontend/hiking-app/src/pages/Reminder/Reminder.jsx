import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './Reminder.scss';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/reminder')
      .then(response => {
        setReminders(response.data);
      })
      .catch(error => {
        console.error('error fetching reminders', error);
      });
  }, []);

  const addReminder = () => {
    axios.post('http://localhost:5000/reminder/addReminder', newReminder)
      .then(() => {
        setNewReminder({
          date: '',
          time: '',
          location: '',
          description: ''
        });
        getReminders();
      })
      .catch(error => {
        console.error('error adding reminder', error);
      });
  };

  const deleteReminder = (reminderId) => {
    axios.delete(`http://localhost:5000/reminder/${reminderId}`)
      .then(() => {
        getReminders();
      })
      .catch(error => {
        console.error('error deleting reminder', error);
      });
  };

  const updateReminder = (updateReminder) => {
    axios.put('http://localhost:5000/reminder/updateReminder', updateReminder)
      .then(() => {
        getReminders();
      })
      .catch(error => {
        console.error('error updating reminder', error);
      });
  };

  const getReminders = () => {
    axios.get('http://localhost:5000/reminder')
      .then(response => {
        setReminders(response.data);
      })
      .catch(error => {
        console.error('error fetching reminders', error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="reminder-container">
      <h1 className="reminder-heading">Set a Reminder</h1>
      <div id="search" className="search-container">
        <input
          type="text"
          placeholder="Search by location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <button onClick={getReminders} className="search-button">Search</button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date:</label>
          <DatePicker selected={newReminder.date} onChange={(date) => setNewReminder({ ...newReminder, date })} className="date-picker" />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label">Time:</label>
          <input type="time" id="time" value={newReminder.time} onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })} className="input-field" required />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location:</label>
          <input type="text" id="location" value={newReminder.location} onChange={(e) => setNewReminder({ ...newReminder, location: e.target.value })} className="input-field" required />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea id="description" rows="4" value={newReminder.description} onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })} className="input-field description-field" required></textarea>
        </div>
      </div>

      <button onClick={addReminder} className="set-reminder-button">Set Reminder</button>

      <div className="reminder-list">
        {reminders
          .filter((reminder) => reminder.location.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              <p>Date: {formatDate(reminder.date)}</p>
              <p>Time: {reminder.time}</p>
              <p>Location: {reminder.location}</p>
              <p>Description: {reminder.description}</p>
              <div className="button-group">
                <button onClick={() => updateReminder(reminder)} className="edit-button">Edit</button>
                <button onClick={() => deleteReminder(reminder._id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reminder;
