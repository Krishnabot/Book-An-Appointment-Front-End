import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://127.0.0.1:3000//api/v1/reservations';
const DELETE_RESERVATION = 'Book-An-Appointment/reservations/DELETE_RESERVATION';
const ADD_RESERVATION = 'Book-An-Appointment/reservations/ADD_RESERVATION';
const GET_RESERVATIONS = 'Book-An-Appointment/reservations/GET_RESERVATIONS';

const initailState = [];

const reservationReducer = (state = initailState, action) => {
  switch (action.type) {
    case `${DELETE_RESERVATION}/fulfilled`:
      return state.filter((reservation) => reservation.id !== action.payload);
    case `${ADD_RESERVATION}/fulfilled`:
      return [...state, action.payload];
    case `${GET_RESERVATIONS}/fulfilled`:
      return action.payload;
    case `${GET_RESERVATIONS}/rejected`:
      return state;
    default:
      return state;
  }
};

export const deleteReservation = createAsyncThunk(
  DELETE_RESERVATION,
  async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Unable to delete item');
    }
    return id;
  },
);

export const addReservation = createAsyncThunk(
  ADD_RESERVATION,
  async (reservation) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(reservation),
    });
    return response.json();
  },
);

export const getReservations = createAsyncThunk(GET_RESERVATIONS, async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Unable to render reservations');
  }

  return response.json();
});

export default reservationReducer;
