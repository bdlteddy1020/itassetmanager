import React, { useState } from 'react';
import { hardwareAPI } from '../api';

export default function HardwareList({ hardware, onUpdated }) {
  const [assignForm, setAssignForm] = useState({ assignedTo:'', department:'', location:'' });
  const [selected, setSelected] = useState(null);

  const startAssign = (hw) => {
    setSelected(hw._id);
    setAssignForm({ assignedTo: hw.assignedTo || '', department: hw.department || '', location: hw.location || '' });
  };

  const submitAssign = async () => {
    await hardwareAPI.assign(selected, assignForm);
    setSelected(null);
    onUpdated();
  };

  return (
    <div>
      <h3>Hardware</h3>
      <ul>
        {hardware.map(h => (
          <li key={h._id}>
            {h.assetTag} - {h.model} - <b>{h.status}</b>
            <button onClick={() => startAssign(h)}>Assign</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <h4>Assign Hardware</h4>
          <input placeholder="Assigned To" value={assignForm.assignedTo} onChange={e=>setAssignForm({...assignForm, assignedTo:e.target.value})}/>
          <input placeholder="Department" value={assignForm.department} onChange={e=>setAssignForm({...assignForm, department:e.target.value})}/>
          <input placeholder="Location" value={assignForm.location} onChange={e=>setAssignForm({...assignForm, location:e.target.value})}/>
          <button onClick={submitAssign}>Save Assignment</button>
          <button onClick={()=>setSelected(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
