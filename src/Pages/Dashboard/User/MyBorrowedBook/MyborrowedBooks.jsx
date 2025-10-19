import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";


export default function MyBorrowedBooks() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Firebase user

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["borrowedBooks", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/borrows?email=${user?.email}`);
      console.log(res.data)
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">📚 My Borrowed Books</h2>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book._id} className="border p-2 mb-2 rounded shadow-sm">
              <p className="font-semibold">{book.bookName}</p>
              <p>Code: {book.bookCode}</p>
              <p>Author: {book.author}</p>
              <p>
                Borrow Date:{" "}
                {new Date(book.borrowDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                Status:{" "}
                <span
                  className={
                    book.returned ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                  }
                >
                  {book.returned ? "Returned" : "Not Returned"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No borrowed books found.</p>
      )}
    </div>
  );
}
