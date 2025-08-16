import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function ProcurementForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    department: '',
    requester: '',
    justification: '',
    status: 'Pending'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/procurements', formData);
      if (onSuccess) onSuccess();
      setFormData({
        itemName: '',
        quantity: 1,
        department: '',
        requester: '',
        justification: '',
        status: 'Pending'
      });
    } catch (err) {
      setError('Failed to submit procurement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">New Procurement Request</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Item Name */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
    <input
      type="text"
      name="itemName"
      value={formData.itemName}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Quantity */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
    <input
      type="number"
      name="quantity"
      value={formData.quantity}
      onChange={handleChange}
      min="1"
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Department */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
    <input
      type="text"
      name="department"
      value={formData.department}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Requester */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">Requester</label>
    <input
      type="text"
      name="requester"
      value={formData.requester}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Justification (full width) */}
  <div className="col-span-1 md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
    <textarea
      name="justification"
      value={formData.justification}
      onChange={handleChange}
      rows="4"
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      required
    />
  </div>

  {/* Submit Button (full width) */}
  <div className="col-span-1 md:col-span-2">
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-2 rounded text-white font-medium transition ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Submitting...' : 'Submit Procurement'}
    </button>
  </div>
</form>

    </div>
  );
}
