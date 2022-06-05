import axios from "axios";
require("dotenv").config();

// import config from "./config";

const instance = axios.create({
  // baseURL: "http://localhost:8080",
  //Huyên: port tui bị trùng 8080 nên sài đỡ 5000
  baseURL: "http://localhost:5000",
  //   withCredentials: true,
});
instance.defaults.withCredentials = true; // thêm cái này để sever có thể đọc được cookie còn mặc định tham số này sẽ ẩn để đảm bảo bảo mật cho người dùng
// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
instance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("bkfe")}`;
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      case 401: {
        return error.response.data; //chỉ có cái này mới nhận được phản hồi từ phía thằng react
      }
      case 403: {
        return error.response.data; //chỉ có cái này mới nhận được phản hồi từ phía thằng react
      }
      default: {
        return Promise.reject(error);
      }
    }
  }
);
export default instance;
