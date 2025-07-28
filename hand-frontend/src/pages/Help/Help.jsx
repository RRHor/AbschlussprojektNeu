import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Help.css"; // Import the CSS file

function Help() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  // Lade Fragen beim Mount
  useEffect(() => {
    axios.get("/api/help/questions")
      .then(res => setQuestions(res.data))
      .catch(() => setQuestions([]));
  }, []);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState({});

  const handleNewQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  const handleAskQuestion = async (event) => {
    event.preventDefault();
    if (newQuestion.trim()) {
      const newUser = user ? (user.nickname || user.name || user.username || user.email) : "Unbekannt";
      const newDate = new Date().toISOString().split("T")[0];
      try {
        const res = await axios.post("/api/help/questions", {
          user: newUser,
          question: newQuestion.trim(),
          date: newDate
        });
        setQuestions([...questions, res.data]);
        setNewQuestion("");
      } catch (err) {
        // Fehlerbehandlung (optional)
      }
    }
  };

  const handleAnswerChange = (questionId, event) => {
    setAnswerText({ ...answerText, [questionId]: event.target.value });
  };

  const handleAddAnswer = async (questionId) => {
    if (answerText[questionId] && answerText[questionId].trim()) {
      const newUser = user ? (user.nickname || user.name || user.username || user.email) : "Unbekannt";
      const newDate = new Date().toISOString().split("T")[0];
      try {
        const res = await axios.post(`/api/help/questions/${questionId}/answer`, {
          user: newUser,
          answer: answerText[questionId].trim(),
          date: newDate
        });
        setQuestions(questions.map(q => q._id === res.data._id ? res.data : q));
        setAnswerText({ ...answerText, [questionId]: "" });
      } catch (err) {
        // Fehlerbehandlung (optional)
      }
    }
  };

  return (
    <div className="help-container">
      <div className="help-wrapper">
        <div className="help-animated-header">
          <h1>Hilfe & Support</h1>
          <p>Fragen stellen und Antworten finden</p>
        </div>

        <section className="help-content">
          <div className="form-section section-block">
            <h2 className="section-title">Stelle eine neue Frage</h2>
            <form onSubmit={handleAskQuestion} className="question-form">
              <div className="input-group">
                <label htmlFor="newQuestion">Deine Frage:</label>
                <div className="input-container">
                  <textarea
                    id="newQuestion"
                    className="question-input"
                    placeholder="Tippe hier deine Frage ein..."
                    rows="4"
                    value={newQuestion}
                    onChange={handleNewQuestionChange}
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn primary ask-btn">
                Frage stellen
              </button>
            </form>
          </div>

          <div className="questions-section section-block">
            <h2 className="section-title">Alle Fragen & Antworten</h2>
            {questions.length === 0 ? (
              <p>Es wurden noch keine Fragen gestellt.</p>
            ) : (
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q._id} className="question-item">
                    <div className="question-header">
                      <h3>{q.question}</h3>
                      <span className="question-meta">
                        Gestellt von {q.user} am {q.date}
                      </span>
                    </div>
                    {q.answers.length > 0 && (
                      <div className="answers-list">
                        <h4>Antworten:</h4>
                        {q.answers.map((a, idx) => (
                          <div key={a._id || idx} className="answer-item">
                            <p>{a.answer}</p>
                            <span className="answer-meta">
                              Beantwortet von {a.user} am {a.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="answer-form">
                      <div className="input-group">
                        <textarea
                          className="answer-input"
                          placeholder="Deine Antwort..."
                          rows="2"
                          value={answerText[q._id] || ""}
                          onChange={(e) => handleAnswerChange(q._id, e)}
                        ></textarea>
                      </div>
                      <button
                        onClick={() => handleAddAnswer(q._id)}
                        className="btn primary answer-btn"
                      >
                        Antworten
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Help;




























