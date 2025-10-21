import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useAxiosPublic from "../hooks/useAxiosPublic";

export default function Home() {
  const axiosPublic = useAxiosPublic();
  const [search, setSearch] = useState("");
  // React Query fetch
  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosPublic.get("/books");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading books...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
  const displayedBooks =
    search.trim() === ""
      ? books // show all by default
      : books.filter(
          (book) =>
            book.name.toLowerCase().includes(search.toLowerCase()) ||
            book.code.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Library Books</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Type book name or code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full max-w-md mb-6"
      />

      {/* Books Grid */}
      <div className="w-full max-w-6xl">
        {displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedBooks.map((book) => (
              <div
                key={book._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
              >
                <figure className="px-4 w-fit mx-auto pt-4">
                  <img
                    src={book.image}
                    alt={book.name}
                    className="rounded h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg font-semibold">
                    {book.name}
                  </h2>
                  <p className="text-sm text-gray-500">Code: {book.code}</p>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-500">{book.description}</p>
                  {book.copies > 0 ? (
                    <span className="badge badge-success badge-outline text-sm">
                      Available
                    </span>
                  ) : (
                    <span className="badge badge-error badge-outline text-sm">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600 font-semibold text-lg text-center mt-6">
            ❌ No books found matching “{search}”.
          </p>
        )}
      </div>
    </div>
  );
}
