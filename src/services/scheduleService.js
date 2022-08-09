import axios from "../axios";

const createNewSchedule = async (data) => {
  return await axios.post("/api/v1/schedule/create", { ...data });
};

const fetchSchedule = async (doctorId, date, clinicId) => {
  return await axios.get(
    `/api/v1/schedule-detail?id=${doctorId}&date=${date}&clinicId=${clinicId}`
  );
};

const fetchScheduleDetail = async (scheduleId) => {
  return await axios.get(
    `/api/v1/schedule/get-schedule-detail?scheduleId=${scheduleId}`
  );
};

const fetchCurrentSchedule = async (doctorId, clinicId) => {
  return await axios.get(
    `/api/v1/schedule/get-current-schedule?doctorId=${doctorId}&clinicId=${clinicId}`
  );
};

const fetchScheduleForTable = async () => {
  return await axios.get(`/api/v1/schedule/read`);
};

const deleteSchedule = async (scheduleId) => {
  return await axios.delete(`/api/v1/schedule/schedule-delete`, {
    data: { id: scheduleId },
  });
};

const deleteTime = async (detailId) => {
  return await axios.delete(`/api/v1/schedule/time-delete`, {
    data: { id: detailId },
  });
};

const updateMaxNumber = async (data) => {
  return await axios.put(`/api/v1/schedule/update`, { ...data });
};

export {
  createNewSchedule,
  fetchSchedule,
  fetchScheduleForTable,
  deleteSchedule,
  deleteTime,
  updateMaxNumber,
  fetchScheduleDetail,
  fetchCurrentSchedule,
};
