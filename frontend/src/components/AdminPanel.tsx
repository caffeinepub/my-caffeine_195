import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  useGetDistricts,
  useAddDistrict,
  useAddVillage,
  useDeleteDistrict,
  useDeleteVillage,
  useGetDonations,
  useGetMemberships,
  useGetAssistanceRequests,
  useGetContactInquiries,
  useGetGalleryEvents,
  useAddGalleryEvent,
  useDeleteGalleryEvent,
  useAddGalleryImage,
  useDeleteGalleryImage,
} from '../hooks/useQueries';
import { Loader2, Trash2, Plus, Upload, Eye, EyeOff, Lock, Image, MapPin, Users, Heart, Phone, DollarSign, Settings } from 'lucide-react';

const PASSCODE_KEY = 'gaf_admin_passcode';
const DEFAULT_PASSCODE = 'damin1234';

function getStoredPasscode(): string {
  return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
}

// ---- Passcode Login Gate ----
function PasscodeGate({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === getStoredPasscode()) {
      onSuccess();
    } else {
      setError('गलत पासकोड। कृपया दोबारा कोशिश करें।');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6e3' }}>
      <div className="bg-white rounded-2xl shadow-xl border-2 p-8 w-full max-w-md" style={{ borderColor: '#632626' }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#632626' }}>
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
            एडमिन पैनल
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8b6914' }}>गौसिया अशरफिया फाउंडेशन</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>पासकोड दर्ज करें</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passcode}
                onChange={e => { setPasscode(e.target.value); setError(''); }}
                className="w-full border-2 rounded-lg px-4 py-2 pr-10 focus:outline-none"
                style={{ borderColor: '#dacc96', background: '#fdf6e3', color: '#1a1a1a' }}
                placeholder="पासकोड"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#632626' }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: '#632626' }}
          >
            लॉगिन करें
          </button>
        </form>
      </div>
    </div>
  );
}

// ---- Change Passcode Section ----
function ChangePasscodeSection() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (current.trim() !== getStoredPasscode()) {
      setError('वर्तमान पासकोड गलत है।');
      return;
    }
    if (newPass.length < 6) {
      setError('नया पासकोड कम से कम 6 अक्षर का होना चाहिए।');
      return;
    }
    if (newPass !== confirm) {
      setError('नया पासकोड और पुष्टि पासकोड मेल नहीं खाते।');
      return;
    }
    localStorage.setItem(PASSCODE_KEY, newPass);
    toast.success('पासकोड सफलतापूर्वक बदला गया');
    setCurrent(''); setNewPass(''); setConfirm('');
  };

  return (
    <div className="bg-white rounded-xl border p-6 max-w-md" style={{ borderColor: '#dacc96' }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626' }}>पासकोड बदलें</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>वर्तमान पासकोड</label>
          <input
            type="password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>नया पासकोड</label>
          <input
            type="password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>पासकोड की पुष्टि करें</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105"
          style={{ background: '#632626' }}
        >
          पासकोड बदलें
        </button>
      </form>
    </div>
  );
}

