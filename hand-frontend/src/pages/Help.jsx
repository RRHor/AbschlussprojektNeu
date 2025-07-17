import React, { useState } from "react";
import "./Help.css";

function Help() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState({});

  const handleNewQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  const handleAskQuestion = (event) => {
    event.preventDefault();
    if (newQuestion.trim()) {
      const questionId =
        questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      const newUser = "Aktueller Nutzer";
      const newDate = new Date().toISOString().split("T")[0];
      setQuestions([
        ...questions,
        {
          id: questionId,
          user: newUser,
          question: newQuestion.trim(),
          date: newDate,
          answers: [],
        },
      ]);
      setNewQuestion("");
    }
  };

  const handleAnswerChange = (questionId, event) => {
    setAnswerText({ ...answerText, [questionId]: event.target.value });
  };

  const handleAddAnswer = (questionId) => {
    if (answerText[questionId] && answerText[questionId].trim()) {
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          const answerId =
            q.answers.length > 0
              ? Math.max(...q.answers.map((a) => a.id)) + 1
              : 1;
          const newUser = "Aktueller Nutzer";
          const newDate = new Date().toISOString().split("T")[0];
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: answerId,
                user: newUser,
                answer: answerText[questionId].trim(),
                date: newDate,
              },
            ],
          };
        }
        return q;
      });
      setQuestions(updatedQuestions);
      setAnswerText({ ...answerText, [questionId]: "" });
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
                  <div key={q.id} className="question-item">
                    <div className="question-header">
                      <h3>{q.question}</h3>
                      <span className="question-meta">
                        Gestellt von {q.user} am {q.date}
                      </span>
                    </div>
                    {q.answers.length > 0 && (
                      <div className="answers-list">
                        <h4>Antworten:</h4>
                        {q.answers.map((a) => (
                          <div key={a.id} className="answer-item">
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
                          value={answerText[q.id] || ""}
                          onChange={(e) => handleAnswerChange(q.id, e)}
                        ></textarea>
                      </div>
                      <button
                        onClick={() => handleAddAnswer(q.id)}
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
