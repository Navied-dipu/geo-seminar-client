import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
export default function EditBook() {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null); // store fetched book
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      author: "",
      category: "",
      description: "",
      copies: 1,
    },
  });

  // 🧠 Load existing book info
  useEffect(() => {
    axiosSecure.get(`/books/${id}`).then((res) => {
      setBook(res.data);
      reset(res.data); // prefill form
    });
  }, [id, axiosSecure, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let imageUrl = book?.image; // default: old image

      // ✅ Only upload if new image selected
      if (
        data.image &&
        data.image.length > 0 &&
        data.image[0] instanceof File
      ) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const res = await axios.post(image_hosting_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data?.success) {
          imageUrl = res.data.data.display_url;
        } else {
          Swal.fire(
            "Warning",
            "Image upload failed, keeping old image.",
            "warning"
          );
        }
      }

      // ✅ Prepare updated book data
      const updatedBook = {
        name: data.name,
        code: data.code,
        author: data.author,
        category: data.category,
        description: data.description,
        image: imageUrl,
        copies: parseInt(data.copies),
        updatedAt: new Date().toISOString(),
      };

      // ✅ Update book
      const updateBook = await axiosSecure.patch(`/books/${id}`, updatedBook);

      if (updateBook.data.modifiedCount > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} modified successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/managebook");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-10 px-4">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="text-2xl font-bold text-center md:col-span-2">
            ✏️ Edit Book
          </h2>

          {/* Book Name */}
          <div className="form-control">
            <label className="label font-medium">Book Name</label>
            <input
              type="text"
              {...register("name", { required: "Book name is required" })}
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
              className="input input-bordered"
            />
            {errors.copies && (
              <p className="text-error text-sm">{errors.copies.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label font-medium">Description</label>
            <textarea
              {...register("description")}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-control md:col-span-2">
            <label className="label font-medium">Book Cover Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="file-input file-input-bordered w-full"
            />
            {book?.image && (
              <div className="mt-3">
                <p className="text-sm mb-1">Current Image:</p>
                <img
                  src={book.image}
                  alt="Current Book Cover"
                  className="w-32 h-40 object-cover rounded-lg border"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              (Leave blank to keep current image)
            </p>
          </div>

          {/* Submit Button */}
          <div className="form-control md:col-span-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
