import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Assessment() {
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.listForms().then((res) => setForms(res.forms || [])).catch(() => setForms([]));
  }, []);

  async function submit() {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment({ formId: selected.id, responses: answers });
      setResult(res.assessment);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '20px auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Forms</h3>
        {forms.length === 0 ? <div>No forms available</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {forms.map((f, idx) => (
              <button key={f.id || idx} onClick={() => { setSelected(f); setAnswers({}); setResult(null); }} style={{ textAlign: 'left' }}>
                {f.title || `Form ${f.id || idx+1}`}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Assessment</h3>
        {!selected ? (
          <div>Select a form</div>
        ) : (
          <div>
            <p><strong>Selected:</strong> {selected.title || `Form ${selected.id}`}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Placeholder for dynamic questions; use dummy 3 questions for now */}
              {[1,2,3].map((q) => (
                <div key={q}>
                  <label>Question {q}</label>
                  <input value={answers[q] || ''} onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })} />
                </div>
              ))}
            </div>
            <button onClick={submit} disabled={submitting} style={{ marginTop: 12 }}>{submitting ? 'Submitting...' : 'Submit'}</button>
            {result && (
              <div style={{ marginTop: 12 }}>
                <h4 style={{ marginBottom: 6 }}>Result</h4>
                <div>Score: {result.score}</div>
                <div>Submitted: {new Date(result.timestamp).toLocaleString()}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


