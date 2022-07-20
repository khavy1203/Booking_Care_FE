import axios from "../axios";

const fetchAllClinics = async (page, limit) => {
    return await axios.get(`/api/v1/clinic/read?page=${page}&limit=${limit}`);
};
const fetchAllClinicsNoPage = async () => {
    return await axios.get(`/api/v1/clinic/read`);
};

const createNewClinic = async (clinicData) => {
    return await axios.post("/api/v1/clinic/create", {
        ...clinicData,
    });
};
const updateCurrentClinic = async (ClinicData) => {
    return await axios.put("/api/v1/clinic/update", {
        ...ClinicData,
    });
};

const deleteClinic = async (clinic) => {
    return await axios.delete("/api/v1/clinic/delete", { data: { id: clinic.id } });
};
//lấy phòng khám + bác sĩ phòng khám đó
const fetchDoctorOfCLinic = (clinicId, page, limit) => {
    return axios.get(`/api/v1/doctor-page?id=${clinicId}&page=${page}&limit=${limit}`);
};
//tìm kiếm clinic
const getInforClininicOfUserOnPage = async (page, limit, province, district, ward) => {
    return await axios.get(`/api/v1/clinic-page?page=${page}&limit=${limit}&province=${province}&district=${district}&ward=${ward}`);
};
const getClinic = async (idClinic) => {
    return await axios.get(`/api/v1/clinic/getClinic?id=${idClinic}`);
}
const fetchAllClinicsOfSupport = async (page, limit) => {
    return await axios.get(`/api/v1/clinic/fetchAllClinicsOfSupport?page=${page}&limit=${limit}`);
};

export {

    fetchAllClinics,
    createNewClinic,
    updateCurrentClinic,
    deleteClinic,
    fetchAllClinicsNoPage,
    fetchDoctorOfCLinic,
    getInforClininicOfUserOnPage,
    getClinic,
    fetchAllClinicsOfSupport
};