import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  // 🔑 Replace this with your ImageBB key

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      // Upload image to imgbb
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgUploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      console.log(imgUploadRes);

      const imageUrl = imgUploadRes.data.data.display_url;

      // Book data
      const bookInfo = {
        name: data.name,
        code: data.code,
        author: data.author,
        category: data.category,
        description: data.description,
        image: imageUrl,
        copies: parseInt(data.copies), // ensure number
        addedAt: new Date().toISOString(),
      };

      //   Send to your backend
      const res = await axiosSecure.post("/books", bookInfo);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Book added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
      } else {
        alert("❌ Failed to add book!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-10 px-4">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="text-2xl font-bold text-center md:col-span-2">
            Add New Book
          </h2>

          {/* Book Name */}
          <div className="form-control">
            <label className="label font-medium">Book Name</label>
            <input
              type="text"
              {...register("name", { required: "Book name is required" })}
              placeholder="Enter book name"
              className="input input-bordered"
            />
            {errors.name && (
              <p className="text-error text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Book Code */}
          <div className="form-control">
            <label className="label font-medium">Book Code</label>
            <input
              type="text"
              {...register("code", { required: "Book code is required" })}
              placeholder="e.g. BK-2025"
              className="input input-bordered"
            />
            {errors.code && (
              <p className="text-error text-sm">{errors.code.message}</p>
            )}
          </div>

          {/* Author Name */}
          <div className="form-control">
            <label className="label font-medium">Author Name</label>
            <input
              type="text"
              {...register("author", { required: "Author name is required" })}
              placeholder="Author name"
              className="input input-bordered"
            />
            {errors.author && (
              <p className="text-error text-sm">{errors.author.message}</p>
            )}
          </div>
          {/* Number of Copies */}
          <div className="form-control">
            <label className="label font-medium">Number of Copies</label>
            <input
              type="number"
              min={1}
              {...register("copies", {
                required: "Number of copies is required",
                min: { value: 1, message: "At least 1 copy is required" },
              })}
              placeholder="Enter number of copies"
              className="input input-bordered"
            />
            {errors.copies && (
              <p className="text-error text-sm">{errors.copies.message}</p>
            )}
          </div>

          {/* Description (Full Width) */}
          <div className="form-control md:col-span-2">
            <label className="label font-medium">Description</label>
            <textarea
              {...register("description")}
              className="textarea textarea-bordered w-full"
              placeholder="Write short description..."
            ></textarea>
          </div>

          {/* Image Upload (Full Width) */}
          <div className="form-control md:col-span-2">
            <label className="label font-medium">Book Cover Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              className="file-input file-input-bordered w-full"
            />
            {errors.image && (
              <p className="text-error text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control md:col-span-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
