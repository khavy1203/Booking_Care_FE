import axios from "../axios";

const createBooking = (data) => {
  return axios.post(`/api/v1/booking/create`, { ...data });
};

export { createBooking };
