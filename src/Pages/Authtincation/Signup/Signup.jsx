import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";

export default function Signup() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log("Login Data:", data);
    createUser(data.email, data.password)
      .then(async (res) => {
        console.log(res);
        const newUser = {
          name: data.name,
          roll: data.roll,
          email: data.email,
          role: "user",
          createdAt: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userInfo = await axiosSecure.post("/users", newUser);
        console.log(userInfo);
        if (userInfo.data.insertedId) {
          // 3️⃣ SweetAlert success message
          Swal.fire({
            icon: "success",
            title: "Signup Successful!",
            text: "Welcome to GeoBooks 📚",
            timer: 2000,
            showConfirmButton: false,
          });

          // 4️⃣ Reset form
          reset();

          // 5️⃣ Navigate to home page
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Signup failed:", error.message);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">SignUp</h2>
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-error text-sm">{errors.name.message}</p>
            )}
          </div>
          {/* Roll Number */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text font-medium">Roll Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter 13-digit roll number"
              {...register("roll", {
                required: "Roll number is required",
                pattern: {
                  value: /^[0-9]{13}$/,
                  message: "Roll must be exactly 13 digits (numbers only)",
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.roll && (
              <p className="text-error text-sm mt-1">{errors.roll.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">
              SignUp
            </button>
          </div>

          {/* Signup Redirect */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              LogIn
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
