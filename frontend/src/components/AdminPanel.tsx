import React, { useState } from 'react';
import { Shield, MapPin, Heart, Users, HelpCircle, Phone, Lock, LogOut, ArrowLeft, Plus, Trash2, Upload, Download, FileText, ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import {
  useGetDistricts, useAddDistrict, useAddVillage, useDeleteDistrict, useDeleteVillage,
  useGetDonations, useGetMemberships, useGetAssistanceRequests, useGetContactInquiries,
  type Donation, type MembershipRequest, type AssistanceRequest, type ContactInquiry,
} from '../hooks/useQueries';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const ADMIN_PASSCODE = '786786';
const PASSCODE_KEY = 'admin_passcode';

function getStoredPasscode(): string {
  return localStorage.getItem(PASSCODE_KEY) || ADMIN_PASSCODE;
}

// ---- Bulk Import Modal ----
interface BulkImportModalProps {
  onClose: () => void;
  onImport: (data: { districtName: string; villages: string[] }[]) => Promise<void>;
  isImporting: boolean;
}

function BulkImportModal({ onClose, onImport, isImporting }: BulkImportModalProps) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ districtName: string; villages: string[] }[]>([]);
  const [parseError, setParseError] = useState('');

  const exampleText = `जौनपुर: मछलीशहर, केराकत, शाहगंज, मड़ियाहूँ
प्रयागराज: फूलपुर, हंडिया, सोरांव
भदोही: ज्ञानपुर, औराई`;

  const parseText = (input: string) => {
    setParseError('');
    if (!input.trim()) {
      setPreview([]);
      return;
    }
    const lines = input.trim().split('\n').filter(l => l.trim());
    const parsed: { districtName: string; villages: string[] }[] = [];
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) {
        setParseError(`गलत फॉर्मेट: "${line.trim()}" — हर लाइन में "जिला: गाँव1, गाँव2" फॉर्मेट होना चाहिए`);
        setPreview([]);
        return;
      }
      const districtName = line.slice(0, colonIdx).trim();
      const villagesRaw = line.slice(colonIdx + 1).trim();
      const villages = villagesRaw
        ? villagesRaw.split(',').map(v => v.trim()).filter(v => v.length > 0)
        : [];
      if (districtName) {
        parsed.push({ districtName, villages });
      }
    }
    setPreview(parsed);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    parseText(e.target.value);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    await onImport(preview);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0.10 0.05 15 / 0.7)' }}>
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'oklch(0.99 0.003 60)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'oklch(0.24 0.09 15)' }}>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5" style={{ color: 'oklch(0.84 0.07 85)' }} />
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.84 0.07 85)' }}>बल्क डेटा आयात करें</h3>
          </div>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: 'oklch(0.84 0.07 85)', background: 'oklch(0.35 0.09 15)' }}>
            बंद करें
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Instructions */}
          <div className="rounded-xl p-4 text-sm space-y-1" style={{ background: 'oklch(0.95 0.01 45)', borderLeft: '4px solid oklch(0.64 0.08 45)' }}>
            <p className="font-semibold" style={{ color: 'oklch(0.30 0.09 15)' }}>फॉर्मेट:</p>
            <p style={{ color: 'oklch(0.45 0.06 30)' }}>हर लाइन में: <code className="px-1 rounded" style={{ background: 'oklch(0.90 0.02 45)' }}>जिला का नाम: गाँव1, गाँव2, गाँव3</code></p>
            <p style={{ color: 'oklch(0.45 0.06 30)' }}>अगर जिले में गाँव नहीं हैं तो: <code className="px-1 rounded" style={{ background: 'oklch(0.90 0.02 45)' }}>जिला का नाम:</code></p>
          </div>

          {/* Example */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium" style={{ color: 'oklch(0.40 0.06 30)' }}>उदाहरण:</label>
              <button
                onClick={() => { setText(exampleText); parseText(exampleText); }}
                className="text-xs px-2 py-1 rounded"
                style={{ background: 'oklch(0.24 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
              >
                उदाहरण भरें
              </button>
            </div>
            <pre className="text-xs p-3 rounded-lg" style={{ background: 'oklch(0.93 0.01 45)', color: 'oklch(0.35 0.07 30)', fontFamily: 'monospace' }}>
              {exampleText}
            </pre>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'oklch(0.30 0.09 15)' }}>
              यहाँ डेटा पेस्ट करें:
            </label>
            <textarea
              value={text}
              onChange={handleTextChange}
              rows={8}
              placeholder={`जौनपुर: मछलीशहर, केराकत, शाहगंज\nप्रयागराज: फूलपुर, हंडिया\nभदोही:`}
              className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
              style={{
                borderColor: 'oklch(0.80 0.04 45)',
                background: 'oklch(0.99 0.003 60)',
                color: 'oklch(0.20 0.06 15)',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Parse Error */}
          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: 'oklch(0.95 0.04 25)', color: 'oklch(0.40 0.12 25)' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'oklch(0.30 0.09 15)' }}>
                पूर्वावलोकन ({preview.length} जिले):
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {preview.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: 'oklch(0.96 0.008 60)', border: '1px solid oklch(0.86 0.03 45)' }}>
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.40 0.09 15)' }} />
                    <div>
                      <span className="font-semibold" style={{ color: 'oklch(0.24 0.09 15)' }}>{item.districtName}</span>
                      {item.villages.length > 0 && (
                        <span className="ml-2" style={{ color: 'oklch(0.55 0.05 30)' }}>
                          ({item.villages.length} गाँव: {item.villages.join(', ')})
                        </span>
                      )}
                      {item.villages.length === 0 && (
                        <span className="ml-2 italic" style={{ color: 'oklch(0.65 0.04 45)' }}>(कोई गाँव नहीं)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t" style={{ borderColor: 'oklch(0.86 0.03 45)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'oklch(0.93 0.01 45)', color: 'oklch(0.40 0.06 30)' }}
          >
            रद्द करें
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0 || isImporting || !!parseError}
            className="px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            style={{ background: 'oklch(0.24 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                आयात हो रहा है...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                आयात करें ({preview.length} जिले)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Villages Tab ----
interface VillagesTabProps {
  districts: ReturnType<typeof useGetDistricts>['data'];
  districtsLoading: boolean;
  newDistrictName: string;
  setNewDistrictName: (v: string) => void;
  selectedDistrictId: string;
  setSelectedDistrictId: (v: string) => void;
  newVillageName: string;
  setNewVillageName: (v: string) => void;
  expandedDistricts: Set<bigint>;
  setExpandedDistricts: React.Dispatch<React.SetStateAction<Set<bigint>>>;
  addDistrictMutation: ReturnType<typeof useAddDistrict>;
  addVillageMutation: ReturnType<typeof useAddVillage>;
  deleteDistrictMutation: ReturnType<typeof useDeleteDistrict>;
  deleteVillageMutation: ReturnType<typeof useDeleteVillage>;
}

function VillagesTab({
  districts,
  districtsLoading,
  newDistrictName,
  setNewDistrictName,
  selectedDistrictId,
  setSelectedDistrictId,
  newVillageName,
  setNewVillageName,
  expandedDistricts,
  setExpandedDistricts,
  addDistrictMutation,
  addVillageMutation,
  deleteDistrictMutation,
  deleteVillageMutation,
}: VillagesTabProps) {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName.trim()) return;
    await addDistrictMutation.mutateAsync(newDistrictName.trim());
    setNewDistrictName('');
  };

  const handleAddVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName.trim() || !selectedDistrictId) return;
    await addVillageMutation.mutateAsync({
      districtId: BigInt(selectedDistrictId),
      villageName: newVillageName.trim(),
    });
    setNewVillageName('');
  };

  const handleBulkImport = async (data: { districtName: string; villages: string[] }[]) => {
    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const item of data) {
      try {
        const districtId = await addDistrictMutation.mutateAsync(item.districtName);
        successCount++;
        for (const villageName of item.villages) {
          try {
            await addVillageMutation.mutateAsync({ districtId, villageName });
          } catch {
            errorCount++;
          }
        }
      } catch {
        errorCount++;
      }
    }

    setIsImporting(false);
    setShowBulkImport(false);
    queryClient.invalidateQueries({ queryKey: ['districts'] });

    if (errorCount === 0) {
      toast.success(`${successCount} जिले सफलतापूर्वक आयात किए गए!`);
    } else {
      toast.warning(`${successCount} जिले आयात हुए, ${errorCount} में समस्या आई।`);
    }
  };

  const toggleDistrict = (id: bigint) => {
    setExpandedDistricts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onImport={handleBulkImport}
          isImporting={isImporting}
        />
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl text-sm" style={{ background: 'oklch(0.96 0.015 60)', border: '1px solid oklch(0.80 0.06 60)' }}>
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.55 0.10 60)' }} />
        <div style={{ color: 'oklch(0.35 0.07 40)' }}>
          <p className="font-semibold mb-0.5">ध्यान दें:</p>
          <p>Draft और Live दो अलग-अलग सर्वर हैं। Draft में जोड़ा गया डेटा Live में नहीं आता। Live साइट पर जिले और गाँव दिखाने के लिए यहाँ से दोबारा जोड़ें।</p>
        </div>
      </div>

      {/* Add District */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: 'oklch(0.97 0.006 45)', border: '1px solid oklch(0.86 0.03 45)' }}>
        <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'oklch(0.24 0.09 15)' }}>
          <Plus className="w-4 h-4" />
          नया जिला जोड़ें
        </h3>
        <form onSubmit={handleAddDistrict} className="flex gap-2">
          <input
            type="text"
            value={newDistrictName}
            onChange={e => setNewDistrictName(e.target.value)}
            placeholder="जिले का नाम (जैसे: जौनपुर)"
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'oklch(0.80 0.04 45)', background: 'oklch(0.99 0.003 60)', color: 'oklch(0.20 0.06 15)' }}
          />
          <button
            type="submit"
            disabled={addDistrictMutation.isPending || !newDistrictName.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
            style={{ background: 'oklch(0.24 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
          >
            {addDistrictMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            जोड़ें
          </button>
        </form>
      </div>

      {/* Add Village */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: 'oklch(0.97 0.006 45)', border: '1px solid oklch(0.86 0.03 45)' }}>
        <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'oklch(0.24 0.09 15)' }}>
          <MapPin className="w-4 h-4" />
          गाँव जोड़ें
        </h3>
        <form onSubmit={handleAddVillage} className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedDistrictId}
            onChange={e => setSelectedDistrictId(e.target.value)}
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'oklch(0.80 0.04 45)', background: 'oklch(0.99 0.003 60)', color: 'oklch(0.20 0.06 15)' }}
          >
            <option value="">जिला चुनें</option>
            {(districts || []).map(d => (
              <option key={d.id.toString()} value={d.id.toString()}>{d.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newVillageName}
            onChange={e => setNewVillageName(e.target.value)}
            placeholder="गाँव का नाम"
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'oklch(0.80 0.04 45)', background: 'oklch(0.99 0.003 60)', color: 'oklch(0.20 0.06 15)' }}
          />
          <button
            type="submit"
            disabled={addVillageMutation.isPending || !newVillageName.trim() || !selectedDistrictId}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
            style={{ background: 'oklch(0.40 0.09 15)', color: 'oklch(0.90 0.04 60)' }}
          >
            {addVillageMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            जोड़ें
          </button>
        </form>
      </div>

      {/* Bulk Import Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowBulkImport(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'oklch(0.55 0.10 60)', color: 'oklch(0.99 0.003 60)' }}
        >
          <Upload className="w-4 h-4" />
          बल्क आयात करें (CSV)
        </button>
      </div>

      {/* Districts List */}
      <div>
        <h3 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: 'oklch(0.24 0.09 15)' }}>
          <FileText className="w-4 h-4" />
          जिलों की सूची
          {districts && districts.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'oklch(0.24 0.09 15 / 0.10)', color: 'oklch(0.40 0.08 15)' }}>
              {districts.length} जिले
            </span>
          )}
        </h3>

        {districtsLoading ? (
          <div className="flex items-center justify-center py-10">
            <RefreshCw className="w-6 h-6 animate-spin" style={{ color: 'oklch(0.40 0.09 15)' }} />
            <span className="ml-2 text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>लोड हो रहा है...</span>
          </div>
        ) : !districts || districts.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
            <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.74 0.06 45)' }} />
            <p className="text-sm font-medium" style={{ color: 'oklch(0.40 0.06 30)' }}>अभी तक कोई जिला नहीं जोड़ा गया।</p>
            <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.04 45)' }}>ऊपर दिए गए फॉर्म से जिला जोड़ें।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {districts.map(district => (
              <div key={district.id.toString()} className="rounded-xl border overflow-hidden" style={{ borderColor: 'oklch(0.86 0.03 45)' }}>
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: 'oklch(0.97 0.006 45)' }}
                  onClick={() => toggleDistrict(district.id)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: 'oklch(0.40 0.09 15)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'oklch(0.24 0.09 15)' }}>{district.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.24 0.09 15 / 0.10)', color: 'oklch(0.40 0.08 15)' }}>
                      {district.villages.length} गाँव
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); deleteDistrictMutation.mutate(district.id); }}
                      disabled={deleteDistrictMutation.isPending}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                      style={{ color: 'oklch(0.50 0.12 25)' }}
                      title="जिला हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedDistricts.has(district.id) ? <ChevronUp className="w-4 h-4" style={{ color: 'oklch(0.50 0.06 30)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'oklch(0.50 0.06 30)' }} />}
                  </div>
                </div>

                {expandedDistricts.has(district.id) && (
                  <div className="px-4 pb-4 pt-2 border-t" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                    {district.villages.length === 0 ? (
                      <p className="text-xs italic py-2" style={{ color: 'oklch(0.60 0.04 45)' }}>कोई गाँव नहीं जोड़ा गया</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {district.villages.map(village => (
                          <div
                            key={village.id.toString()}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                            style={{ background: 'oklch(0.97 0.008 60)', borderColor: 'oklch(0.84 0.07 85)', color: 'oklch(0.30 0.09 15)' }}
                          >
                            <span>{village.name}</span>
                            <button
                              onClick={() => deleteVillageMutation.mutate(village.id)}
                              disabled={deleteVillageMutation.isPending}
                              className="ml-1 rounded-full p-0.5 disabled:opacity-50"
                              style={{ color: 'oklch(0.50 0.12 25)' }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [activeTab, setActiveTab] = useState<'villages' | 'donations' | 'memberships' | 'assistance' | 'contact'>('villages');
  const [showChangePasscode, setShowChangePasscode] = useState(false);
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [changePasscodeError, setChangePasscodeError] = useState('');
  const [newDistrictName, setNewDistrictName] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [newVillageName, setNewVillageName] = useState('');
  const [expandedDistricts, setExpandedDistricts] = useState<Set<bigint>>(new Set());

  const { data: districts = [], isLoading: districtsLoading } = useGetDistricts();
  const addDistrictMutation = useAddDistrict();
  const addVillageMutation = useAddVillage();
  const deleteDistrictMutation = useDeleteDistrict();
  const deleteVillageMutation = useDeleteVillage();
  const { data: donations = [] } = useGetDonations();
  const { data: memberships = [] } = useGetMemberships();
  const { data: assistanceRequests = [] } = useGetAssistanceRequests();
  const { data: contactInquiries = [] } = useGetContactInquiries();

  const handleLogin = () => {
    if (passcode === getStoredPasscode()) {
      setIsAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('गलत पासकोड। कृपया पुनः प्रयास करें।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleChangePasscode = () => {
    if (oldPasscode !== getStoredPasscode()) {
      setChangePasscodeError('पुराना पासकोड गलत है।');
      return;
    }
    if (newPasscode.length < 4) {
      setChangePasscodeError('नया पासकोड कम से कम 4 अंकों का होना चाहिए।');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setChangePasscodeError('नया पासकोड और पुष्टि पासकोड मेल नहीं खाते।');
      return;
    }
    localStorage.setItem(PASSCODE_KEY, newPasscode);
    setShowChangePasscode(false);
    setOldPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
    setChangePasscodeError('');
    toast.success('पासकोड सफलतापूर्वक बदल दिया गया!');
  };

  // ---- Login Screen ----
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'oklch(0.97 0.006 45)' }}>
        <div className="w-full max-w-sm rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-8 text-center" style={{ background: 'oklch(0.24 0.09 15)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'oklch(0.64 0.08 45 / 0.20)' }}>
              <Shield className="w-8 h-8" style={{ color: 'oklch(0.84 0.07 85)' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'oklch(0.84 0.07 85)' }}>एडमिन पैनल</h2>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.70 0.04 45)' }}>पासकोड दर्ज करें</p>
          </div>
          <div className="px-8 py-8 space-y-4" style={{ background: 'oklch(0.99 0.003 60)' }}>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="पासकोड"
                className="w-full rounded-xl border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: passcodeError ? 'oklch(0.55 0.15 25)' : 'oklch(0.80 0.04 45)', background: 'oklch(0.99 0.003 60)', color: 'oklch(0.20 0.06 15)' }}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'oklch(0.60 0.04 45)' }}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passcodeError && (
              <p className="text-xs" style={{ color: 'oklch(0.55 0.15 25)' }}>{passcodeError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'oklch(0.24 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
            >
              लॉगिन करें
            </button>
            <button
              onClick={() => window.location.hash = ''}
              className="w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{ color: 'oklch(0.50 0.06 30)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              वापस जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Change Passcode Modal ----
  const changePasscodeModal = showChangePasscode && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0.10 0.05 15 / 0.6)' }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'oklch(0.99 0.003 60)' }}>
        <div className="px-6 py-4" style={{ background: 'oklch(0.24 0.09 15)' }}>
          <h3 className="font-bold text-lg" style={{ color: 'oklch(0.84 0.07 85)' }}>पासकोड बदलें</h3>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: 'पुराना पासकोड', value: oldPasscode, setter: setOldPasscode },
            { label: 'नया पासकोड', value: newPasscode, setter: setNewPasscode },
            { label: 'नया पासकोड पुष्टि करें', value: confirmPasscode, setter: setConfirmPasscode },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-xs font-medium mb-1" style={{ color: 'oklch(0.40 0.06 30)' }}>{label}</label>
              <input
                type="password"
                value={value}
                onChange={e => setter(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'oklch(0.80 0.04 45)', background: 'oklch(0.99 0.003 60)', color: 'oklch(0.20 0.06 15)' }}
              />
            </div>
          ))}
          {changePasscodeError && (
            <p className="text-xs" style={{ color: 'oklch(0.55 0.15 25)' }}>{changePasscodeError}</p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setShowChangePasscode(false); setChangePasscodeError(''); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'oklch(0.93 0.01 45)', color: 'oklch(0.40 0.06 30)' }}
            >
              रद्द करें
            </button>
            <button
              onClick={handleChangePasscode}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'oklch(0.24 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
            >
              बदलें
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'villages' as const, label: 'गाँव', icon: MapPin },
    { id: 'donations' as const, label: 'दान', icon: Heart },
    { id: 'memberships' as const, label: 'सदस्यता', icon: Users },
    { id: 'assistance' as const, label: 'सहायता', icon: HelpCircle },
    { id: 'contact' as const, label: 'संपर्क', icon: Phone },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.97 0.006 45)' }}>
      {changePasscodeModal}

      {/* Admin Header */}
      <div className="sticky top-0 z-40 shadow-md" style={{ background: 'oklch(0.24 0.09 15)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5" style={{ color: 'oklch(0.84 0.07 85)' }} />
            <span className="font-bold text-base" style={{ color: 'oklch(0.84 0.07 85)' }}>एडमिन पैनल</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePasscode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'oklch(0.35 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
            >
              <Lock className="w-3.5 h-3.5" />
              पासकोड
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'oklch(0.35 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              लॉगआउट
            </button>
            <button
              onClick={() => window.location.hash = ''}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'oklch(0.35 0.09 15)', color: 'oklch(0.84 0.07 85)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              वापस
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  background: isActive ? 'oklch(0.97 0.006 45)' : 'transparent',
                  color: isActive ? 'oklch(0.24 0.09 15)' : 'oklch(0.70 0.04 45)',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'villages' && (
          <VillagesTab
            districts={districts}
            districtsLoading={districtsLoading}
            newDistrictName={newDistrictName}
            setNewDistrictName={setNewDistrictName}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            newVillageName={newVillageName}
            setNewVillageName={setNewVillageName}
            expandedDistricts={expandedDistricts}
            setExpandedDistricts={setExpandedDistricts}
            addDistrictMutation={addDistrictMutation}
            addVillageMutation={addVillageMutation}
            deleteDistrictMutation={deleteDistrictMutation}
            deleteVillageMutation={deleteVillageMutation}
          />
        )}

        {activeTab === 'donations' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.24 0.09 15)' }}>दान रिकॉर्ड</h3>
            {donations.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.74 0.06 45)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>अभी तक कोई दान नहीं।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((d: Donation, i: number) => (
                  <div key={i} className="p-4 rounded-xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'oklch(0.24 0.09 15)' }}>{d.donorName}</p>
                    <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>₹{d.amount.toString()} — {d.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'memberships' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.24 0.09 15)' }}>सदस्यता आवेदन</h3>
            {memberships.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.74 0.06 45)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>अभी तक कोई सदस्यता आवेदन नहीं।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberships.map((m: MembershipRequest, i: number) => (
                  <div key={i} className="p-4 rounded-xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'oklch(0.24 0.09 15)' }}>{m.fullName}</p>
                    <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>{m.mobileNumber} — {m.city}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'assistance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.24 0.09 15)' }}>सहायता अनुरोध</h3>
            {assistanceRequests.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                <HelpCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.74 0.06 45)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>अभी तक कोई सहायता अनुरोध नहीं।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assistanceRequests.map((a: AssistanceRequest, i: number) => (
                  <div key={i} className="p-4 rounded-xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'oklch(0.24 0.09 15)' }}>{a.fullName}</p>
                    <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>{a.mobileNumber} — {a.city}</p>
                    <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.05 30)' }}>{a.assistanceType}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.24 0.09 15)' }}>संपर्क संदेश</h3>
            {contactInquiries.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                <Phone className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.74 0.06 45)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>अभी तक कोई संपर्क संदेश नहीं।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactInquiries.map((c: ContactInquiry, i: number) => (
                  <div key={i} className="p-4 rounded-xl border" style={{ background: 'oklch(0.99 0.003 60)', borderColor: 'oklch(0.86 0.03 45)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'oklch(0.24 0.09 15)' }}>{c.name}</p>
                    <p className="text-sm" style={{ color: 'oklch(0.50 0.06 30)' }}>{c.email}</p>
                    <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.05 30)' }}>{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
