import axios from "../axios";

const createBooking = (data) => {
  return axios.post(`/api/v1/booking/create`, { ...data });
};

const partnerFetchBooking = async (selectedTab) => {
  return await axios.get(
    `/api/v1/booking/partner-read?selectedTab=${selectedTab}`
  );
};

const doctorFetchBooking = (date) => {
  return axios.get(`/api/v1/booking/doctor-read?date=${date}`);
};

const patientFetchBooking = () => {
  return axios.get(`/api/v1/booking/patient-read`);
};

//cập nhật trạng thái lịch hẹn
const updateBooking = async (data) => {
  return await axios.put("/api/v1/booking/update", {
    ...data,
  });
};

//bệnh nhân thay đổi lịch hẹn
const changeBooking = async (data) => {
  return await axios.put("/api/v1/booking/change-booking", {
    ...data,
  });
};

export {
  createBooking,
  partnerFetchBooking,
  doctorFetchBooking,
  updateBooking,
  patientFetchBooking,
  changeBooking,
};
