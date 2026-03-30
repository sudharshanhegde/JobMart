import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { MapPin, Clock, X, Check, Loader } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const violetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function MiniMap({ job }) {
  const coords = job.location?.coordinates;
  const hasLocation = coords && (coords[0] !== 0 || coords[1] !== 0);
  if (!hasLocation) {
    return (
      <div className="h-44 bg-navy-800 rounded-2xl flex items-center justify-center gap-2 border border-white/10">
        <MapPin className="w-4 h-4 text-slate-500" />
        <span className="text-slate-500 text-xs">{job.location?.address || 'Location not set'}</span>
      </div>
    );
  }
  const center = [coords[1], coords[0]];
  return (
    <div className="h-44 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} icon={violetIcon} />
      </MapContainer>
    </div>
  );
}

function SwipeCard({ job, onSwipeLeft, onSwipeRight, isTop }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (e) => { if (isTop) { setDragging(true); setDragX(e.deltaX); } },
    onSwipedLeft: () => { if (isTop) { setDragX(0); setDragging(false); onSwipeLeft(); } },
    onSwipedRight: () => { if (isTop) { setDragX(0); setDragging(false); onSwipeRight(); } },
    onTouchEndOrOnMouseUp: () => { if (Math.abs(dragX) < 80) { setDragX(0); setDragging(false); } },
    trackMouse: true,
    trackTouch: true,
  });

  const rotation = dragX * 0.06;
  const scale = isTop ? 1 : 0.95;

  return (
    <div
      {...(isTop ? handlers : {})}
      style={{
        transform: `translateX(${isTop ? dragX : 0}px) rotate(${isTop ? rotation : 0}deg) scale(${scale})`,
        opacity: isTop ? 1 : 0.7,
        transition: dragging ? 'none' : 'all 0.3s ease',
        position: 'absolute',
        width: '100%',
        cursor: isTop ? 'grab' : 'default',
        userSelect: 'none',
      }}
    >
      <div className="bg-navy-700 rounded-3xl shadow-xl p-4 mx-1 relative overflow-hidden border border-white/10">
        {isTop && dragX > 30 && (
          <div className="absolute top-4 left-4 z-10 bg-green-400 text-white text-sm font-bold px-3 py-1 rounded-full rotate-[-20deg] border-2 border-green-500">
            APPLY ✓
          </div>
        )}
        {isTop && dragX < -30 && (
          <div className="absolute top-4 right-4 z-10 bg-red-400 text-white text-sm font-bold px-3 py-1 rounded-full rotate-[20deg] border-2 border-red-500">
            SKIP ✗
          </div>
        )}

        {/* Mini map */}
        {isTop && <MiniMap job={job} />}

        {/* Job info */}
        <div className="mt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-xs bg-primary-400/20 text-primary-400 px-2 py-0.5 rounded-full">{job.category}</span>
              <h2 className="text-lg font-bold text-white mt-1 leading-tight">{job.title}</h2>
              <p className="text-xs text-slate-400">{job.provider?.name}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${job.workMode === 'remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
              {job.workMode}
            </span>
          </div>

          <div className="flex gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3 text-primary-400" />
              {job.location?.address || 'No address'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3 text-primary-400" />
              {job.jobType}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="bg-primary-400/20 rounded-xl px-3 py-1.5">
              <span className="text-lg font-bold text-primary-400">₹{job.salary?.amount?.toLocaleString()}</span>
              <span className="text-xs text-slate-400"> /{job.salary?.period}</span>
            </div>
            <span className="text-xs text-slate-500">{job.vacancies - job.filledVacancies} spot(s) left</span>
          </div>
        </div>

        {isTop && (
          <p className="text-center text-xs text-slate-500 mt-3">← Skip · Apply →</p>
        )}
      </div>
    </div>
  );
}

export default function SwipeJobCards({ jobs: initialJobs, onApplied, onDone }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [applying, setApplying] = useState(false);

  const current = jobs[jobs.length - 1];
  const next = jobs[jobs.length - 2];

  const removeTop = () => {
    setJobs((prev) => prev.slice(0, -1));
    if (jobs.length <= 1) onDone?.();
  };

  const handleSkip = () => {
    toast('Skipped', { icon: '👎' });
    removeTop();
  };

  const handleApply = async () => {
    if (!current) return;
    setApplying(true);
    try {
      await api.post(`/applications/${current._id}`, { coverNote: 'Applied via swipe' });
      toast.success('Applied!', { icon: '🎉' });
      onApplied?.(current._id);
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('already applied')) toast('Already applied', { icon: 'ℹ️' });
      else toast.error(msg || 'Could not apply');
    } finally {
      setApplying(false);
      removeTop();
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <p className="text-5xl mb-4">🎉</p>
        <p className="text-white font-bold text-lg">You've seen all jobs!</p>
        <p className="text-slate-400 text-sm mt-1">Try different filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-2 h-full">
      <p className="text-xs text-slate-400 mb-2">{jobs.length} job{jobs.length !== 1 ? 's' : ''} remaining</p>

      <div className="relative w-full max-w-lg flex-1" style={{ minHeight: 0 }}>
        {next && <SwipeCard key={next._id + '_next'} job={next} isTop={false} onSwipeLeft={() => {}} onSwipeRight={() => {}} />}
        {current && (
          <SwipeCard key={current._id} job={current} isTop={true} onSwipeLeft={handleSkip} onSwipeRight={handleApply} />
        )}
      </div>

      <div className="flex gap-6 mt-4 pb-2 flex-shrink-0">
        <button onClick={handleSkip}
          className="w-14 h-14 rounded-full bg-navy-700 shadow-lg border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors">
          <X className="w-6 h-6 text-red-400" />
        </button>
        <button onClick={handleApply} disabled={applying}
          className="w-14 h-14 rounded-full bg-primary-400 shadow-lg flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-60">
          {applying ? <Loader className="w-5 h-5 text-white animate-spin" /> : <Check className="w-6 h-6 text-white" />}
        </button>
      </div>
      <p className="text-xs text-slate-500 pb-1">✗ Skip · ✓ Apply</p>
    </div>
  );
}
