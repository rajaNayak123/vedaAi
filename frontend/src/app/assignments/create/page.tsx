'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { MobileHeader, MobileBottomNav } from '@/components/MobileNav';
import { useAssignmentStore } from '@/store/assignmentStore';
import toast from 'react-hot-toast';

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Answer Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Fill in the Blanks',
  'Match the Following',
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { form, setFormField, addQuestionType, updateQuestionType, removeQuestionType, resetForm, createAssignment } = useAssignmentStore();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalQuestions = form.questionTypes.reduce((s, qt) => s + qt.count, 0);
  const totalMarks = form.questionTypes.reduce((s, qt) => s + qt.count * qt.marks, 0);

  const validateStep1 = () => {
    if (!title.trim()) { toast.error('Please enter an assignment title'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!form.dueDate) { toast.error('Please select a due date'); return false; }
    if (form.questionTypes.length === 0) { toast.error('Add at least one question type'); return false; }
    for (const qt of form.questionTypes) {
      if (!qt.type) { toast.error('Select a question type for each row'); return false; }
      if (qt.count <= 0) { toast.error('Number of questions must be greater than 0'); return false; }
      if (qt.marks <= 0) { toast.error('Marks must be greater than 0'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('dueDate', form.dueDate);
      fd.append('questionTypes', JSON.stringify(form.questionTypes));
      fd.append('additionalInfo', form.additionalInfo);
      if (file) fd.append('file', file);

      const assignment = await createAssignment(fd);
      resetForm();
      toast.success('Assignment created! Generating question paper...');
      router.push(`/assignments/${assignment._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const counter = (val: number, onChange: (v: number) => void, min = 0) => (
    <div className="capsule-counter">
      <span className="capsule-counter-btn" onClick={() => onChange(Math.max(min, val - 1))}>−</span>
      <span className="capsule-counter-val">{val}</span>
      <span className="capsule-counter-btn" onClick={() => onChange(val + 1)}>+</span>
    </div>
  );

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-layout">
        <MobileHeader title="Create Assignment" backHref="/assignments" />
        <Topbar backHref="/assignments" breadcrumb="Assignment" />
        <div className="content-area">
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>Create Assignment</h1>
            </div>
            <p style={{ color: '#666', fontSize: 13 }}>Set up a new assignment for your students</p>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ height: 6, marginBottom: 24 }}>
            <div className="progress-fill" style={{ width: `${progressPct}%`, transition: 'width 0.4s' }} />
          </div>

          {/* Step 1: Title */}
          {step === 1 && (
            <div className="form-card">
              <h2 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Assignment Title</h2>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>Give your assignment a descriptive name</p>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Title *</label>
              <input
                className="form-input"
                placeholder="e.g. Quiz on Electricity - Grade 8"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            </div>
          )}

          {/* Step 2: Assignment Details */}
          {step === 2 && (
            <div className="form-card">
              <h2 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Assignment Details</h2>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Basic information about your assignment</p>

              {/* File upload */}
              <div
                className="upload-zone"
                style={{ marginBottom: 16, borderColor: dragging ? '#999' : undefined }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
              >
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" style={{ margin: '0 auto 12px' }}>
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                {file ? (
                  <p style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{file.name}</p>
                ) : (
                  <>
                    <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>Choose a file or drag &amp; drop it here</p>
                    <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>JPEG, PNG, upto 10MB</p>
                    <button className="btn-outline" style={{ margin: '0 auto', padding: '8px 20px' }} onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                      Browse Files
                    </button>
                  </>
                )}
              </div>
              {file && <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Upload images of your preferred document/image</p>}

              {/* Due date */}
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Due Date</label>
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <input
                  type="date"
                  className="form-input"
                  style={{ paddingRight: 40 }}
                  value={form.dueDate}
                  onChange={(e) => setFormField('dueDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Question Types */}
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 12 }}>Question Type</label>
              <div className="qt-headers">
                <div className="qt-header-type">Question Type</div>
                <div className="qt-header-questions">No. of Questions</div>
                <div className="qt-header-marks">Marks</div>
              </div>
              {form.questionTypes.map((qt, i) => (
                <div key={i} className="qt-row">
                  <div className="qt-select-container">
                    <select
                      className="qt-select"
                      value={qt.type}
                      onChange={(e) => updateQuestionType(i, 'type', e.target.value)}
                    >
                      {QUESTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={() => removeQuestionType(i)}
                    className="qt-delete-btn"
                    title="Remove Question Type"
                  >
                    ✕
                  </button>

                  <div className="qt-counters-container">
                    <div className="qt-counter-group">
                      <div className="qt-counter-label">No. of Questions</div>
                      {counter(qt.count, (v) => updateQuestionType(i, 'count', v), 1)}
                    </div>
                    <div className="qt-counter-group">
                      <div className="qt-counter-label">Marks</div>
                      {counter(qt.marks, (v) => updateQuestionType(i, 'marks', v), 1)}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addQuestionType}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  marginBottom: 16, padding: '8px 0'
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#1A1A1A',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700
                }}>+</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Add Question Type</span>
              </button>

              {/* Totals */}
              <div style={{ textAlign: 'right', fontSize: 13, color: '#555', marginBottom: 24 }}>
                <div>Total Questions : <strong>{totalQuestions}</strong></div>
                <div>Total Marks : <strong>{totalMarks}</strong></div>
              </div>

              {/* Additional info */}
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Additional Information <span style={{ color: '#888', fontWeight: 400 }}>(For better output)</span>
              </label>
              <div className="textarea-container">
                <textarea
                  className="form-input"
                  style={{ minHeight: 90, resize: 'none', paddingRight: 40 }}
                  placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                  value={form.additionalInfo}
                  onChange={(e) => setFormField('additionalInfo', e.target.value)}
                />
                <button className="textarea-mic-icon" type="button" title="Voice Input">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            {step > 1 ? (
              <button className="btn-outline" style={{ borderRadius: 24, padding: '10px 24px' }} onClick={() => setStep((s) => s - 1)}>
                ← Previous
              </button>
            ) : <div />}

            {step < 2 ? (
              <button className="btn-primary" style={{ borderRadius: 24, padding: '10px 24px' }} onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ borderRadius: 24, padding: '10px 24px' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span style={{
                      width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%', display: 'inline-block'
                    }} className="animate-spin" />
                    Creating...
                  </>
                ) : 'Next →'}
              </button>
            )}
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
