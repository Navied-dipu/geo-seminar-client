import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function MyBorrowedBooks() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Firebase user
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    setUserEmail(user?.email);
  }, [user]);
  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["borrowedBooks", userEmail],
    queryFn: async () => {
      if (!userEmail) return [];
      console.log(userEmail);
      const res = await axiosSecure.get(`/borrows?email=${userEmail}`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
          📚 My Borrowed Books
        </h2>

        {books.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm sm:text-base">
                <thead className="bg-indigo-600 text-white uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Book Name</th>
                    <th className="py-3 px-4 text-left">Code</th>
                    <th className="py-3 px-4 text-left">Author</th>
                    <th className="py-3 px-4 text-left">Borrow Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {books.map((book, index) => (
                    <tr
                      key={book._id}
                      className="hover:bg-indigo-50 transition-colors duration-200 border-b"
                    >
                      <td className="py-3 px-4 font-semibold">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{book.bookName}</td>
                      <td className="py-3 px-4">{book.bookCode}</td>
                      <td className="py-3 px-4">{book.author}</td>
                      <td className="py-3 px-4">
                        {new Date(book.borrowDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3 px-4">
                        {book.returned ? (
                          <span className="badge badge-success">
                            ✅ Returned
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            ⏳ Not Returned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {books.map((book, index) => (
                <div
                  key={book._id}
                  className="bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-indigo-700">
                      {book.bookName}
                    </h3>
                    <span className="text-sm text-gray-400 font-semibold">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Code:</span> {book.bookCode}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Borrowed:</span>{" "}
                    {new Date(book.borrowDate).toLocaleDateString("en-GB")}
                  </p>
                  <p className="mt-2">
                    {book.returned ? (
                      <span className="badge badge-success text-sm">
                        ✅ Returned
                      </span>
                    ) : (
                      <span className="badge badge-warning text-sm">
                        ⏳ Not Returned
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-medium">
              You haven’t borrowed any books yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
