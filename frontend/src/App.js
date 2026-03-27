import { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({ order_number: '', customer_name: '', pickup_address: '', dropoff_address: '', driver_name: '', eta: '' });

  const loadDeliveries = () => {
    fetch(`${API_BASE}/deliveries`).then(r => r.json()).then(setDeliveries);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const createDelivery = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ order_number: '', customer_name: '', pickup_address: '', dropoff_address: '', driver_name: '', eta: '' });
      loadDeliveries();
    }
  };

  const updateDeliveryStatus = async (id, status) => {
    await fetch(`${API_BASE}/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadDeliveries();
  };

  const simulateMovement = async (id) => {
    await fetch(`${API_BASE}/deliveries/${id}/simulate`, { method: 'POST' });
    setTimeout(loadDeliveries, 500);
  };

  const getLastLocation = (tracking) => {
    if (!tracking || tracking.length === 0) return null;
    const sorted = [...tracking].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted[0];
  };

  return (
    <div className="app-shell">
      <h1 className="app-title">🚚 Delivery Tracker</h1>
      <section className="panel">
        <h2>Create delivery</h2>
        <form onSubmit={createDelivery} className="form-grid">
          <input value={form.order_number} placeholder="Order number" onChange={e => setForm({ ...form, order_number: e.target.value })} required />
          <input value={form.customer_name} placeholder="Customer name" onChange={e => setForm({ ...form, customer_name: e.target.value })} required />
          <input value={form.pickup_address} placeholder="Pickup address" onChange={e => setForm({ ...form, pickup_address: e.target.value })} />
          <input value={form.dropoff_address} placeholder="Dropoff address" onChange={e => setForm({ ...form, dropoff_address: e.target.value })} />
          <input value={form.driver_name} placeholder="Driver name" onChange={e => setForm({ ...form, driver_name: e.target.value })} />
          <input value={form.eta} placeholder="ETA" onChange={e => setForm({ ...form, eta: e.target.value })} />
          <button type="submit">Create</button>
        </form>
      </section>

      <section className="panel">
        <h2>Deliveries</h2>
        {deliveries.length === 0 ? <p>No deliveries yet.</p> : deliveries.map(d => {
          const lastLoc = getLastLocation(d.tracking);
          return (
            <div key={d.id} className="delivery-card">
              <div className="delivery-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{d.order_number}</strong>
                <span className="status-badge">{d.status}</span>
              </div>
              <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.85rem' }}>
                <strong>Tracking Code:</strong> {d.tracking_code}
              </div>
              <p>{d.customer_name} ▸ {d.pickup_address} → {d.dropoff_address}</p>
              <p>Driver: {d.driver_name} | ETA: {d.eta || 'N/A'}</p>
              {lastLoc && (
                <div style={{ background: '#ecfdf5', padding: '8px 12px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.85rem' }}>
                  <strong>📍 Current Location:</strong> {lastLoc.latitude.toFixed(4)}, {lastLoc.longitude.toFixed(4)}
                </div>
              )}
              <div className="status-options">
                <button onClick={() => simulateMovement(d.id)}>🚀 Simulate Movement</button>
                {['pending', 'picked', 'in-transit', 'delivered'].map(s => (
                  <button key={s} onClick={() => updateDeliveryStatus(d.id, s)}>{s}</button>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
