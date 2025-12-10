import axios from "axios";
import React from "react";
const axiosPublic = axios.create({
  baseURL: "http://localhost:5173",
});
export default function useAxiosPublic() {
  return axiosPublic;
}
