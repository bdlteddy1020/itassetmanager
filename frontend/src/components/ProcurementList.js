import React from 'react';
import { procurementAPI } from '../api';

export default function ProcurementList({ procurements, onUpdated }) {
  const approve = async (id) => {
    await procurementAPI.approve(id, { approvedBy: 'Manager' });
    onUpdated();
  };
  const markDelivered = async (id) => {
    // Optionally you can pass hardware items to create
    await procurementAPI.markDelivered(id, { createHardware: false });
    onUpdated();
  };

  return (
    <div>
      <h3>Procurements</h3>
      <ul>
        {procurements.map(p => (
          <li key={p._id}>
            {p.itemName} x{p.quantity} - <b>{p.status}</b>
            {p.status === 'Pending' && <button onClick={() => approve(p._id)}>Approve</button>}
            {p.status === 'Ordered' && <button onClick={() => markDelivered(p._id)}>Mark Delivered</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
