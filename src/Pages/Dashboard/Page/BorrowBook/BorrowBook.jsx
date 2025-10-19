import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
export default function BorrowBook() {
  const {user}=useAuth()
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });
  const filteredBooks = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data) => {
    if (!selectedBook) {
      return Swal.fire("Please select a book!", "", "warning");
    }

    //  Verify roll exists in users
    const userMatch = users.find((u) => u.roll === data.roll);
    if (!userMatch) {
      return Swal.fire(
        "Invalid Roll!",
        "Roll does not exist in user database.",
        "error"
      );
    }

    //  Check book availability
    if (selectedBook.copies <= 0) {
      return Swal.fire("Book Unavailable!", "No copies left.", "error");
    }

    const borrowInfo = {
      email:user.email,
      roll: data.roll,
      bookId: selectedBook._id,
      bookName: selectedBook.name,
      bookCode: selectedBook.code,
      author: selectedBook.author,
      borrowDate: new Date().toISOString(),
    };

    console.log(borrowInfo);
    const res = await axiosSecure.post("/borrows", borrowInfo);
    if (res.data.insertedId) {
      Swal.fire("Success!", "Book borrowed successfully.", "success");

      reset();

      setSearch("");

      setSelectedBook(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        📚 Borrow Book
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-4 rounded-xl shadow-md"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* 🔍 Search & Select Book */}
          <div className="form-control w-full sm:w-1/2 relative">
            <input
              type="text"
              placeholder="Search book by name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />

            {/* Dropdown List */}
            {search && filteredBooks.length > 0 && (
              <ul className="menu bg-base-200 rounded-box absolute top-12 left-0 w-full max-h-56 overflow-y-auto z-50 shadow">
                {filteredBooks.map((book) => (
                  <li key={book._id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBook(book);
                        setSearch(`${book.name} (${book.code})`);
                      }}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{book.name}</span>
                        <br />
                        <span className="text-sm opacity-70">
                          {book.code} • {book.author}
                        </span>
                      </div>
                      <span
                        className={`badge ${
                          book.copies > 0 ? "badge-success" : "badge-error"
                        }`}
                      >
                        {book.copies > 0 ? "Available" : "Out"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* No Result */}
            {search && filteredBooks.length === 0 && (
              <p className="absolute top-12 bg-base-200 p-2 rounded-lg shadow text-sm text-center">
                No book found
              </p>
            )}
          </div>

          {/* 🧍 Roll Input */}
          <div className="form-control w-full sm:w-1/4">
            <input
              type="text"
              {...register("roll", { required: true })}
              placeholder="Student Roll"
              className="input input-bordered w-full"
            />
          </div>

          {/* 📘 Borrow Button */}
          <button
            type="submit"
            className="btn btn-success w-full sm:w-auto"
            disabled={isLoading}
          >
            Borrow
          </button>
        </div>

        {/* 📖 Selected Book Preview */}
        {selectedBook && (
          <div className="mt-4 p-3 bg-base-200 rounded-lg flex gap-3 items-center">
            <img
              src={selectedBook.image}
              alt={selectedBook.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <h3 className="font-semibold">{selectedBook.name}</h3>
              <p className="text-sm opacity-80">
                {selectedBook.code} • {selectedBook.author}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
