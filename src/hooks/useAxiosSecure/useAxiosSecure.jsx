import axios from "axios";
import React from "react";
const axiosSecure = axios.create({
  baseURL: "https://geo-seminar-server-flame.vercel.app",
  withCredentials: true,
});
export default function useAxiosSecure() {
  return axiosSecure;
}
