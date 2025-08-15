import React from 'react';
import { procurementAPI } from '../api';

export default function ProcurementList({ procurements = [], onUpdated }) {
  const [loadingId, setLoadingId] = React.useState(null);

  const approve = async (id) => {
    setLoadingId(id);
    try {
      await procurementAPI.approve(id, { approvedBy: 'Manager' });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Approve error', err.response?.data || err.message);
      alert('Approve failed');
    } finally {
      setLoadingId(null);
    }
  };

  const markDelivered = async (id) => {
    setLoadingId(id);
    try {
      await procurementAPI.deliver(id, { createHardware: false });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Deliver error', err.response?.data || err.message);
      alert('Mark delivered failed');
    } finally {
      setLoadingId(null);
    }
  };

  const remove = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this procurement request?');
    if (!confirmed) return;

    setLoadingId(id);
    try {
      await procurementAPI.delete(id);
      alert('Procurement request deleted successfully');
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Delete error', err.response?.data || err.message);
      alert('Delete failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h1 style={{ marginBottom: '8px', color: '#1D4ED8', fontSize: '1.2rem', fontWeight: '600' }}>
          Procurement Request
      </h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>Item Name</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {procurements.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{p.itemName}</td>
              <td style={tdStyle}>{p.quantity}</td>
              <td style={tdStyle}>{p.department}</td>
              <td style={tdStyle}><strong>{p.status || 'Pending'}</strong></td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {p.status === 'Pending' && (
                    <button onClick={() => approve(p._id)} disabled={loadingId === p._id}>
                      {loadingId === p._id ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                  {p.status === 'Ordered' && (
                    <button onClick={() => markDelivered(p._id)} disabled={loadingId === p._id}>
                      {loadingId === p._id ? 'Delivering...' : 'Mark Delivered'}
                    </button>
                  )}
                  <button
                    onClick={() => remove(p._id)}
                    disabled={loadingId === p._id}
                    style={{
                      backgroundColor: '#e53935',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loadingId === p._id ? 'not-allowed' : 'pointer',
                      opacity: loadingId === p._id ? 0.6 : 1,
                    }}
                  >
                    {loadingId === p._id ? 'Deleting...' : 'Delete'}
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ccc',
  fontWeight: '600'
};

const tdStyle = {
  padding: '12px',
  verticalAlign: 'middle'
};
