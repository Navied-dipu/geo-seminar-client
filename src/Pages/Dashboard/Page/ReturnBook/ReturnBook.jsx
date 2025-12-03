import React, { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

export default function ReturnBook() {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const {
    data: borrows = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["borrowsAll"],
    queryFn: async () => {
      const res = await axiosSecure.get("/borrowsall");
      return res.data;
    },
  });

  const handleReturn = async (id, bookCode) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will mark the book as returned and increase stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, return it!",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Processing...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const res = await axiosSecure.patch(`/borrows/return/${id}`, {
        bookCode,
      });
      Swal.close();
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Book marked as returned!", "success");
        refetch();
      }
    } catch {
      Swal.fire("Error", "Failed to mark as returned.", "error");
    }
  };

  const notReturned = borrows.filter((b) => b.returned === false);

  // ✅ Search filter (optional)
  const filtered = notReturned.filter((b) =>
    b.roll.toString().toLowerCase().includes(search.trim().toLowerCase())
  );

  if (isLoading)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-gray-600">
        Loading borrowed books...
      </p>
    );

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">
        📘 Manage Borrowed Books
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Roll..."
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
              <th>Book</th>
              <th>Roll</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookName}</td>
                  <td>{b.roll}</td>
                  <td>
                    {new Date(b.borrowDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`font-semibold ${
                        b.returned ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {b.returned ? "Returned" : "Not Returned"}
                    </span>
                  </td>
                  <td>
                    {!b.returned && (
                      <button
                        onClick={() => handleReturn(b._id, b.bookCode)}
                        className="btn btn-sm btn-success"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  📭 No borrowed books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.length ? (
          filtered.map((b) => (
            <div key={b._id} className=" p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-indigo-700">
                {b.bookName}
              </h3>
              <p>
                <span className="font-semibold">Roll:</span> {b.roll}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(b.borrowDate).toLocaleDateString("en-GB")}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={b.returned ? "text-green-600" : "text-red-600"}
                >
                  {b.returned ? "Returned" : "Not Returned"}
                </span>
              </p>
              {!b.returned && (
                <button
                  onClick={() => handleReturn(b._id, b.bookCode)}
                  className="btn btn-sm btn-success w-full"
                >
                  Return
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            📭 No borrowed books found.
          </p>
        )}
      </div>
    </div>
  );
}
