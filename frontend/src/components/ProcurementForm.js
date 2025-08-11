import React, { useState } from 'react';
import { procurementAPI } from '../api';

export default function ProcurementForm({ onCreated }) {
  const [form, setForm] = useState({ itemName:'', quantity:1, department:'', requester:'', justification:'' });

  const change = e => setForm({...form, [e.target.name]: e.target.value});
  const submit = async e => {
    e.preventDefault();
    await procurementAPI.create(form);
    setForm({ itemName:'', quantity:1, department:'', requester:'', justification:''});
    onCreated();
  };

  return (
    <form onSubmit={submit}>
      <h3>New Procurement Request</h3>
      <input name="itemName" placeholder="Item" value={form.itemName} onChange={change} required />
      <input name="quantity" type="number" value={form.quantity} onChange={change} min="1" />
      <input name="department" placeholder="Department" value={form.department} onChange={change} />
      <input name="requester" placeholder="Requester" value={form.requester} onChange={change} />
      <input name="justification" placeholder="Justification" value={form.justification} onChange={change} />
      <button type="submit">Submit Request</button>
    </form>
  );
}
