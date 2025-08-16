// src/components/SupportTickets.jsx
import React, { useState } from 'react';
import { supportAPI } from '../api';

export default function SupportTickets({ tickets = [], onUpdated }) {
  const [form, setForm] = useState({ hardwareId: '', raisedBy: '', issue: '', severity: 'Medium' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await supportAPI.create(form);
      setForm({ hardwareId:'', raisedBy:'', issue:'', severity:'Medium' });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Create ticket', err.response?.data || err.message);
      alert('Error creating ticket');
    }
  };

  const resolve = async (id) => {
    try {
      await supportAPI.update(id, { status: 'Resolved', resolvedAt: new Date() });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Resolve ticket', err.response?.data || err.message);
      alert('Resolve failed');
    }
  };

  return (
    <div>
      <h3>Support Tickets</h3>
      <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <input name="hardwareId" placeholder="Hardware ID" value={form.hardwareId} onChange={e => setForm({ ...form, hardwareId: e.target.value })} required />
        <input name="raisedBy" placeholder="Raised By" value={form.raisedBy} onChange={e => setForm({ ...form, raisedBy: e.target.value })} />
        <input name="issue" placeholder="Issue" value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} />
        <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Raise Ticket</button>
        </div>
      </form>

      <ul style={{ marginTop: 12 }}>
        {tickets.map(t => (
          <li key={t._id}>
            {t.issue} — {t.status} — {t.severity}
            {t.status !== 'Resolved' && <button onClick={() => resolve(t._id)} style={{ marginLeft: 8 }}>Resolve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
