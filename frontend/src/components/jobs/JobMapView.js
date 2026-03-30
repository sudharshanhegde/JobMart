import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

export default function JobMapView({ jobs }) {
  const navigate = useNavigate();

  // Filter jobs with valid coordinates (non-zero)
  const mappableJobs = jobs.filter(
    (j) => j.location?.coordinates?.[0] !== 0 || j.location?.coordinates?.[1] !== 0
  );

  // Default center: Mangaluru, Karnataka
  const center = mappableJobs.length > 0
    ? [mappableJobs[0].location.coordinates[1], mappableJobs[0].location.coordinates[0]]
    : [12.9141, 74.8560];

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm h-full min-h-[400px]">
      {mappableJobs.length === 0 ? (
        <div className="h-full bg-slate-100 flex flex-col items-center justify-center text-center p-6">
          <p className="text-3xl mb-2">🗺️</p>
          <p className="text-navy-700 font-semibold text-sm">No jobs with location data</p>
          <p className="text-slate-400 text-xs mt-1">Jobs posted with GPS will appear here</p>
        </div>
      ) : (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mappableJobs.map((job) => (
            <Marker
              key={job._id}
              position={[job.location.coordinates[1], job.location.coordinates[0]]}
              icon={yellowIcon}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.category} · {job.jobType}</p>
                  <p className="text-xs font-semibold text-yellow-600 mt-1">
                    ₹{job.salary?.amount?.toLocaleString()} / {job.salary?.period}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.location?.address}</p>
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="mt-2 w-full bg-yellow-400 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-yellow-500"
                  >
                    View & Apply
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
