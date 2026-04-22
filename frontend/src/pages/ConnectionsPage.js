import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Star, MapPin, Loader, MessageCircle, Clock, Check, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function makeIcon(initial, color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:white;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">${initial}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function UserCard({ profile, status, onRequest }) {
  // status: 'none' | 'pending' | 'connected'
  const user = profile.user;
  const { lang } = useLanguage();

  const [contact, setContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);

  const fetchContact = async () => {
    if (contact) {
      const number = contact.whatsappNumber?.replace(/\D/g, '') || contact.phoneNumber?.replace(/\D/g, '');
      if (!number) return toast.error(t(lang, 'noWhatsApp'));
      const text = encodeURIComponent(`Hi ${contact.name}! I found your profile on JobMart.`);
      window.open(`https://wa.me/91${number}?text=${text}`, '_blank');
      return;
    }
    setLoadingContact(true);
    try {
      const res = await api.get(`/users/contact/${user._id}`);
      setContact(res.data.user);
      const number = res.data.user.whatsappNumber?.replace(/\D/g, '') || res.data.user.phoneNumber?.replace(/\D/g, '');
      if (!number) return toast.error(t(lang, 'noWhatsApp'));
      const text = encodeURIComponent(`Hi ${res.data.user.name}! I found your profile on JobMart.`);
      window.open(`https://wa.me/91${number}?text=${text}`, '_blank');
    } catch {
      toast.error('Could not fetch contact info');
    } finally {
      setLoadingContact(false);
    }
  };

  return (
    <div className="bg-navy-700 rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-primary-400 text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
        {profile.jobCategory && <p className="text-xs text-primary-400 mt-0.5">{profile.jobCategory}</p>}
        <div className="flex items-center gap-2 mt-1">
          {profile.averageRating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-slate-400">
              <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
              {profile.averageRating}
            </span>
          )}
          {user?.location?.address && (
            <span className="flex items-center gap-0.5 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {user.location.address.split(',')[0]}
            </span>
          )}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${profile.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-400'}`}>
            {profile.status === 'available' ? t(lang, 'available') : t(lang, 'busy')}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        {status === 'connected' ? (
          <>
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-green-500/20 text-green-400">
              <UserCheck className="w-3.5 h-3.5" /> {t(lang, 'connected')}
            </span>
            <button onClick={fetchContact} disabled={loadingContact}
              className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-green-600 disabled:opacity-60">
              {loadingContact ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
              {t(lang, 'chat')}
            </button>
          </>
        ) : status === 'pending' ? (
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3.5 h-3.5" /> {t(lang, 'pending')}
          </span>
        ) : (
          <button onClick={() => onRequest(user?._id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-primary-400 text-white hover:bg-primary-500">
            <UserPlus className="w-3.5 h-3.5" /> {t(lang, 'connect')}
          </button>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, onRespond }) {
  const { lang } = useLanguage();
  return (
    <div className="bg-navy-700 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-primary-400 text-lg">{request.from?.name?.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm">{request.from?.name}</p>
        <p className="text-xs text-slate-400 capitalize">{request.from?.role}</p>
        <p className="text-xs text-slate-500 mt-0.5">{t(lang, 'wantsToConnect')}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onRespond(request._id, 'accepted')}
          className="w-9 h-9 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/40">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={() => onRespond(request._id, 'rejected')}
          className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function NearbyTab({ connectedIds, pendingIds, onRequest }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [radius, setRadius] = useState(10);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/nearby?radius=${radius}`);
        setNearby(res.data.users || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load nearby users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [radius]);

  const mappable = nearby.filter(u => u.location?.coordinates && (u.location.coordinates[0] !== 0 || u.location.coordinates[1] !== 0));
  const center = mappable.length > 0
    ? [mappable[0].location.coordinates[1], mappable[0].location.coordinates[0]]
    : [12.9141, 74.8560];

  const oppositeRole = user?.role === 'worker' ? t(lang, 'provider') : t(lang, 'worker');

  return (
    <div className="space-y-3">
      {/* Radius selector */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{mappable.length} {oppositeRole} {t(lang, 'foundNearby')}</p>
        <div className="flex gap-1">
          {[5, 10, 20].map(r => (
            <button key={r} onClick={() => setRadius(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${radius === r ? 'bg-primary-400 text-white border-primary-400' : 'border-white/20 text-slate-400'}`}>
              {r}km
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-primary-400" /></div>
      ) : mappable.length === 0 ? (
        <div className="bg-navy-700 rounded-2xl p-10 text-center">
          <p className="text-3xl mb-2">📍</p>
          <p className="text-white font-semibold text-sm">{t(lang, 'noNearby')} {oppositeRole}</p>
          <p className="text-slate-400 text-xs mt-1">{t(lang, 'tryRadius')}</p>
        </div>
      ) : (
        <>
          {/* Map */}
          <div className="h-72 rounded-2xl overflow-hidden border border-white/10">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mappable.map(u => {
                const pos = [u.location.coordinates[1], u.location.coordinates[0]];
                const initial = u.name?.charAt(0).toUpperCase() || '?';
                const color = u.role === 'worker' ? '#6366f1' : '#10b981';
                const status = connectedIds.includes(u._id.toString()) ? 'connected' : pendingIds.includes(u._id.toString()) ? 'pending' : 'none';
                return (
                  <Marker key={u._id} position={pos} icon={makeIcon(initial, color)}>
                    <Popup>
                      <div className="min-w-[160px] space-y-1">
                        <p className="font-bold text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{u.role} · {u.distanceKm}km away</p>
                        {u.profile?.jobCategory && <p className="text-xs text-indigo-600">{u.profile.jobCategory}</p>}
                        {u.profile?.skills?.length > 0 && <p className="text-xs text-gray-400">{u.profile.skills.slice(0, 3).join(', ')}</p>}
                        {u.profile?.averageRating > 0 && (
                          <p className="text-xs text-yellow-600">★ {u.profile.averageRating} ({u.profile.totalRatings} ratings)</p>
                        )}
                        <p className={`text-xs font-medium ${u.profile?.status === 'available' ? 'text-green-600' : 'text-gray-400'}`}>
                          {u.profile?.status || 'unknown'}
                        </p>
                        {status === 'connected' ? (
                          <p className="text-xs font-semibold text-green-600">✓ Connected</p>
                        ) : status === 'pending' ? (
                          <p className="text-xs font-semibold text-yellow-600">⏳ Request sent</p>
                        ) : (
                          <button onClick={() => onRequest(u._id.toString())}
                            className="w-full mt-1 bg-indigo-500 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-indigo-600">
                            Connect
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* List below map */}
          <div className="space-y-2">
            {nearby.map(u => {
              const status = connectedIds.includes(u._id.toString()) ? 'connected' : pendingIds.includes(u._id.toString()) ? 'pending' : 'none';
              return (
                <div key={u._id} className="bg-navy-700 rounded-xl p-3 flex items-center gap-3 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-400">{u.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.profile?.jobCategory || u.role} · <span className="text-primary-400">{u.distanceKm}km away</span></p>
                  </div>
                  {status === 'connected' ? (
                    <span className="text-xs text-green-400 font-medium">{t(lang, 'connected')}</span>
                  ) : status === 'pending' ? (
                    <span className="text-xs text-yellow-400 font-medium">{t(lang, 'pending')}</span>
                  ) : (
                    <button onClick={() => onRequest(u._id.toString())}
                      className="text-xs bg-primary-400 text-white px-3 py-1.5 rounded-xl hover:bg-primary-500 flex items-center gap-1">
                      <UserPlus className="w-3 h-3" /> {t(lang, 'connect')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function ConnectionsPage() {
  useAuth();
  const { lang } = useLanguage();
  const [tab, setTab] = useState('discover');
  const [users, setUsers] = useState([]);
  const [connectedIds, setConnectedIds] = useState([]);
  const [pendingIds, setPendingIds] = useState([]); // IDs I've sent requests to
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/users/requests'),
        ]);
        const connections = profileRes.data.profile.connections || [];
        setConnectedIds(connections.map((c) => c._id || c));
        setIncomingRequests(requestsRes.data.requests || []);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    if (tab !== 'discover') { setLoading(false); return; }
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/discover');
        setUsers(res.data.users || []);
        // Fetch pending requests I've sent
        // We derive pendingIds from discover results - not needed here
        // Instead load from a future endpoint or track locally
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [tab]);

  const handleRequest = async (userId) => {
    try {
      await api.post(`/users/request/${userId}`);
      setPendingIds((prev) => [...prev, userId]);
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await api.put(`/users/requests/${requestId}`, { action });
      if (action === 'accepted') {
        const req = incomingRequests.find((r) => r._id === requestId);
        if (req) setConnectedIds((prev) => [...prev, req.from._id]);
        toast.success('Connection accepted!');
      } else {
        toast('Request declined', { icon: '👋' });
      }
      setIncomingRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const getStatus = (userId) => {
    if (connectedIds.includes(userId)) return 'connected';
    if (pendingIds.includes(userId)) return 'pending';
    return 'none';
  };

  const filtered = users.filter((p) =>
    !search ||
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.jobCategory?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: 'discover', label: t(lang, 'discover') },
    { key: 'nearby', label: t(lang, 'nearby') },
    { key: 'connections', label: `${t(lang, 'mine')}${connectedIds.length > 0 ? ` (${connectedIds.length})` : ''}` },
    { key: 'requests', label: `${t(lang, 'requests')}${incomingRequests.length > 0 ? ` (${incomingRequests.length})` : ''}` },
  ];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">{t(lang, 'connectionsTitle')}</h1>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 text-xs font-medium py-2.5 rounded-xl transition-colors ${tab === t.key ? 'bg-primary-400 text-white' : 'bg-navy-700 border border-white/10 text-slate-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <>
          <input type="text" placeholder={t(lang, 'searchByName')} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/20 bg-navy-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-500" />
          {loading ? (
            <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-primary-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-navy-700 rounded-2xl p-10 text-center"><p className="text-3xl mb-2">👥</p><p className="text-white font-semibold text-sm">{t(lang, 'noUsersFound')}</p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((profile) => (
                <UserCard key={profile._id} profile={profile} status={getStatus(profile.user?._id)} onRequest={handleRequest} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'connections' && (
        <div className="space-y-3">
          {connectedIds.length === 0 ? (
            <div className="bg-navy-700 rounded-2xl p-10 text-center">
              <p className="text-3xl mb-2">🤝</p>
              <p className="text-white font-semibold text-sm">{t(lang, 'noConnections')}</p>
              <button onClick={() => setTab('discover')} className="mt-3 bg-primary-400 text-white text-xs px-4 py-2 rounded-xl">{t(lang, 'discoverPeople')}</button>
            </div>
          ) : (
            users.filter((p) => connectedIds.includes(p.user?._id)).map((profile) => (
              <UserCard key={profile._id} profile={profile} status="connected" onRequest={() => {}} />
            ))
          )}
        </div>
      )}

      {tab === 'nearby' && (
        <NearbyTab connectedIds={connectedIds} pendingIds={pendingIds} onRequest={handleRequest} />
      )}

      {tab === 'requests' && (
        <div className="space-y-3">
          {incomingRequests.length === 0 ? (
            <div className="bg-navy-700 rounded-2xl p-10 text-center">
              <p className="text-3xl mb-2">📬</p>
              <p className="text-white font-semibold text-sm">{t(lang, 'noPendingRequests')}</p>
            </div>
          ) : (
            incomingRequests.map((req) => (
              <RequestCard key={req._id} request={req} onRespond={handleRespond} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
