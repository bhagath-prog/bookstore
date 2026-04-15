"use client";

import React, { useState, useEffect } from "react";
import "../admin.css";

interface Book {
  _id: string;
  bookName: string;
  authorName: string;
  description: string;
  mrpPrice: number;
  salePrice: number;
  status: "draft" | "active";
  image1: string;
  image2: string;
  createdAt: string;
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "">("");
  const [editForm, setEditForm] = useState<Partial<Book>>({});
  const [editImages, setEditImages] = useState<{ image1?: File; image2?: File }>(
    {}
  );
  const [imagePreviews, setImagePreviews] = useState<{ image1?: string; image2?: string }>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data.books || data); // backend compatibility
    } catch (error) {
      console.error("Error fetching books:", error);
      setMessage("Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------ FIXED DELETE ------------------------ */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Book deleted successfully");
        fetchBooks();
      } else {
        setMessage(data.error || "Error deleting book");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again.");
    }
  };

  /* ------------------------ FIXED STATUS CHANGE ------------------------ */
  const handleStatusChange = async (id: string, newStatus: "draft" | "active") => {
    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Status updated successfully");
        fetchBooks();
      } else {
        setMessage(data.error || "Error updating status");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again.");
    }
  };

  const openModal = (book: Book, type: "view" | "edit") => {
    setSelectedBook(book);
    setModalType(type);
    setEditForm(book);
    setEditImages({});
    setImagePreviews({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setModalType("");
    setEditForm({});
    setEditImages({});
    setImagePreviews({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (num === 1) {
        setEditImages((p) => ({ ...p, image1: file }));
        setImagePreviews((p) => ({ ...p, image1: URL.createObjectURL(file) }));
      } else {
        setEditImages((p) => ({ ...p, image2: file }));
        setImagePreviews((p) => ({ ...p, image2: URL.createObjectURL(file) }));
      }
    }
  };

  const removeImage = (num: 1 | 2) => {
    if (num === 1) {
      setEditImages((p) => ({ ...p, image1: undefined }));
      setImagePreviews((p) => ({ ...p, image1: undefined }));
    } else {
      setEditImages((p) => ({ ...p, image2: undefined }));
      setImagePreviews((p) => ({ ...p, image2: undefined }));
    }
  };

  /* ------------------------ FIXED EDIT SUBMIT ------------------------ */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      const formData = new FormData();

      formData.append("bookName", editForm.bookName || "");
      formData.append("authorName", editForm.authorName || "");
      formData.append("description", editForm.description || "");
      formData.append("mrpPrice", String(editForm.mrpPrice || 0));
      formData.append("salePrice", String(editForm.salePrice || 0));
      formData.append("status", editForm.status || "draft");

      if (editImages.image1) formData.append("image1", editImages.image1);
      if (editImages.image2) formData.append("image2", editImages.image2);

      const response = await fetch(`/api/books?id=${selectedBook._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Book updated successfully");
        fetchBooks();
        closeModal();
      } else {
        setMessage(data.error || "Error updating book");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error");
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="books-management">
      <div className="page-header">
        <h1>Books Management</h1>
      </div>

      {message && (
        <div className="message success">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>MRP Price</th>
              <th>Sale Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td className="book-name-cell">
                  <div className="book-name-with-image">
                    <img src={book.image1} className="book-thumbnail" alt={book.bookName} />
                    <span>{book.bookName}</span>
                  </div>
                </td>

                <td>{book.authorName}</td>
                <td>₹{book.mrpPrice}</td>
                <td>₹{book.salePrice}</td>

                <td>
                  <span className={`status-badge ${book.status}`}>{book.status}</span>
                </td>

                <td className="actions">
                  <button className="btn-view" onClick={() => openModal(book, "view")}>
                    👁️ View
                  </button>

                  <button className="btn-edit" onClick={() => openModal(book, "edit")}>
                    ✏️ Edit
                  </button>

                  <button className="btn-delete" onClick={() => handleDelete(book._id)}>
                    🗑️ Delete
                  </button>

                  <select
                    className="status-select"
                    value={book.status}
                    onChange={(e) => handleStatusChange(book._id, e.target.value as "draft" | "active")}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------ MODAL ------------------------ */}
      {showModal && selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === "view" ? "Book Details" : "Edit Book"}</h2>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="modal-content">
              {modalType === "view" ? (
                <>
                  <img src={selectedBook.image1} className="modal-image" />
                  <img src={selectedBook.image2} className="modal-image" />

                  <p><strong>Name:</strong> {selectedBook.bookName}</p>
                  <p><strong>Author:</strong> {selectedBook.authorName}</p>
                  <p><strong>Description:</strong> {selectedBook.description}</p>
                </>
              ) : (
                <form onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label>Book Name</label>
                    <input
                      type="text"
                      value={editForm.bookName || ""}
                      onChange={(e) => setEditForm({ ...editForm, bookName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      value={editForm.authorName || ""}
                      onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })}
                    />
                  </div>

                  <button className="btn-save" type="submit">
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
