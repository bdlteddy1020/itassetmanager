import React from 'react';
import { procurementAPI } from '../api';

export default function ProcurementList({ procurements = [], onUpdated }) {
<<<<<<< HEAD
  const [loadingId, setLoadingId] = React.useState(null);

  const approve = async (id) => {
    setLoadingId(id);
=======
  const approve = async (id) => {
>>>>>>> temp-save
    try {
      await procurementAPI.approve(id, { approvedBy: 'Manager' });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Approve error', err.response?.data || err.message);
      alert('Approve failed');
<<<<<<< HEAD
    } finally {
      setLoadingId(null);
    }
  };

  const markDelivered = async (id) => {
    setLoadingId(id);
=======
    }
  };

  const Order = async (id) => {
    try {
      await procurementAPI.order(id);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Order error', err.response?.data || err.message);
      alert('Placing Order failed');
    }
  };

  const Delivered = async (id) => {
>>>>>>> temp-save
    try {
      await procurementAPI.deliver(id, { createHardware: false });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Deliver error', err.response?.data || err.message);
<<<<<<< HEAD
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
=======
      alert('Confirm delivery failed');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this procurement?')) return;
    try {
      await procurementAPI.delete(id);
>>>>>>> temp-save
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Delete error', err.response?.data || err.message);
      alert('Delete failed');
<<<<<<< HEAD
    } finally {
      setLoadingId(null);
=======
    }
  };

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold';
    switch (status) {
      case 'Pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'Approved':
        return <span className={`${base} bg-blue-100 text-blue-800`}>Approved</span>;
      case 'Ordered':
        return <span className={`${base} bg-indigo-100 text-indigo-800`}>Ordered</span>;
      case 'Delivered':
        return <span className={`${base} bg-green-100 text-green-800`}>Delivered</span>;
      case 'Rejected':
        return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
>>>>>>> temp-save
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Procurement Requests</h2>

      {procurements.length === 0 ? (
        <p className="text-gray-500">No procurements found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Requester</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {procurements.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{p.itemName}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{p.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{p.department}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{p.requester}</td>
                  <td className="px-4 py-2 text-sm">{statusBadge(p.status)}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="space-x-2">
                        {p.status === 'Pending' && (
                            <button
                            onClick={() => approve(p._id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                            >
                            Approve
                            </button>
                        )}
                        {p.status === 'Approved' && (
                            <button
                            onClick={() => Order(p._id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                            >
                            Place Order
                            </button>
                        )}
                        {p.status === 'Ordered' && (
                            <button
                            onClick={() => Delivered(p._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            >
                            Confirm Delivered
                            </button>
                        )}
                        </div>

                        <button
                        onClick={() => deleteItem(p._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                        Delete
                        </button>
                    </div>
                    </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
>>>>>>> temp-save
