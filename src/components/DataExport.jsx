import { useState, useEffect } from 'react'
import { api } from '../api'

export default function DataExport() {
  const [exportData, setExportData] = useState({
    assessments: [],
    conversations: [],
    symptoms: [],
    medications: [],
    goals: []
  });
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedData, setSelectedData] = useState({
    assessments: true,
    conversations: true,
    symptoms: true,
    medications: true,
    goals: true
  });

  useEffect(() => {
    loadExportData();
  }, []);

  async function loadExportData() {
    try {
      setLoading(true);
      // In a real app, this would fetch actual data from the backend
      // For now, we'll generate mock data
      const mockData = generateMockExportData();
      setExportData(mockData);
    } catch (error) {
      console.error('Error loading export data:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateMockExportData() {
    return {
      assessments: [
        {
          id: 1,
          formTitle: 'General Wellness Check',
          score: 85,
          responses: { q1: 4, q2: 5, q3: 'Feeling good today' },
          completedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          formTitle: 'Sleep Quality Assessment',
          score: 78,
          responses: { q1: 7, q2: 4, q3: 3, q4: 1, q5: 'Stress from work' },
          completedAt: '2024-01-14T09:15:00Z'
        }
      ],
      conversations: [
        {
          id: 1,
          title: 'Headache Discussion',
          messageCount: 4,
          createdAt: '2024-01-15T14:20:00Z',
          lastMessage: 'Thank you for the advice!'
        },
        {
          id: 2,
          title: 'Sleep Issues',
          messageCount: 6,
          createdAt: '2024-01-14T21:30:00Z',
          lastMessage: 'I will try the sleep hygiene tips'
        }
      ],
      symptoms: [
        {
          id: 1,
          name: 'Headache',
          severity: 7,
          location: 'Frontal',
          duration: '2 hours',
          triggers: 'Stress, lack of sleep',
          loggedAt: '2024-01-15T08:00:00Z'
        },
        {
          id: 2,
          name: 'Fatigue',
          severity: 6,
          location: 'General',
          duration: 'All day',
          triggers: 'Poor sleep quality',
          loggedAt: '2024-01-14T18:30:00Z'
        }
      ],
      medications: [
        {
          id: 1,
          name: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          startDate: '2024-01-01',
          isActive: true
        },
        {
          id: 2,
          name: 'Omega-3',
          dosage: '1000mg',
          frequency: 'Twice daily',
          startDate: '2024-01-15',
          isActive: true
        }
      ],
      goals: [
        {
          id: 1,
          title: 'Walk 10,000 steps daily',
          category: 'exercise',
          progress: 75,
          status: 'active',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'Drink 8 glasses of water',
          category: 'nutrition',
          progress: 60,
          status: 'active',
          createdAt: '2024-01-10'
        }
      ]
    };
  }

  function exportToJSON() {
    const dataToExport = {};
    
    if (selectedData.assessments) dataToExport.assessments = exportData.assessments;
    if (selectedData.conversations) dataToExport.conversations = exportData.conversations;
    if (selectedData.symptoms) dataToExport.symptoms = exportData.symptoms;
    if (selectedData.medications) dataToExport.medications = exportData.medications;
    if (selectedData.goals) dataToExport.goals = exportData.goals;

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khisha-health-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportToCSV() {
    const csvData = [];
    
    if (selectedData.assessments) {
      csvData.push(['Assessment Data']);
      csvData.push(['ID', 'Form Title', 'Score', 'Completed At']);
      exportData.assessments.forEach(assessment => {
        csvData.push([
          assessment.id,
          assessment.formTitle,
          assessment.score,
          new Date(assessment.completedAt).toLocaleString()
        ]);
      });
      csvData.push([]);
    }

    if (selectedData.symptoms) {
      csvData.push(['Symptom Data']);
      csvData.push(['ID', 'Name', 'Severity', 'Location', 'Duration', 'Logged At']);
      exportData.symptoms.forEach(symptom => {
        csvData.push([
          symptom.id,
          symptom.name,
          symptom.severity,
          symptom.location,
          symptom.duration,
          new Date(symptom.loggedAt).toLocaleString()
        ]);
      });
      csvData.push([]);
    }

    if (selectedData.medications) {
      csvData.push(['Medication Data']);
      csvData.push(['ID', 'Name', 'Dosage', 'Frequency', 'Start Date', 'Status']);
      exportData.medications.forEach(medication => {
        csvData.push([
          medication.id,
          medication.name,
          medication.dosage,
          medication.frequency,
          medication.startDate,
          medication.isActive ? 'Active' : 'Inactive'
        ]);
      });
      csvData.push([]);
    }

    if (selectedData.goals) {
      csvData.push(['Goal Data']);
      csvData.push(['ID', 'Title', 'Category', 'Progress', 'Status', 'Created At']);
      exportData.goals.forEach(goal => {
        csvData.push([
          goal.id,
          goal.title,
          goal.category,
          `${goal.progress}%`,
          goal.status,
          goal.createdAt
        ]);
      });
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khisha-health-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportToPDF() {
    // In a real app, you would use a library like jsPDF or Puppeteer
    // For now, we'll create a simple HTML report that can be printed
    const reportContent = generatePDFContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  }

  function generatePDFContent() {
    const currentDate = new Date().toLocaleString();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Khisha Health Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8fafc; }
          .summary { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 Khisha Health Report</h1>
          <p>Generated on ${currentDate}</p>
          <p>Date Range: ${dateRange.start} to ${dateRange.end}</p>
        </div>
        
        <div class="summary">
          <h3>📊 Summary</h3>
          <p><strong>Total Assessments:</strong> ${exportData.assessments.length}</p>
          <p><strong>Total Conversations:</strong> ${exportData.conversations.length}</p>
          <p><strong>Total Symptoms Logged:</strong> ${exportData.symptoms.length}</p>
          <p><strong>Active Medications:</strong> ${exportData.medications.filter(m => m.isActive).length}</p>
          <p><strong>Active Goals:</strong> ${exportData.goals.filter(g => g.status === 'active').length}</p>
        </div>

        ${selectedData.assessments ? `
        <div class="section">
          <h2>📋 Assessment History</h2>
          <table>
            <tr><th>Form</th><th>Score</th><th>Completed</th></tr>
            ${exportData.assessments.map(a => `
              <tr>
                <td>${a.formTitle}</td>
                <td>${a.score}/100</td>
                <td>${new Date(a.completedAt).toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}

        ${selectedData.symptoms ? `
        <div class="section">
          <h2>🩺 Symptom Log</h2>
          <table>
            <tr><th>Symptom</th><th>Severity</th><th>Location</th><th>Duration</th><th>Logged</th></tr>
            ${exportData.symptoms.map(s => `
              <tr>
                <td>${s.name}</td>
                <td>${s.severity}/10</td>
                <td>${s.location}</td>
                <td>${s.duration}</td>
                <td>${new Date(s.loggedAt).toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}

        ${selectedData.medications ? `
        <div class="section">
          <h2>💊 Medications</h2>
          <table>
            <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Status</th></tr>
            ${exportData.medications.map(m => `
              <tr>
                <td>${m.name}</td>
                <td>${m.dosage}</td>
                <td>${m.frequency}</td>
                <td>${m.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}

        ${selectedData.goals ? `
        <div class="section">
          <h2>🎯 Health Goals</h2>
          <table>
            <tr><th>Goal</th><th>Category</th><th>Progress</th><th>Status</th></tr>
            ${exportData.goals.map(g => `
              <tr>
                <td>${g.title}</td>
                <td>${g.category}</td>
                <td>${g.progress}%</td>
                <td>${g.status}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}

        <div class="section">
          <h2>📝 Notes</h2>
          <p>This report contains your personal health data from the Khisha Health platform. 
          Please keep this information secure and consult with healthcare professionals for medical advice.</p>
        </div>
      </body>
      </html>
    `;
  }

  function handleExport() {
    switch (exportFormat) {
      case 'json':
        exportToJSON();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'pdf':
        exportToPDF();
        break;
      default:
        alert('Please select an export format');
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Loading export data...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Export Overview */}
      <div className="dashboard-grid mb-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Assessments</h3>
            <div className="dashboard-card-icon primary">📋</div>
          </div>
          <div className="dashboard-card-value">{exportData.assessments.length}</div>
          <p className="dashboard-card-content">Available for export</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Conversations</h3>
            <div className="dashboard-card-icon success">💬</div>
          </div>
          <div className="dashboard-card-value">{exportData.conversations.length}</div>
          <p className="dashboard-card-content">Chat history available</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Symptoms</h3>
            <div className="dashboard-card-icon warning">🩺</div>
          </div>
          <div className="dashboard-card-value">{exportData.symptoms.length}</div>
          <p className="dashboard-card-content">Symptom logs available</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Medications</h3>
            <div className="dashboard-card-icon error">💊</div>
          </div>
          <div className="dashboard-card-value">{exportData.medications.length}</div>
          <p className="dashboard-card-content">Medication records available</p>
        </div>
      </div>

      {/* Export Configuration */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Export Your Health Data</h2>
          <p className="text-muted">Download your health information in various formats</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Data Selection */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Select Data to Export</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(selectedData).map(([key, value]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSelectedData({...selectedData, [key]: e.target.checked})}
                    style={{ margin: 0 }}
                  />
                  <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                    {key === 'assessments' ? '📋 Health Assessments' :
                     key === 'conversations' ? '💬 Chat Conversations' :
                     key === 'symptoms' ? '🩺 Symptom Logs' :
                     key === 'medications' ? '💊 Medications' :
                     key === 'goals' ? '🎯 Health Goals' : key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Settings */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Export Settings</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              >
                <option value="json">JSON (Complete Data)</option>
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="pdf">PDF (Report)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Date Range</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={handleExport}
              className="primary"
              style={{ width: '100%' }}
              disabled={!Object.values(selectedData).some(Boolean)}
            >
              📥 Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Export Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">About Data Export</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>📄 JSON Format</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Complete data export with all details. Best for data analysis or importing into other applications.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>📊 CSV Format</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Spreadsheet-compatible format. Perfect for analysis in Excel or Google Sheets.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>📋 PDF Format</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Professional health report. Ideal for sharing with healthcare providers.
            </p>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <strong>Privacy Note:</strong> Your health data is sensitive information. Please ensure you store and share it securely. 
            This export contains your personal health information and should be treated with the same care as medical records.
          </p>
        </div>
      </div>
    </div>
  );
}
