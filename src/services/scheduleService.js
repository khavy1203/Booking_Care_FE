import axios from "../axios";

const createNewSchedule = async (data) => {
  return await axios.post("/api/v1/schedule/create", { ...data });
};

const fetchSchedule = async (doctorId, date) => {
  return await axios.get(`/api/v1/schedule-detail?id=${doctorId}&date=${date}`);
};

export { createNewSchedule, fetchSchedule };