// ---- Donations Tab ----
function DonationsTab() {
  const { data: donations, isLoading } = useGetDonations();
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>;
  const list = (donations as any[]) || [];
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626' }}>दान रिकॉर्ड</h3>
      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-8">अभी तक कोई दान दर्ज नहीं हुआ।</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#dacc96' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#632626', color: 'white' }}>
              <tr>
                <th className="px-4 py-3 text-left">नाम</th>
                <th className="px-4 py-3 text-left">राशि</th>
                <th className="px-4 py-3 text-left">UPI ID</th>
                <th className="px-4 py-3 text-left">संदेश</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fdf6e3' : 'white' }}>
                  <td className="px-4 py-2">{d.name}</td>
                  <td className="px-4 py-2">₹{d.amount}</td>
                  <td className="px-4 py-2">{d.upiTransactionId}</td>
                  <td className="px-4 py-2">{d.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Memberships Tab ----
function MembershipsTab() {
  const { data: memberships, isLoading } = useGetMemberships();
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>;
  const list = (memberships as any[]) || [];
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626' }}>सदस्यता आवेदन</h3>
      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-8">अभी तक कोई सदस्यता आवेदन नहीं आया।</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#dacc96' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#632626', color: 'white' }}>
              <tr>
                <th className="px-4 py-3 text-left">नाम</th>
                <th className="px-4 py-3 text-left">मोबाइल</th>
                <th className="px-4 py-3 text-left">शहर</th>
                <th className="px-4 py-3 text-left">आधार</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fdf6e3' : 'white' }}>
                  <td className="px-4 py-2">{m.fullName}</td>
                  <td className="px-4 py-2">{m.mobile}</td>
                  <td className="px-4 py-2">{m.city}</td>
                  <td className="px-4 py-2">{m.aadhaar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Assistance Tab ----
function AssistanceTab() {
  const { data: requests, isLoading } = useGetAssistanceRequests();
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>;
  const list = (requests as any[]) || [];
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626' }}>सहायता अनुरोध</h3>
      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-8">अभी तक कोई सहायता अनुरोध नहीं आया।</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#dacc96' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#632626', color: 'white' }}>
              <tr>
                <th className="px-4 py-3 text-left">नाम</th>
                <th className="px-4 py-3 text-left">मोबाइल</th>
                <th className="px-4 py-3 text-left">शहर</th>
                <th className="px-4 py-3 text-left">सहायता प्रकार</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fdf6e3' : 'white' }}>
                  <td className="px-4 py-2">{r.fullName}</td>
                  <td className="px-4 py-2">{r.mobile}</td>
                  <td className="px-4 py-2">{r.city}</td>
                  <td className="px-4 py-2">{r.assistanceType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Contact Tab ----
function ContactTab() {
  const { data: inquiries, isLoading } = useGetContactInquiries();
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>;
  const list = (inquiries as any[]) || [];
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626' }}>संपर्क संदेश</h3>
      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-8">अभी तक कोई संदेश नहीं आया।</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#dacc96' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#632626', color: 'white' }}>
              <tr>
                <th className="px-4 py-3 text-left">नाम</th>
                <th className="px-4 py-3 text-left">ईमेल</th>
                <th className="px-4 py-3 text-left">मोबाइल</th>
                <th className="px-4 py-3 text-left">संदेश</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fdf6e3' : 'white' }}>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.mobile}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Villages Tab ----
function VillagesTab() {
  const { data: districts, isLoading } = useGetDistricts();
  const addDistrict = useAddDistrict();
  const addVillage = useAddVillage();
  const deleteDistrict = useDeleteDistrict();
  const deleteVillage = useDeleteVillage();

  const [districtName, setDistrictName] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [villageName, setVillageName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtName.trim()) return;
    await addDistrict.mutateAsync(districtName.trim());
    setDistrictName('');
  };

  const handleAddVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageName.trim() || !selectedDistrictId) return;
    await addVillage.mutateAsync({ districtId: BigInt(selectedDistrictId), villageName: villageName.trim() });
    setVillageName('');
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setBulkImporting(true);
    const lines = bulkText.split('\n').filter(l => l.trim());
    let count = 0;
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const dName = line.substring(0, colonIdx).trim();
      const vNames = line.substring(colonIdx + 1).split(',').map(v => v.trim()).filter(Boolean);
      if (!dName) continue;
      try {
        const districtId = await addDistrict.mutateAsync(dName);
        for (const vName of vNames) {
          await addVillage.mutateAsync({ districtId: BigInt(districtId.toString()), villageName: vName });
          count++;
        }
      } catch {}
    }
    setBulkImporting(false);
    setBulkText('');
    toast.success(`${count} गाँव सफलतापूर्वक आयात किए गए`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: '#632626' }}>गाँव प्रबंधन</h3>

      {/* Add District */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-3" style={{ color: '#632626' }}>नया जिला जोड़ें</h4>
        <form onSubmit={handleAddDistrict} className="flex gap-2">
          <input
            type="text"
            value={districtName}
            onChange={e => setDistrictName(e.target.value)}
            placeholder="जिले का नाम"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
          <button
            type="submit"
            disabled={addDistrict.isPending}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1"
            style={{ background: '#632626' }}
          >
            {addDistrict.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            जोड़ें
          </button>
        </form>
      </div>

      {/* Add Village */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-3" style={{ color: '#632626' }}>नया गाँव जोड़ें</h4>
        <form onSubmit={handleAddVillage} className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedDistrictId}
            onChange={e => setSelectedDistrictId(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          >
            <option value="">जिला चुनें</option>
            {(districts || []).map(d => (
              <option key={d.id.toString()} value={d.id.toString()}>{d.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={villageName}
            onChange={e => setVillageName(e.target.value)}
            placeholder="गाँव का नाम"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
          <button
            type="submit"
            disabled={addVillage.isPending}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1"
            style={{ background: '#632626' }}
          >
            {addVillage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            जोड़ें
          </button>
        </form>
      </div>

      {/* Bulk Import */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-2" style={{ color: '#632626' }}>बल्क आयात (टेक्स्ट)</h4>
        <p className="text-xs text-gray-500 mb-2">फॉर्मेट: जिला: गाँव1, गाँव2, गाँव3 (प्रत्येक जिला नई लाइन पर)</p>
        <textarea
          value={bulkText}
          onChange={e => setBulkText(e.target.value)}
          rows={4}
          placeholder="उदाहरण:&#10;बाराबंकी: रामनगर, श्यामपुर, देवपुर&#10;लखनऊ: आलमबाग, इंदिरानगर"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none text-sm"
          style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
        />
        <button
          onClick={handleBulkImport}
          disabled={bulkImporting || !bulkText.trim()}
          className="mt-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1"
          style={{ background: '#632626' }}
        >
          {bulkImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {bulkImporting ? 'आयात हो रहा है...' : 'बल्क आयात करें'}
        </button>
      </div>

      {/* Districts List */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-3" style={{ color: '#632626' }}>जिले और गाँव</h4>
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>
        ) : (districts || []).length === 0 ? (
          <p className="text-gray-500 text-center py-4">कोई जिला नहीं जोड़ा गया।</p>
        ) : (
          <div className="space-y-3">
            {(districts || []).map(district => (
              <div key={district.id.toString()} className="border rounded-lg p-3" style={{ borderColor: '#dacc96' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold" style={{ color: '#632626' }}>{district.name}</span>
                  <button
                    onClick={() => deleteDistrict.mutate(district.id)}
                    disabled={deleteDistrict.isPending}
                    className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {district.villages.map(v => (
                    <span
                      key={v.id.toString()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                      style={{ background: '#fdf6e3', border: '1px solid #dacc96', color: '#632626' }}
                    >
                      {v.name}
                      <button
                        onClick={() => deleteVillage.mutate(v.id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {district.villages.length === 0 && (
                    <span className="text-xs text-gray-400">कोई गाँव नहीं</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Gallery Tab ----
function GalleryTab() {
  const { data: events, isLoading } = useGetGalleryEvents();
  const addEvent = useAddGalleryEvent();
  const deleteEvent = useDeleteGalleryEvent();
  const addImage = useAddGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const [eventTitle, setEventTitle] = useState('');
  const [eventSubtitle, setEventSubtitle] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    await addEvent.mutateAsync({ title: eventTitle.trim(), subtitle: eventSubtitle.trim() });
    setEventTitle('');
    setEventSubtitle('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEventId) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async () => {
          const base64 = reader.result as string;
          try {
            await addImage.mutateAsync({
              eventId: BigInt(selectedEventId),
              imageData: base64,
              caption: caption.trim(),
            });
          } catch {}
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setUploading(false);
    setCaption('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: '#632626' }}>गैलरी प्रबंधन</h3>

      {/* Add Event */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-3" style={{ color: '#632626' }}>नया इवेंट जोड़ें</h4>
        <form onSubmit={handleAddEvent} className="space-y-2">
          <input
            type="text"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            placeholder="इवेंट का शीर्षक"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
          <input
            type="text"
            value={eventSubtitle}
            onChange={e => setEventSubtitle(e.target.value)}
            placeholder="उपशीर्षक (वैकल्पिक)"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
          <button
            type="submit"
            disabled={addEvent.isPending}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1"
            style={{ background: '#632626' }}
          >
            {addEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            इवेंट जोड़ें
          </button>
        </form>
      </div>

      {/* Upload Images */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
        <h4 className="font-semibold mb-3" style={{ color: '#632626' }}>फोटो अपलोड करें</h4>
        <div className="space-y-2">
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          >
            <option value="">इवेंट चुनें</option>
            {(events || []).map(ev => (
              <option key={ev.id.toString()} value={ev.id.toString()}>{ev.title}</option>
            ))}
          </select>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="फोटो का कैप्शन (वैकल्पिक)"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={!selectedEventId || uploading}
              className="hidden"
              id="gallery-upload"
            />
            <label
              htmlFor="gallery-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium cursor-pointer transition-all hover:scale-105 ${(!selectedEventId || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ background: '#632626' }}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'अपलोड हो रहा है...' : 'फोटो चुनें'}
            </label>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin w-6 h-6" style={{ color: '#632626' }} /></div>
        ) : (events || []).length === 0 ? (
          <p className="text-gray-500 text-center py-4">कोई इवेंट नहीं जोड़ा गया।</p>
        ) : (
          (events || []).map(event => (
            <div key={event.id.toString()} className="bg-white rounded-xl border p-4" style={{ borderColor: '#dacc96' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-semibold" style={{ color: '#632626' }}>{event.title}</h5>
                  {event.subtitle && <p className="text-sm text-gray-500">{event.subtitle}</p>}
                </div>
                <button
                  onClick={() => deleteEvent.mutate(event.id)}
                  disabled={deleteEvent.isPending}
                  className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {event.images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {event.images.map(img => (
                    <div key={img.id.toString()} className="relative group">
                      <img
                        src={img.imageData}
                        alt={img.caption}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      {img.caption && (
                        <p className="text-xs text-center mt-0.5 text-gray-500 truncate">{img.caption}</p>
                      )}
                      <button
                        onClick={() => deleteImage.mutate(img.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">कोई फोटो नहीं</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---- Main AdminPanel ----
const TABS = [
  { id: 'donations', label: 'दान', icon: DollarSign },
  { id: 'memberships', label: 'सदस्यता', icon: Users },
  { id: 'assistance', label: 'सहायता', icon: Heart },
  { id: 'contact', label: 'संपर्क', icon: Phone },
  { id: 'villages', label: 'गाँव', icon: MapPin },
  { id: 'gallery', label: 'गैलरी', icon: Image },
  { id: 'settings', label: 'सेटिंग्स', icon: Settings },
];

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('donations');

  if (!isLoggedIn) {
    return <PasscodeGate onSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#fdf6e3' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 shadow-md" style={{ background: '#632626' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Noto Serif Devanagari, serif' }}>
              एडमिन पैनल
            </h1>
            <p className="text-xs" style={{ color: '#dacc96' }}>गौसिया अशरफिया फाउंडेशन</p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ background: '#dacc96', color: '#632626' }}
          >
            लॉगआउट
          </button>
        </div>
        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 pb-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2"
                  style={{
                    color: isActive ? '#dacc96' : 'rgba(255,255,255,0.7)',
                    borderBottomColor: isActive ? '#dacc96' : 'transparent',
                    background: 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'donations' && <DonationsTab />}
        {activeTab === 'memberships' && <MembershipsTab />}
        {activeTab === 'assistance' && <AssistanceTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'villages' && <VillagesTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: '#632626' }}>सेटिंग्स</h3>
            <ChangePasscodeSection />
          </div>
        )}
      </div>
    </div>
  );
}
