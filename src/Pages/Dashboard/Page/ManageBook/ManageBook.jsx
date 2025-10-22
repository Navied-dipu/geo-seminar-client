import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { Link } from "react-router-dom";

export default function ManageBook() {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  // Fetch all books
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

  // Delete book
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

  // Filter books by name/code
  const filtered = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-500">Loading books...</p>
    );

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">📚 Manage Books</h2>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Name or Code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl shadow">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Code</th>
              <th>Author</th>
              <th>Copies</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td>{book.name}</td>
                  <td>{book.code}</td>
                  <td>{book.author}</td>
                  <td>{book.copies}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/dashboard/editbook/${book._id}`}>
                        <button className="btn btn-sm btn-info">Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.length > 0 ? (
          filtered.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start gap-4"
            >
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-48 md:h-32 md:w-32 object-cover rounded-lg"
              />
              <div className="flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg">{book.name}</h3>
                  <p>Code: {book.code}</p>
                  <p>Author: {book.author}</p>
                  <p>Copies: {book.copies}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link to={`/dashboard/editbook/${book._id}`}>
                    <button className="btn btn-sm btn-info w-1/2">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn btn-sm btn-error w-1/2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No books found.</p>
        )}
      </div>
    </div>
  );
}
