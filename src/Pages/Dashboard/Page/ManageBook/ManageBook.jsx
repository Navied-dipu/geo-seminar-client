import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { Link } from "react-router-dom";

export default function ManageBook() {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  // ✅ Fetch all books
  const {
    data: books = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  // ✅ Delete book
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/books/${id}`);
      Swal.fire("Deleted!", "Book has been deleted.", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to delete book.", "error");
    }
  };

  // ✅ Filter books
  const filtered = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading books...</p>;

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        📚 Manage Books
      </h2>

      {/* 🔍 Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Name or Code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md shadow-sm"
        />
      </div>

      {/* 📚 Books Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length > 0 ? (
          filtered.map((book) => (
            <div
              key={book._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-200 rounded-lg"
            >
              <figure className="h-48">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-fit p-3 h-48  object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{book.name}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Code:</span> {book.code}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Copies:</span> {book.copies}
                </p>
                <div className="card-actions justify-between">
                  <Link to={`/dashboard/editbook/${book._id}`}>
                    <button className="btn btn-sm btn-info w-20">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn btn-sm btn-error w-20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
}
