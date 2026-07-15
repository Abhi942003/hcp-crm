import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitFormInteraction, fetchInteractions } from '../store/interactionsSlice';

export default function FormMode() {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    hcp_name: '',
    hcp_specialty: '',
    channel: '',
    products_discussed: '',
    topics: '',
    sentiment: '',
    materials_shared: '',
    follow_up: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await dispatch(submitFormInteraction(form));
    await dispatch(fetchInteractions());
    setSubmitted(true);
    setForm({
      hcp_name: '', hcp_specialty: '', channel: '',
      products_discussed: '', topics: '', sentiment: '',
      materials_shared: '', follow_up: '',
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Log Interaction</h2>
      {submitted && (
        <div style={styles.successBanner}>
          ✅ Interaction logged successfully!
        </div>
      )}
      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>HCP Name *</label>
          <input style={styles.input} name="hcp_name" value={form.hcp_name}
            onChange={handleChange} placeholder="Dr. Priya Sharma" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Specialty</label>
          <input style={styles.input} name="hcp_specialty" value={form.hcp_specialty}
            onChange={handleChange} placeholder="Cardiologist" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Channel</label>
          <select style={styles.input} name="channel" value={form.channel} onChange={handleChange}>
            <option value="">Select channel</option>
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Sentiment</label>
          <select style={styles.input} name="sentiment" value={form.sentiment} onChange={handleChange}>
            <option value="">Select sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div style={styles.fieldFull}>
          <label style={styles.label}>Products Discussed</label>
          <input style={styles.input} name="products_discussed" value={form.products_discussed}
            onChange={handleChange} placeholder="CardioMax, OncoCure" />
        </div>
        <div style={styles.fieldFull}>
          <label style={styles.label}>Topics</label>
          <textarea style={styles.textarea} name="topics" value={form.topics}
            onChange={handleChange} placeholder="What was discussed?" />
        </div>
        <div style={styles.fieldFull}>
          <label style={styles.label}>Materials Shared</label>
          <input style={styles.input} name="materials_shared" value={form.materials_shared}
            onChange={handleChange} placeholder="Brochure, Clinical trial data" />
        </div>
        <div style={styles.fieldFull}>
          <label style={styles.label}>Follow Up</label>
          <input style={styles.input} name="follow_up" value={form.follow_up}
            onChange={handleChange} placeholder="Call next week with more data" />
        </div>
      </div>
      <button style={styles.button} onClick={handleSubmit}>
        Log Interaction
      </button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e3a8a',
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' },
  label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  input: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    height: '80px',
    resize: 'vertical',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
  },
};