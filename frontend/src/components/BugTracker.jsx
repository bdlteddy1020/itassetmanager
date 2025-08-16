// src/components/BugTracker.jsx
import React, { useState } from 'react';
import { bugAPI } from '../api';

export default function BugTracker({ bugs = [], onUpdated }) {
  const [form, setForm] = useState({ title: '', description: '', severity: 'Medium', relatedHardwareId: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await bugAPI.create(form);
      setForm({ title:'', description:'', severity:'Medium', relatedHardwareId:'' });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Create bug', err.response?.data || err.message);
      alert('Error creating bug');
    }
  };

  const resolve = async (id) => {
    try {
      await bugAPI.update(id, { status: 'Resolved', resolvedAt: new Date() });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Resolve bug', err.response?.data || err.message);
      alert('Resolve failed');
    }
  };

  return (
    <div>
      <h3>Bug Tracker</h3>
      <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input name="relatedHardwareId" placeholder="Related Hardware ID" value={form.relatedHardwareId} onChange={e => setForm({ ...form, relatedHardwareId: e.target.value })} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Create Bug</button>
        </div>
      </form>

      <ul style={{ marginTop: 12 }}>
        {bugs.map(b => (
          <li key={b._id}>
            {b.title} — {b.status} — {b.severity}
            {b.status !== 'Resolved' && <button onClick={() => resolve(b._id)} style={{ marginLeft: 8 }}>Resolve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
