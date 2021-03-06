import axios from "../axios";
const registerClinic = async (clinicData) => {
    return await axios.post("/api/v1/partner/registerClinic", {
        ...clinicData,
    });
};
const fetchAllSpecialtysOfPartner = async () => {
    return await axios.get(`/api/v1/partner/getSpecialty`);
};
const createUserDoctorsofClinic = async (doctorClinicData) => {
    // return await axios.post("/api/v1/clinic/registerDoctorClinic", {
    //     ...doctorClinicData,
    // });
    return await axios.post("/api/v1/partner/registerDoctorClinic", {
        ...doctorClinicData,
    });
};
const getStatusOfClinic = async (id) => {
    // return await axios.get(`/api/v1/clinic/getStatusClinic?id=${id}`);
    return await axios.get(`/api/v1/partner/getStatusClinic?id=${id}`);
};
const getDoctorsOfClinic = async (id) => {
    // return await axios.get(`/api/v1/clinic/getStatusClinic?id=${id}`);
    return await axios.get(`/api/v1/partner/getDoctorsOfClinic?id=${id}`);
};

const deleteDoctorOfClinic = async (doctorClinicData) => {
    return await axios.post("/api/v1/partner/deleteDoctorOfClinic", { ...doctorClinicData });
};

const updateDoctorOfClinic = async (doctorClinicData) => {
    return await axios.post("/api/v1/partner/updateDoctorOfClinic", { ...doctorClinicData });
};

const addImformationClinic = async (clinicData) => {
    return await axios.post("/api/v1/partner/addImformationClinic", { ...clinicData });
};
export {
    registerClinic,
    createUserDoctorsofClinic,
    getStatusOfClinic,
    fetchAllSpecialtysOfPartner,
    getDoctorsOfClinic,
    deleteDoctorOfClinic,
    updateDoctorOfClinic,
    addImformationClinic
};