import axios from "../axios";

//Huyên: dùng cho trang chủ
const fetchTopSpecialtyHome = (limit) => {
  return axios.get(`/api/v1/top-specialty-home?limit=${limit}`);
};

const createNewSpecialty = (data) => {
  return axios.post("/api/v1/specialty/create", data);
};
const fetchAllSpecialties = async (page, limit) => {
  return await axios.get(`/api/v1/specialty/read?page=${page}&limit=${limit}`);
};
const fetchAllSpecialtysNoPage = async () => {
  return await axios.get(`/api/v1/specialty/read`);
};

const updateCurrentSpecialty = async (SpecialtyData) => {
  return await axios.put("/api/v1/specialty/update", {
    ...SpecialtyData,
  });
};

const deleteSpecialty = async (specialty) => {
  return await axios.delete("/api/v1/specialty/delete", {
    data: { id: specialty.id },
  });
};

const fetchAllSpecialOfSupport = async (page, limit) => {
  return await axios.get(
    `/api/v1/specialty/fetchAllSpecialOfSupport?page=${page}&limit=${limit}`
  );
};
const searchSpecial = async (dt, page, limit) => {
  return await axios.get(
    `/api/v1/specialty/searchSpecial?search=${dt}&page=${page}&limit=${limit}`
  );
};
export {
  createNewSpecialty,
  fetchAllSpecialties,
  fetchAllSpecialtysNoPage,
  updateCurrentSpecialty,
  deleteSpecialty,
  fetchAllSpecialOfSupport,
  fetchTopSpecialtyHome,
  searchSpecial
};
