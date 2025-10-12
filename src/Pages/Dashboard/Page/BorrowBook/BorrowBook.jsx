import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";

export default function BorrowBook() {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  // Filter books based on search input
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(search.toLowerCase()) ||
    book.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setValue("bookId", book._id);
    setValue("author", book.author); // set default author
  };

  const onSubmit = async (data) => {
    if (!selectedBook) {
      Swal.fire({
        icon: "error",
        title: "No Book Selected",
        text: "Please select a book to borrow.",
      });
      return;
    }

    try {
      const res = await axiosSecure.post("/borrow", {
        book_code: data.code,
        author: data.author,
        roll: data.roll,
      });

      Swal.fire({
        icon: "success",
        title: "Book Borrowed!",
        text: res.data.message || "Book issued successfully ✅",
      });

      reset();
      setSelectedBook(null);
    } catch (error) {
      if (
        error.response?.status === 404 &&
        error.response?.data?.message.includes("Student not found")
      ) {
        Swal.fire({
          icon: "error",
          title: "Invalid Roll!",
          text: "No student found with this roll number ❌",
          confirmButtonColor: "#d33",
        });
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message.includes("No copies")
      ) {
        Swal.fire({
          icon: "warning",
          title: "Book Unavailable!",
          text: "No copies of this book are available 😔",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Borrow Failed!",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-5">📚 Issue a Book</h2>

      {/* Search Field */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search book by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {/* Search results */}
      {search && filteredBooks.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto border rounded-lg p-2 bg-base-100">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="p-2 rounded-lg cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleBookSelect(book)}
            >
              <p className="font-semibold">{book.name}</p>
              <p className="text-sm">{book.code}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Selected Book Info */}
        {selectedBook && (
          <div className="p-3 bg-base-100 rounded-lg border">
            <p className="font-semibold text-lg">{selectedBook.name}</p>
            <p className="text-sm text-gray-500">{selectedBook.code}</p>
            <p className="text-sm text-gray-500">{selectedBook.description}</p>
          </div>
        )}

        {/* Author Selection */}
        {selectedBook && (
          <div>
            <label className="label font-medium">Select Author</label>
            <select
              {...register("author", { required: true })}
              className="select select-bordered w-full"
            >
              <option value={selectedBook.author}>{selectedBook.author}</option>
            </select>
          </div>
        )}

        {/* Roll Number */}
        <div>
          <label className="label font-medium">Student Roll Number</label>
          <input
            type="text"
            placeholder="Enter student roll"
            {...register("roll", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Borrow Book
        </button>
      </form>
    </div>
  );
}
