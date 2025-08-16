import React, { useEffect, useState } from 'react';
import { procurementAPI, hardwareAPI } from '../api';


export default function HardwareList() {
  const [procurements, setProcurements] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedHardwareItem, setSelectedHardwareItem] = useState(null);
  //const [hardwareList, setHardwareList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hardwareToEdit, setHardwareToEdit] = useState(null); 

  {/*
  useEffect(() => {
  const fetchHardware = async () => {
    try {
      const response = await hardwareAPI.list();
      setHardwareList(response.data); // ✅ Store the list
    } catch (error) {
      console.error('Error fetching hardware list:', error);
    }
  };
  fetchHardware();
}, []);
*/}

  // Fetch procurements on mount
  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const res = await procurementAPI.list();
      setProcurements(res.data);
    } catch (err) {
      console.error('Failed to fetch procurements', err);
    }
  };

  const registerHardware = async (item) => {
    setLoadingId(item._id);

    const assetId = `ASSET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const hardwareData = {
      name: item.itemName,
      assetTag: assetId,
      model: item.itemName,
      serial: `AUTO-${Math.floor(Math.random() * 100000)}`,
      department: item.department,
      registeredBy: 'IT Admin',
      status: 'Available',
      assignedTo: '',
      purchaseDate: new Date(),
      warrantyExpiry: null,
      procurementId: item._id 
    };

    try {
      await hardwareAPI.create(hardwareData);
      alert(`Hardware registered with Asset ID: ${assetId}`);
      fetchProcurements(); 
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      alert(`Registration failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const deliveredItems = procurements.filter(p => p.status === 'Delivered' || p.status === 'Registered');

  const getHardwareByProcurementId = async (procurementId) => {
  try {
    const res = await hardwareAPI.list(); // Assuming this returns all hardware
    const hardwareItem = res.data.find(h => h.procurementId === procurementId);
    return hardwareItem;
  } catch (err) {
    console.error('Error fetching hardware:', err);
    return null;
  }
};

const handleEdit = async (item) => {
  const hardwareItem = await getHardwareByProcurementId(item._id);
  if (!hardwareItem) {
    alert('No hardware found for this procurement.');
    return;
  }
  setHardwareToEdit(hardwareItem);
  setShowEditModal(true);
};



  const handleDelete = (item) => {
  setSelectedHardwareItem(item);
  setShowConfirm(true);
};

const [hardwareToView, setHardwareToView] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);

