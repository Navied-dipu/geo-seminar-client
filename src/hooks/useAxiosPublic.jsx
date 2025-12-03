import axios from 'axios'
import React from 'react'
const axiosPublic=axios.create({
    baseURL:'https://geo-seminar-server-flame.vercel.app',
      withCredentials: true
})
export default function useAxiosPublic() {
  return axiosPublic
}
