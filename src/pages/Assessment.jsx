import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Assessment() {
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      setLoading(true);
      const res = await api.listForms();
      setForms(res.forms || []);
    } catch (error) {
      console.error('Error loading forms:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!selected) return;
    
    setSubmitting(true);
    try {
      const res = await api.submitAssessment({ formId: selected.id, responses: answers });
      setResult(res.assessment);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function selectForm(form) {
    setSelected(form);
    setAnswers({});
    setResult(null);
  }

  function updateAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function isFormComplete() {
    if (!selected || !selected.questions) return false;
    return selected.questions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== null && answer.toString().trim() !== '';
    });
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      {/* Sidebar */}
      <div className="assessment-sidebar">
        <div className="card-header">
          <h3 className="card-title">Health Assessments</h3>
          <p className="text-muted">Choose an assessment to complete</p>
        </div>
        
        {forms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No assessments available</div>
            <div className="empty-state-description">Check back later for new health assessments</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {forms.map((form, idx) => (
              <button
                key={form.id || idx}
                onClick={() => selectForm(form)}
                className={`${selected?.id === form.id ? 'primary' : ''}`}
                style={{ 
                  textAlign: 'left', 
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: selected?.id === form.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: selected?.id === form.id ? 'var(--accent-light)' : 'var(--bg-primary)'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  {form.title || `Assessment ${form.id || idx + 1}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {form.description || 'Health assessment form'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {form.questions?.length || 0} questions
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Assessment Area */}
      <div className="assessment-main">
        {!selected ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">Select an assessment</div>
            <div className="empty-state-description">
              Choose a health assessment from the sidebar to get started
            </div>
          </div>
        ) : (
          <div>
            {/* Assessment Header */}
            <div className="card-header">
              <h2 className="card-title">{selected.title || `Assessment ${selected.id}`}</h2>
              <p className="text-muted">
                {selected.description || 'Complete this assessment to track your health status'}
              </p>
            </div>

            {/* Assessment Form */}
            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="assessment-form">
              {(selected.questions || []).map((question, index) => (
                <div key={question.id} className="assessment-question">
                  <label className="assessment-question-label">
                    {index + 1}. {question.label}
                  </label>
                  
                  {question.type === 'scale' ? (
                    <div className="assessment-scale">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {question.min}
                      </span>
                      <input
                        type="range"
                        min={question.min}
                        max={question.max}
                        value={answers[question.id] || question.min}
                        onChange={(e) => updateAnswer(question.id, parseInt(e.target.value))}
                        className="assessment-question-input"
                      />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {question.max}
                      </span>
                      <div className="assessment-scale-value">
                        {answers[question.id] || question.min}
                      </div>
                    </div>
                  ) : question.type === 'text' ? (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => updateAnswer(question.id, e.target.value)}
                      placeholder="Enter your response..."
                      rows={3}
                      className="assessment-question-input"
                    />
                  ) : (
                    <input
                      type={question.type || 'text'}
                      value={answers[question.id] || ''}
                      onChange={(e) => updateAnswer(question.id, e.target.value)}
                      placeholder="Enter your response..."
                      className="assessment-question-input"
                    />
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {isFormComplete() ? 'Ready to submit' : 'Please complete all questions'}
                </div>
                <button
                  type="submit"
                  disabled={submitting || !isFormComplete()}
                  className="primary"
                  style={{ minWidth: '120px' }}
                >
                  {submitting ? (
                    <>
                      <span className="loading"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Assessment'
                  )}
                </button>
              </div>
            </form>

            {/* Results */}
            {result && (
              <div className="assessment-result">
                <h3 className="assessment-result-title">Assessment Complete!</h3>
                <div className="assessment-result-score">
                  {result.score}
                </div>
                <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                  Your health assessment has been submitted successfully
                </p>
                <div className="assessment-result-date">
                  Submitted on {new Date(result.createdAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


