import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#10B981;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:14px">📍</span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

/**
 * LocationSearch — type an address, pick from live suggestions (Nominatim/OSM).
 * Calls onSelect({ name, lat, lng }) when a result is chosen.
 */
export default function LocationSearch({ value, onSelect, placeholder = 'Search for a place... e.g. Park Street, Kolkata' }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (text) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 3) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Bias results toward West Bengal / India for relevance, but search is global
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=in&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (err) {
        setResults([]);
      } finally { setLoading(false); }
    }, 450);
  };

  const pick = (place) => {
    const name = place.display_name.split(',').slice(0, 3).join(',').trim();
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setQuery(name);
    setSelected({ lat, lng });
    setOpen(false);
    onSelect({ name, lat, lng });
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={e => { search(e.target.value); setSelected(null); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 40px 10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: '.2s' }}
          onFocusCapture={e => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlurCapture={e => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--muted)' }}>
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      {/* Suggestions dropdown */}
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '10px', boxShadow: '0 8px 28px rgba(0,0,0,.15)', zIndex: 50, maxHeight: '260px', overflowY: 'auto' }}>
          {results.map((r, i) => (
            <div key={i} onClick={() => pick(r)}
              style={{ padding: '11px 14px', cursor: 'pointer', fontSize: '13.5px', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', transition: '.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontWeight: '500' }}>📍 {r.display_name.split(',')[0]}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{r.display_name}</div>
            </div>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.trim().length >= 3 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '14px', fontSize: '13px', color: 'var(--muted)', zIndex: 50 }}>
          No places found. Try a different search term.
        </div>
      )}

      {/* Map preview once a place is selected */}
      {selected && (
        <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
          <MapContainer center={[selected.lat, selected.lng]} zoom={15} style={{ height: '180px', width: '100%' }} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            <Marker position={[selected.lat, selected.lng]} icon={pinIcon} />
          </MapContainer>
          <div style={{ padding: '8px 14px', background: 'var(--light)', fontSize: '12px', color: 'var(--accent2)', fontWeight: '600' }}>
            ✓ Location confirmed — {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
