import React, { useEffect, useState } from 'react';
import ProcurementForm from './components/ProcurementForm';
import ProcurementList from './components/ProcurementList';
import HardwareList from './components/HardwareList';
import { procurementAPI, hardwareAPI } from './api'; // remove supportAPI & bugAPI

function App() {
  const [procurements, setProcurements] = useState([]);
  const [hardware, setHardware] = useState([]);

  const loadAll = async () => {
    const [pRes, hRes] = await Promise.all([
      procurementAPI.list(),
      hardwareAPI.list(),
    ]);
    setProcurements(pRes.data);
    setHardware(hRes.data);
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "600",
          color: "#1e293b",
          textAlign: "center",
          marginBottom: "20px",
          paddingBottom: "10px",
          borderBottom: "2px solid #3b82f6",
          letterSpacing: "0.5px",
        }}
      >
        IT Asset Manager App
      </h1>

      <section style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
        <ProcurementForm onCreated={loadAll} />
        <ProcurementList procurements={procurements} onUpdated={loadAll} />
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
        <HardwareList hardware={hardware} onUpdated={loadAll} />
      </section>
    </div>
  );
}

export default App;
