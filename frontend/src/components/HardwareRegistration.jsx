import React, { useState } from 'react';
import { hardwareAPI } from '../api';

export default function HardwareRegistration({ procurements = [], onCreated }) {
  const [form, setForm] = useState({
    assetTag: '',
    name: '',
    model: '',
    serial: '',
    purchaseDate: '',
    warrantyExpiry: '',
    assignedTo: '',
    status: 'available',
    department: '',
    registeredBy: 'IT Admin',
    procurementId: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const requiredFields = ['assetTag', 'name', 'serial', 'registeredBy'];
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        alert(`Field "${field}" is required`);
        return false;
      }
    }

    if (!/^[<A-Z0-9 />-]+$/.test(form.serial)) {
      alert('Serial must contain only uppercase letters, numbers, and dashes');
      return false;
    }

    if (form.purchaseDate && form.warrantyExpiry && new Date(form.warrantyExpiry) < new Date(form.purchaseDate)) {
      alert('Warranty expiry cannot be before purchase date');
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await hardwareAPI.create(form);
      setSuccess(res.data.hardware);
      setForm({
        assetTag: '',
        name: '',
        model: '',
        serial: '',
        purchaseDate: '',
        warrantyExpiry: '',
        assignedTo: '',
        status: 'available',
        department: '',
        registeredBy: 'IT Admin',
        procurementId: null
      });
      if (onCreated) onCreated();
    } catch (err) {
        console.error('Register hardware error:', err);

        if (err.response?.data) {
          const { error, name, stack } = err.response.data;
          console.error('Backend error:', error);
          console.error('Error type:', name);
          console.error('Stack trace:', stack);
          alert(`Error registering hardware: ${error}`);
        } else {
          alert(`Error registering hardware: ${err.message}`);
        }
}

finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <h3 style={{ gridColumn: '1 / -1', marginBottom: 8 }}>Register Hardware</h3>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Asset Tag</label>
          <input name="assetTag" value={form.assetTag} onChange={change} style={inputStyle} required />
        </div>
    
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Hardware Name</label>
          <input name="name" value={form.name} onChange={change} style={inputStyle} required />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Model</label>
          <input name="model" value={form.model} onChange={change} style={inputStyle} />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Serial</label>
          <input name="serial" value={form.serial} onChange={change} style={inputStyle} required />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Purchase Date</label>
          <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={change} style={inputStyle} />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Warranty Expiry</label>
          <input name="warrantyExpiry" type="date" value={form.warrantyExpiry} onChange={change} style={inputStyle} />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Assigned To</label>
          <input name="assignedTo" value={form.assignedTo} onChange={change} style={inputStyle} />
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Status</label>  
          <select name="status" value={form.status} onChange={change} style={inputStyle}>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="decommissioned">Decommissioned</option>
          </select>
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Department</label>
          <input name="department" value={form.location} onChange={change} style={inputStyle} />
        </div>

        <div style={{ ...fieldContainerStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Registered By</label>
          <input name="registeredBy" value={form.registeredBy} onChange={change} style={inputStyle} required />
        </div>

        <div style={{ ...fieldContainerStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Procurement</label>
          <select
            name="procurementId"
            value={form.procurementId || ''}
            onChange={change}
            style={inputStyle}
            required
          >
            <option value="">Select Procurement</option>
            {procurements
              .filter(p => p.status === 'Delivered')
              .map(p => (
                <option key={p._id} value={p._id}>
                  {p.itemName} ({p.department})
                </option>
              ))}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {success && (
        <div style={{ marginTop: 24, padding: 16, backgroundColor: '#e6ffe6', borderRadius: 8 }}>
          <h4>✅ Hardware Registered Successfully</h4>
          <p><strong>Asset Tag:</strong> {success.assetTag}</p>
          <p><strong>Name:</strong> {success.name}</p>
          <p><strong>Serial:</strong> {success.serial}</p>
          <p><strong>Status:</strong> {success.status}</p>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 2,
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const fieldContainerStyle = {
  marginLeft: '8px',
  marginRight: '8px'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
