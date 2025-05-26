import React from 'react';
import { useParams } from 'react-router-dom';

export default function BookingDetails() {
  const { id } = useParams();
  return <div>Booking Details for {id}</div>;
}