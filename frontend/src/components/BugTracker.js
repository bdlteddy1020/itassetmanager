import React, { useState } from 'react';
import { bugAPI } from '../api';

export default function BugTracker({ bugs, onUpdated }) {
  const [form, setForm] = useState({ title:'', description:'', severity:'Medium', relatedHardwareId:'' });

  const submit = async (e) => {
    e.preventDefault();
    await bugAPI.create(form);
    setForm({ title:'', description:'', severity:'Medium', relatedHardwareId:'' });
    onUpdated();
  };

  const changeStatus = async (id, status) => {
    await bugAPI.update(id, { status });
    onUpdated();
  };

  return (
    <div>
      <h3>Bug Tracker</h3>
      <form onSubmit={submit}>
        <input name="title" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input name="relatedHardwareId" placeholder="Related Hardware ID (optional)" value={form.relatedHardwareId} onChange={e=>setForm({...form, relatedHardwareId:e.target.value})}/>
        <textarea name="description" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <select value={form.severity} onChange={e=>setForm({...form, severity:e.target.value})}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <button type="submit">Create Bug</button>
      </form>

      <ul>
        {bugs.map(b => (
          <li key={b._id}>
            {b.title} - {b.status} - {b.severity}
            {b.status !== 'Resolved' && <button onClick={()=>changeStatus(b._id,'Resolved')}>Resolve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
