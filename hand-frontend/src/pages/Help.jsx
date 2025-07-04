import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, MessageSquare, Send, User, Calendar } from 'lucide-react';
import './Help.css';
import Footer from '../components/Footer';

function Help() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerText, setAnswerText] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user name or fallback
  const getCurrentUserName = () => {
    return user?.firstName ? `${user.firstName} ${user.lastName}` : user?.nickname || "Aktueller Nutzer";
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Generate unique ID
  const generateId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };


  const handleNewQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };


  const handleAskQuestion = async (event) => {
    event.preventDefault();
    
    if (!newQuestion.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const questionId = generateId(questions);
      const currentUser = getCurrentUserName();
      const currentDate = new Date().toISOString();
      
      const newQuestionObj = {
        id: questionId,
        user: currentUser,
        question: newQuestion.trim(),
        date: currentDate,
        answers: []
      };
      
      setQuestions(prevQuestions => [...prevQuestions, newQuestionObj]);
      setNewQuestion('');
    } catch (error) {
      console.error('Error adding question:', error);
    } finally {
      setIsSubmitting(false);

    }
  };

  const handleAnswerChange = (questionId, event) => {

    setAnswerText(prev => ({ 
      ...prev, 
      [questionId]: event.target.value 
    }));
  };

  const handleAddAnswer = (questionId) => {
    const answerContent = answerText[questionId]?.trim();
    
    if (!answerContent) {
      return;
    }

    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        const answerId = generateId(question.answers);
        const currentUser = getCurrentUserName();
        const currentDate = new Date().toISOString();
        
        const newAnswer = {
          id: answerId,
          user: currentUser,
          answer: answerContent,
          date: currentDate
        };
        
        return {
          ...question,
          answers: [...question.answers, newAnswer]
        };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    setAnswerText(prev => ({ ...prev, [questionId]: '' }));
  };

  // Handle Enter key in textareas
  const handleKeyPress = (event, action, ...args) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      action(...args);

    }
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-wrapper">
          <header className="help-header">
            <div className="header-content">

              <div className="header-icon">
                <HelpCircle size={48} />
              </div>

              <div className="header-text">
                <h1 className="h1-text">Deine Fragen, unsere Antworten</h1>
                <p>Stell eine Frage an die Community oder hilf anderen mit deinem Wissen.</p>
              </div>
            </div>
          </header>

          <section className="help-content">

            {/* Question Form */}
            <div className="form-section section-block">
              <h2 className="section-title">
                <MessageSquare size={24} />
                Stelle eine neue Frage
              </h2>

              <form onSubmit={handleAskQuestion} className="question-form">
                <div className="input-group">
                  <label htmlFor="newQuestion">Deine Frage:</label>
                  <div className="input-container">
                    <textarea
                      id="newQuestion"
                      className="question-input"

                      placeholder="Tippe hier deine Frage ein... (Strg+Enter zum Senden)"
                      rows="4"
                      value={newQuestion}
                      onChange={handleNewQuestionChange}
                      onKeyPress={(e) => handleKeyPress(e, handleAskQuestion, e)}
                      disabled={isSubmitting}
                      maxLength={1000}
                    />
                    <div className="character-count">
                      {newQuestion.length}/1000
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className={`btn primary ask-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting || !newQuestion.trim()}
                >
                  <Send size={16} />
                  {isSubmitting ? 'Wird gesendet...' : 'Frage stellen'}
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="questions-section section-block">
              <h2 className="section-title">
                Alle Fragen & Antworten 
                {questions.length > 0 && (
                  <span className="question-count">({questions.length})</span>
                )}
              </h2>
              
              {questions.length === 0 ? (
                <div className="empty-state">
                  <HelpCircle size={64} className="empty-icon" />
                  <h3>Noch keine Fragen</h3>
                  <p>Sei der Erste und stelle eine Frage an die Community!</p>
                </div>
              ) : (
                <div className="questions-list">
                  {questions.map((question) => (
                    <div key={question.id} className="question-item">
                      <div className="question-header">
                        <h3>{question.question}</h3>
                        <div className="question-meta">
                          <User size={14} />
                          <span>Gestellt von {question.user}</span>
                          <Calendar size={14} />
                          <span>am {formatDate(question.date)}</span>
                        </div>
                      </div>
                      
                      {/* Answers */}
                      {question.answers.length > 0 && (
                        <div className="answers-list">
                          <h4>
                            Antworten ({question.answers.length})
                          </h4>
                          {question.answers.map((answer) => (
                            <div key={answer.id} className="answer-item">
                              <p>{answer.answer}</p>
                              <div className="answer-meta">
                                <User size={12} />
                                <span>Beantwortet von {answer.user}</span>
                                <Calendar size={12} />
                                <span>am {formatDate(answer.date)}</span>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                      
                      {/* Answer Form */}

                      <div className="answer-form">
                        <div className="input-group">
                          <textarea
                            className="answer-input"

                            placeholder="Deine Antwort... (Strg+Enter zum Senden)"
                            rows="2"
                            value={answerText[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e)}
                            onKeyPress={(e) => handleKeyPress(e, handleAddAnswer, question.id)}
                            maxLength={500}
                          />
                          <div className="character-count">
                            {(answerText[question.id] || '').length}/500
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddAnswer(question.id)} 
                          className="btn primary answer-btn"
                          disabled={!answerText[question.id]?.trim()}
                        >
                          <Send size={14} />
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
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Help;