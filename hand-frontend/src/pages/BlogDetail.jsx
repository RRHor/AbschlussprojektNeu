import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const BlogDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(() => setBlog(null));
  }, [id]);

  useEffect(() => {
    if (blog?._id) {
      api.get(`/blog-comments/${blog._id}`)
        .then(res => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [blog?._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blog-comments", {
        blog: blog._id,
        text: commentText
      });
      setCommentText(""); // Kommentar-Feld leeren
      // Kommentare neu laden:
      const res = await api.get(`/blog-comments/${blog._id}`);
      setComments(res.data);
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

  if (!blog) return <div>Lade Blogpost...</div>;

  return (
    <div>
      <button onClick={() => navigate("/blogs")}>Zurück zur Übersicht</button>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <div>
        {comments.map(c => (
          <div key={c._id}>
            <b>{c.user?.nickname || "Unbekannt"}:</b> {c.text}
            {user && c.user?._id === user._id && (
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