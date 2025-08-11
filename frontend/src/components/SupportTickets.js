import React, { useState } from 'react';
import { supportAPI } from '../api';

export default function SupportTickets({ tickets, onUpdated }) {
  const [form, setForm] = useState({ hardwareId:'', raisedBy:'', issue:'', severity:'Medium' });

  const submit = async (e) => {
    e.preventDefault();
    await supportAPI.create(form);
    setForm({ hardwareId:'', raisedBy:'', issue:'', severity:'Medium' });
    onUpdated();
  };

  const update = async (id, data) => {
    await supportAPI.update(id, data);
    onUpdated();
  };

  return (
    <div>
      <h3>Support Tickets</h3>
      <form onSubmit={submit}>
        <input name="hardwareId" placeholder="Hardware ID" value={form.hardwareId} onChange={e=>setForm({...form, hardwareId:e.target.value})} required />
        <input name="raisedBy" placeholder="Raised By" value={form.raisedBy} onChange={e=>setForm({...form, raisedBy:e.target.value})} />
        <input name="issue" placeholder="Issue" value={form.issue} onChange={e=>setForm({...form, issue:e.target.value})} required />
        <select name="severity" value={form.severity} onChange={e=>setForm({...form, severity:e.target.value})}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <button type="submit">Raise Ticket</button>
      </form>

      <ul>
        {tickets.map(t => (
          <li key={t._id}>
            {t.issue} - {t.status} - {t.severity}
            {t.status !== 'Resolved' && <button onClick={()=>update(t._id, { status: 'Resolved', resolvedAt: new Date(), resolutionNotes: 'Fixed' })}>Resolve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