const handleView = async (item) => {
  try {
    const response = await getHardwareByProcurementId(item._id);
  if (!response) {
      alert('No hardware found for this procurement.');
      return;
    }
    setHardwareToView(response);
    setShowViewModal(true);
  } catch (error) {
    console.error('Error fetching hardware:', error);
  }
};

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: '8px', color: '#1D4ED8', fontSize: '1.2rem', fontWeight: '600' }}>
          Hardware Registration and Assignment
      </h1>

      {/* Delivered & Registered Items Table */}
      <div style={{ marginTop: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', padding: '16px' }}>
        <h3 style={{ marginBottom: '16px' }}>Registered Hardware</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveredItems.map(item => (
              <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{item.itemName}</td>
                <td style={tdStyle}>{item.department}</td>
                <td style={tdStyle}><strong>{item.status}</strong></td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {item.status === 'Registered' ? (
                    <>
                      <button
                        style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}
                        onClick={() => handleView(item)}
                      >
                        View
                      </button>

                      <button
                        style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '4px', backgroundColor: '#6366f1', color: 'white', border: 'none' }}
                        onClick={() => handleEdit(item)}
                      >
                        Update
                      </button>

                      <button
                        style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: '#e53935', color: 'white', border: 'none' }}
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: '#f59e0b', color: 'white', border: 'none' }}
                      onClick={() => registerHardware(item)}
                      disabled={loadingId === item._id}
                    >
                      {loadingId === item._id ? 'Registering...' : 'Register Hardware'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>            

        {showEditModal && hardwareToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Update Hardware</h3>

              {/* Responsive 3-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Explicitly include name and registeredBy first */}
                {['name', 'registeredBy', 'assetTag', 'model', 'serial', 'department', 'assignedTo', 'purchaseDate', 'warrantyExpiry', 'status'].map(key => {
                  const value = hardwareToEdit[key];
                  const isDateField = ['purchaseDate', 'warrantyExpiry'].includes(key);
                  const isStatusField = key === 'status';

                  return (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key === 'name' ? 'Item Name' : key === 'registeredBy' ? 'Registered By' : key}
                      </label>

                      {isStatusField ? (
                        <select
                          value={value}
                          onChange={(e) =>
                            setHardwareToEdit({ ...hardwareToEdit, [key]: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        >
                          <option value="available">Available</option>
                          <option value="assigned">Assigned</option>
                          <option value="decommissioned">Decommissioned</option>
                        </select>
                      ) : isDateField ? (
                        <input
                          type="date"
                          value={value ? new Date(value).toISOString().split('T')[0] : ''}
                          onChange={(e) =>
                            setHardwareToEdit({ ...hardwareToEdit, [key]: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) =>
                            setHardwareToEdit({ ...hardwareToEdit, [key]: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-10">
                <button
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={async () => {
                    try {
                      await hardwareAPI.update(hardwareToEdit._id, hardwareToEdit);
                      alert('Hardware updated successfully.');
                      fetchProcurements();
                    } catch (err) {
                      console.error('Update error:', err);
                      alert('Update failed.');
                    } finally {
                      setShowEditModal(false);
                      setHardwareToEdit(null);
                    }
                  }}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                  onClick={() => {
                    setShowEditModal(false);
                    setHardwareToEdit(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      {showViewModal && hardwareToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div
            className="h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out transform translate-x-0"
          >
            <div className="p-6 overflow-y-auto h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Hardware Details</h2>
                <button
                  className="text-red-500 hover:text-red-700 text-xl font-bold"
                  onClick={() => setShowViewModal(false)}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              <div className="divide-y divide-gray-200 border rounded-md overflow-hidden">
                {[
                  { label: 'Item Name', value: hardwareToView.name },
                  { label: 'Asset Tag', value: hardwareToView.assetTag },
                  { label: 'Model', value: hardwareToView.model },
                  { label: 'Serial', value: hardwareToView.serial },
                  { label: 'Registered By', value: hardwareToView.registeredBy },
                  { label: 'Department', value: hardwareToView.department },
                  { label: 'Assigned To', value: hardwareToView.assignedTo },
                  {
                    label: 'Purchase Date',
                    value: hardwareToView.purchaseDate
                      ? new Date(hardwareToView.purchaseDate).toLocaleDateString()
                      : '—'
                  },
                  {
                    label: 'Warranty Expiry',
                    value: hardwareToView.warrantyExpiry
                      ? new Date(hardwareToView.warrantyExpiry).toLocaleDateString()
                      : '—'
                  },
                  { label: 'Procurement ID', value: hardwareToView.procurementId },
                  { label: 'Status', value: hardwareToView.status }
                ].map(({ label, value }, index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-2 px-4 py-3 ${
                      index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm text-gray-600 font-medium">{label}</div>
                    <div className="text-base text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="mt-auto pt-6 border-t">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
)}


       {showConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
      <p className="text-gray-700 text-center mb-6">
        Are you sure you want to delete <strong className="text-red-600">{selectedHardwareItem?.itemName}</strong>?
      </p>
      
      <div className="flex justify-center gap-4">
        <button
          className="bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          onClick={async () => {
            try {
              const hardwareItem = await getHardwareByProcurementId(selectedHardwareItem._id);
              if (!hardwareItem) {
                alert('No hardware found for this procurement.');
                return;
              }

              await hardwareAPI.deleteHardware(hardwareItem._id);
              alert(`${selectedHardwareItem.itemName} deleted successfully.`);
              fetchProcurements();
            } catch (err) {
              console.error('Delete error:', err.response?.data || err.message);
              alert(`Delete failed: ${err.response?.data?.error || err.message}`);
            } finally {
              setShowConfirm(false);
              setSelectedHardwareItem(null);
            }
          }}
        >
          Confirm Delete
        </button>

        <button
          className="bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
          onClick={() => {
            setShowConfirm(false);
            setSelectedHardwareItem(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



      </div>
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

const backdropStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  textAlign: 'center',
  minWidth: '300px'
};

