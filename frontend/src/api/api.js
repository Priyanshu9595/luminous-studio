import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem("adminToken");
  const customerToken = localStorage.getItem("customerToken");

  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  } else if (customerToken) {
    req.headers.Authorization = `Bearer ${customerToken}`;
  }

  return req;
});

export default API;