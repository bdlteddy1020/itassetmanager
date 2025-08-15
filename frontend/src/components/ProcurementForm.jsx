import React, { useState } from 'react';
import { procurementAPI } from '../api';

export default function ProcurementForm({ onCreated }) {
  const [form, setForm] = useState({
    itemName: '',
    quantity: 1,
    department: '',
    requestedBy: '',
    justification: '',
    approved: false,
    delivered: false,
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        itemName: form.itemName.trim(),
        quantity: parseInt(form.quantity),
        department: form.department.trim(),
        requestedBy: form.requestedBy.trim(),
        justification: form.justification.trim(),
        approved: false,
        delivered: false,
        status: 'Pending'
      };

      await procurementAPI.create(payload);
      alert('Procurement request submitted successfully!');
      setForm({
        itemName: '',
        quantity: 1,
        department: '',
        requestedBy: '',
        justification: '',
        approved: false,
        delivered: false,
        status: 'Pending'
      });

      if (onCreated) onCreated();
    } catch (err) {
      console.error('Create procurement error', err.response?.data || err.message);
      alert('Error creating procurement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      padding: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginBottom: '24px'
    }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <h1 style={{ marginBottom: '8px', color: '#1D4ED8', fontSize: '1.2rem', fontWeight: '600' }}>
          New Procurement Request
      </h1>
        <p style={{ marginBottom: '5px' }}>Fill out the form below to request new hardware.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="itemName">Item Name</label>
        <input id="itemName" name="itemName" value={form.itemName} onChange={change} required />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={change} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="department">Department</label>
        <input id="department" name="department" value={form.department} onChange={change} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="requestedBy">Requested By</label>
        <input id="requestedBy" name="requestedBy" value={form.requestedBy} onChange={change} />
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="justification">Justification</label>
        <textarea
          id="justification"
          name="justification"
          value={form.justification}
          onChange={change}
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
