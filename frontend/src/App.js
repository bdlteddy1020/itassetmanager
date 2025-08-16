import React, { useEffect, useState } from 'react';
import ProcurementForm from './components/ProcurementForm';
import ProcurementList from './components/ProcurementList';
import HardwareList from './components/HardwareList';
import SupportTickets from './components/SupportTickets';
import BugTracker from './components/BugTracker';
import { procurementAPI, hardwareAPI, supportAPI, bugAPI } from './api';

function App() {
  const [procurements, setProcurements] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [bugs, setBugs] = useState([]);

  const loadAll = async () => {
    const [pRes, hRes, tRes, bRes] = await Promise.all([
      procurementAPI.list(),
      hardwareAPI.list(),
      supportAPI.list(),
      bugAPI.list()
    ]);
    setProcurements(pRes.data);
    setHardware(hRes.data);
    setTickets(tRes.data);
    setBugs(bRes.data);
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>IT Asset Manager App</h1>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <ProcurementForm onCreated={loadAll} />
        <ProcurementList procurements={procurements} onUpdated={loadAll} />
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        
        <HardwareList hardware={hardware} onUpdated={loadAll} />
      </section>
    {/*
      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <SupportTickets tickets={tickets} onUpdated={loadAll} />
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <BugTracker bugs={bugs} onUpdated={loadAll} />
      </section>*/}
    </div>
  );
}

export default App;
