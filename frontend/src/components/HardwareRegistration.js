import React, { useState } from 'react';
import { hardwareAPI } from '../api';

export default function HardwareRegistration({ onCreated }) {
  const [form, setForm] = useState({ assetTag:'', model:'', serial:'', purchaseDate:'', warrantyExpiry:'' });
  const change = e => setForm({...form, [e.target.name]: e.target.value});
  const submit = async e => {
    e.preventDefault();
    await hardwareAPI.create(form);
    setForm({ assetTag:'', model:'', serial:'', purchaseDate:'', warrantyExpiry:'' });
    onCreated();
  };

  return (
    <form onSubmit={submit}>
      <h3>Register Hardware</h3>
      <input name="assetTag" placeholder="Asset Tag" value={form.assetTag} onChange={change} required />
      <input name="model" placeholder="Model" value={form.model} onChange={change} />
      <input name="serial" placeholder="Serial" value={form.serial} onChange={change} />
      <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={change} />
      <input name="warrantyExpiry" type="date" value={form.warrantyExpiry} onChange={change} />
      <button type="submit">Register</button>
    </form>
  );
}
