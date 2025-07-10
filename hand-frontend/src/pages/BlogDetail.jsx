import { useState, useEffect } from "react";
import api from "../api"; // <-- Importiere dein zentrales api-Objekt

const BlogDetail = ({ blog, user }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    api.get(`/blog-comments/${blog._id}`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]));
  }, [blog._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/blog-comments", {
        blog: blog._id,
        text: commentText
      });
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch (error) {
      alert(error.response?.data?.message || "Fehler beim Absenden");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      await api.put(`/blog-comments/${commentId}`, { text: newText });
      setComments(comments.map(c => c._id === commentId ? { ...c, text: newText } : c));
    } catch (error) {
      alert(error.response?.data?.message || "Fehler beim Bearbeiten");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/blog-comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      alert(error.response?.data?.message || "Fehler beim Löschen");
    }
  };

  return (
    <div>
      {/* ... anderer Code für den Blogpost ... */}
      <div>
        {comments.map(c => (
          <div key={c._id}>
            <b>{c.user?.nickname || "Unbekannt"}:</b> {c.text}
            {c.user?._id === user._id && (
              <>
                <button onClick={() => handleEditComment(c._id, prompt("Neuer Text:", c.text))}>Bearbeiten</button>
                <button onClick={() => handleDeleteComment(c._id)}>Löschen</button>
              </>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit}>
        <textarea value={commentText} onChange={e => setCommentText(e.target.value)} />
        <button type="submit">Kommentar absenden</button>
      </form>
    </div>
  );
};

export default BlogDetail;