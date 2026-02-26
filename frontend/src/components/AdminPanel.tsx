import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetDonations,
  useGetMemberships,
  useGetAssistanceRequests,
  useGetContactInquiries,
  useGetDistricts,
  useAddDistrict,
  useAddVillage,
  useDeleteDistrict,
  useDeleteVillage,
  type Donation,
  type MembershipRequest,
  type AssistanceRequest,
  type ContactInquiry,
} from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import {
  Shield, Users, Heart, MessageSquare, MapPin, Plus, Trash2,
  Upload, Download, ChevronDown, ChevronUp,
  FileText, CheckCircle, AlertCircle, Lock,
  Building2, Home, RefreshCw, X, LogIn, LogOut, User
} from 'lucide-react';

const ADMIN_PASSCODE = 'admin123';

type TabType = 'donations' | 'memberships' | 'assistance' | 'contacts' | 'villages';

interface BulkImportResult {
  success: boolean;
  districtCount: number;
  villageCount: number;
  errors: string[];
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('donations');

  // Villages state
  const [newDistrictName, setNewDistrictName] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [newVillageName, setNewVillageName] = useState('');
  const [expandedDistricts, setExpandedDistricts] = useState<Set<number>>(new Set());
  const [bulkImportResult, setBulkImportResult] = useState<BulkImportResult | null>(null);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [csvText, setCsvText] = useState('');
  const [showCsvTextInput, setShowCsvTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  // Internet Identity for admin write operations (add only)
  const { login, clear, loginStatus, identity, isLoggingIn } = useInternetIdentity();
  const isIILoggedIn = !!identity;

  const { data: donations = [], isLoading: donationsLoading } = useGetDonations();
  const { data: memberships = [], isLoading: membershipsLoading } = useGetMemberships();
  const { data: assistanceRequests = [], isLoading: assistanceLoading } = useGetAssistanceRequests();
  const { data: contactInquiries = [], isLoading: contactsLoading } = useGetContactInquiries();
  const { data: districts = [], isLoading: districtsLoading } = useGetDistricts();

  const addDistrictMutation = useAddDistrict();
  const addVillageMutation = useAddVillage();
  const deleteDistrictMutation = useDeleteDistrict();
  const deleteVillageMutation = useDeleteVillage();

  const handleLogin = () => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('गलत पासकोड। कृपया पुनः प्रयास करें।');
    }
  };

  const handleIILogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('लॉगिन में समस्या हुई। पुनः प्रयास करें।');
      }
    }
  };

  const handleIILogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleAddDistrict = async () => {
    if (!newDistrictName.trim()) return;
    if (!isIILoggedIn) {
      toast.error('जिला जोड़ने के लिए पहले लॉगिन करें');
      return;
    }
    try {
      await addDistrictMutation.mutateAsync(newDistrictName.trim());
      setNewDistrictName('');
    } catch {
      // error handled in hook
    }
  };

  const handleAddVillage = async () => {
    if (!selectedDistrictId || !newVillageName.trim()) return;
    if (!isIILoggedIn) {
      toast.error('गाँव जोड़ने के लिए पहले लॉगिन करें');
      return;
    }
    try {
      await addVillageMutation.mutateAsync({
        districtId: BigInt(selectedDistrictId),
        villageName: newVillageName.trim(),
      });
      setNewVillageName('');
    } catch {
      // error handled in hook
    }
  };

  // Delete district — no II login required (backend is now public)
  const handleDeleteDistrict = async (districtId: bigint) => {
    if (!confirm('क्या आप इस जिले और इसके सभी गाँवों को हटाना चाहते हैं?')) return;
    try {
      await deleteDistrictMutation.mutateAsync(districtId);
    } catch {
      // error handled in hook
    }
  };

  // Delete village — no II login required (backend is now public)
  const handleDeleteVillage = async (villageId: bigint) => {
    if (!confirm('क्या आप इस गाँव को हटाना चाहते हैं?')) return;
    try {
      await deleteVillageMutation.mutateAsync(villageId);
    } catch {
      // error handled in hook
    }
  };

  const toggleDistrict = (id: number) => {
    setExpandedDistricts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Parse CSV rows into { district, village } pairs
  const parseRows = (rows: string[][]): { district: string; village: string }[] => {
    const result: { district: string; village: string }[] = [];
    for (const row of rows) {
      const district = (row[0] || '').trim();
      const village = (row[1] || '').trim();
      if (district && village) result.push({ district, village });
    }
    return result;
  };

  // Sequential bulk import: create district first, then add villages under confirmed ID
  const processBulkImport = async (rows: string[][]) => {
    if (!isIILoggedIn) {
      toast.error('बल्क आयात के लिए पहले लॉगिन करें');
      return;
    }

    setIsBulkImporting(true);
    setBulkProgress(0);
    setBulkImportResult(null);

    const pairs = parseRows(rows);
    if (pairs.length === 0) {
      setBulkImportResult({ success: false, districtCount: 0, villageCount: 0, errors: ['कोई वैध डेटा नहीं मिला'] });
      setIsBulkImporting(false);
      return;
    }

    // Group villages by district name (preserving order)
    const districtMap = new Map<string, string[]>();
    for (const { district, village } of pairs) {
      if (!districtMap.has(district)) districtMap.set(district, []);
      districtMap.get(district)!.push(village);
    }

    const errors: string[] = [];
    let districtCount = 0;
    let villageCount = 0;
    const totalDistricts = districtMap.size;
    let processedDistricts = 0;

    // Process each district SEQUENTIALLY — await district ID before adding villages
    for (const [districtName, villageNames] of districtMap.entries()) {
      let districtId: bigint | null = null;

      // Check if district already exists in current list
      const existingDistrict = districts.find(
        d => d.name.trim().toLowerCase() === districtName.toLowerCase()
      );

      if (existingDistrict) {
        districtId = existingDistrict.id;
      } else {
        // Create district and await the returned ID before proceeding
        try {
          const newId = await addDistrictMutation.mutateAsync(districtName);
          districtId = newId;
          districtCount++;
        } catch {
          errors.push(`जिला "${districtName}" जोड़ने में त्रुटि`);
          processedDistricts++;
          setBulkProgress(Math.round((processedDistricts / totalDistricts) * 100));
          continue; // skip villages for this district
        }
      }

      // Now add all villages for this district SEQUENTIALLY using confirmed districtId
      for (const villageName of villageNames) {
        try {
          const result = await addVillageMutation.mutateAsync({
            districtId: districtId,
            villageName: villageName,
          });
          if (result === BigInt(0)) {
            errors.push(`गाँव "${villageName}" — जिला नहीं मिला`);
          } else {
            villageCount++;
          }
        } catch {
          errors.push(`गाँव "${villageName}" — जिला "${districtName}" में जोड़ने में त्रुटि`);
        }
      }

      processedDistricts++;
      setBulkProgress(Math.round((processedDistricts / totalDistricts) * 100));
    }

    // Refresh districts list
    queryClient.invalidateQueries({ queryKey: ['districts'] });

    setBulkImportResult({
      success: errors.length === 0,
      districtCount,
      villageCount,
      errors,
    });
    setIsBulkImporting(false);
    setBulkProgress(100);

    if (errors.length === 0) {
      toast.success(`${districtCount} जिले और ${villageCount} गाँव जोड़े गए`);
    } else {
      toast.error(`${districtCount} जिले और ${villageCount} गाँव जोड़े गए, ${errors.length} त्रुटियाँ`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      const text = await file.text();
      const rows = text.split('\n').map(line =>
        line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim())
      );
      await processBulkImport(rows);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      try {
        // @ts-ignore
        if (!window.XLSX) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('SheetJS लोड नहीं हो सका'));
            document.head.appendChild(script);
          });
        }
        // @ts-ignore
        const XLSX = window.XLSX;
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        await processBulkImport(jsonData);
      } catch {
        toast.error('Excel फ़ाइल पढ़ने में त्रुटि');
      }
    } else {
      toast.error('केवल CSV या Excel (.xlsx/.xls) फ़ाइलें स्वीकार्य हैं');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCsvTextImport = async () => {
    if (!csvText.trim()) return;
    const rows = csvText.split('\n').map(line => line.split(',').map(cell => cell.trim()));
    await processBulkImport(rows);
    setCsvText('');
    setShowCsvTextInput(false);
  };

  const exportToCSV = () => {
    if (districts.length === 0) {
      toast.error('निर्यात के लिए पहले जिले जोड़ें');
      return;
    }
    const rows = ['जिला,गाँव'];
    for (const district of districts) {
      if (district.villages.length === 0) {
        rows.push(`${district.name},`);
      } else {
        for (const village of district.villages) {
          rows.push(`${district.name},${village.name}`);
        }
      }
    }
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'districts_villages.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV फ़ाइल डाउनलोड हो रही है');
  };

  // ---- Login Screen ----
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)' }}
      >
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
            {/* Header */}
            <div
              className="px-8 py-8 text-center"
              style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(218,204,150,0.2)', border: '2px solid #dacc96' }}
              >
                <Shield className="w-8 h-8" style={{ color: '#dacc96' }} />
              </div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: '#dacc96', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                एडमिन पैनल
              </h1>
              <p className="text-sm" style={{ color: '#e8d9a0' }}>
                गौसिया अशरफिया फाउंडेशन
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#632626' }}>
                <Lock className="inline w-4 h-4 mr-1" />
                पासकोड दर्ज करें
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-gray-900 text-base outline-none transition-all"
                style={{ border: '2px solid #e8d0a0', background: '#fffdf5' }}
                onFocus={e => { e.target.style.borderColor = '#632626'; }}
                onBlur={e => { e.target.style.borderColor = '#e8d0a0'; }}
              />
              {passcodeError && (
                <p className="mt-2 text-sm font-medium" style={{ color: '#c0392b' }}>
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  {passcodeError}
                </p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-lg font-bold text-base mt-4 transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
              >
                प्रवेश करें
              </button>

              <p className="text-center text-xs mt-4" style={{ color: '#999' }}>
                केवल अधिकृत व्यक्तियों के लिए
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Tab Content Renderers ----

  const renderDonations = () => (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
        <Heart className="inline w-5 h-5 mr-2" />
        दान रिकॉर्ड
      </h3>
      {donationsLoading ? (
        <div className="text-center py-8" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: '#fdf6e3', color: '#8b3a3a' }}>
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">अभी तक कोई दान नहीं</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d: Donation, i: number) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ color: '#632626' }}>{d.donorName}</p>
                  <p className="text-sm" style={{ color: '#8b3a3a' }}>{d.message}</p>
                </div>
                <span className="font-bold text-lg" style={{ color: '#dacc96' }}>₹{d.amount.toString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMemberships = () => (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
        <Users className="inline w-5 h-5 mr-2" />
        सदस्यता आवेदन
      </h3>
      {membershipsLoading ? (
        <div className="text-center py-8" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
      ) : memberships.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: '#fdf6e3', color: '#8b3a3a' }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">अभी तक कोई आवेदन नहीं</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.map((m: MembershipRequest, i: number) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
              <p className="font-semibold" style={{ color: '#632626' }}>{m.fullName}</p>
              <p className="text-sm" style={{ color: '#8b3a3a' }}>{m.mobileNumber} • {m.city}</p>
              <p className="text-xs mt-1" style={{ color: '#aaa' }}>आधार: {m.aadhaarNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAssistance = () => (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
        <Shield className="inline w-5 h-5 mr-2" />
        सहायता अनुरोध
      </h3>
      {assistanceLoading ? (
        <div className="text-center py-8" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
      ) : assistanceRequests.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: '#fdf6e3', color: '#8b3a3a' }}>
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">अभी तक कोई अनुरोध नहीं</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assistanceRequests.map((a: AssistanceRequest, i: number) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
              <p className="font-semibold" style={{ color: '#632626' }}>{a.fullName}</p>
              <p className="text-sm" style={{ color: '#8b3a3a' }}>{a.mobileNumber} • {a.city}</p>
              <p className="text-sm mt-1" style={{ color: '#555' }}>{a.assistanceType}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
        <MessageSquare className="inline w-5 h-5 mr-2" />
        संपर्क संदेश
      </h3>
      {contactsLoading ? (
        <div className="text-center py-8" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
      ) : contactInquiries.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: '#fdf6e3', color: '#8b3a3a' }}>
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">अभी तक कोई संदेश नहीं</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactInquiries.map((c: ContactInquiry, i: number) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
              <p className="font-semibold" style={{ color: '#632626' }}>{c.name}</p>
              <p className="text-sm" style={{ color: '#8b3a3a' }}>{c.email}</p>
              <p className="text-sm mt-1" style={{ color: '#555' }}>{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVillages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
          <MapPin className="inline w-5 h-5 mr-2" />
          जिले और गाँव
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#632626', color: '#dacc96' }}
          >
            {districts.length} जिले
          </span>
        </h3>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{ background: '#fdf6e3', color: '#632626', border: '1px solid #e8d0a0' }}
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      {/* Internet Identity Login Banner — only for add/bulk operations */}
      {!isIILoggedIn ? (
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-3"
          style={{ background: '#fdf6e3', border: '1px solid #e8d0a0' }}
        >
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 flex-shrink-0" style={{ color: '#8b3a3a' }} />
            <p className="text-sm" style={{ color: '#632626' }}>
              जिले और गाँव <strong>जोड़ने</strong> के लिए लॉगिन करें
            </p>
          </div>
          <button
            onClick={handleIILogin}
            disabled={isLoggingIn}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex-shrink-0"
            style={{ background: '#632626', color: '#dacc96' }}
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? 'लॉगिन...' : 'लॉगिन'}
          </button>
        </div>
      ) : (
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-3"
          style={{ background: '#f0fdf4', border: '1px solid #86efac' }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
            <p className="text-sm font-medium" style={{ color: '#15803d' }}>
              लॉगिन सफल — अब आप जिले और गाँव जोड़/हटा सकते हैं
            </p>
          </div>
          <button
            onClick={handleIILogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
          >
            <LogOut className="w-4 h-4" />
            लॉगआउट
          </button>
        </div>
      )}

      {/* Add District */}
      <div className="rounded-xl p-4 border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#632626' }}>
          <Building2 className="w-4 h-4" />
          नया जिला जोड़ें
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDistrictName}
            onChange={e => setNewDistrictName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddDistrict()}
            placeholder="जिले का नाम"
            disabled={!isIILoggedIn || addDistrictMutation.isPending}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50"
            style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5' }}
          />
          <button
            onClick={handleAddDistrict}
            disabled={!isIILoggedIn || !newDistrictName.trim() || addDistrictMutation.isPending}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-1"
            style={{ background: '#8b3a3a', color: '#dacc96' }}
          >
            {addDistrictMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            जोड़ें
          </button>
        </div>
      </div>

      {/* Add Village */}
      <div className="rounded-xl p-4 border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#632626' }}>
          <Home className="w-4 h-4" />
          नया गाँव जोड़ें
        </h4>
        <div className="space-y-2">
          <select
            value={selectedDistrictId}
            onChange={e => setSelectedDistrictId(e.target.value)}
            disabled={!isIILoggedIn || districts.length === 0}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50"
            style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', color: '#632626' }}
          >
            <option value="">जिला चुनें</option>
            {districts.map(d => (
              <option key={d.id.toString()} value={d.id.toString()}>{d.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVillageName}
              onChange={e => setNewVillageName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddVillage()}
              placeholder="गाँव का नाम"
              disabled={!isIILoggedIn || !selectedDistrictId || addVillageMutation.isPending}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50"
              style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5' }}
            />
            <button
              onClick={handleAddVillage}
              disabled={!isIILoggedIn || !selectedDistrictId || !newVillageName.trim() || addVillageMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-1"
              style={{ background: '#8b3a3a', color: '#dacc96' }}
            >
              {addVillageMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              जोड़ें
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Import */}
      <div className="rounded-xl p-4 border" style={{ background: '#fffdf5', borderColor: '#e8d0a0' }}>
        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#632626' }}>
          <Upload className="w-4 h-4" />
          बल्क आयात (CSV/Excel)
        </h4>
        <p className="text-xs mb-3" style={{ color: '#8b3a3a' }}>
          फ़ॉर्मेट: पहला कॉलम = जिला, दूसरा कॉलम = गाँव
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isIILoggedIn || isBulkImporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#632626', color: '#dacc96' }}
          >
            <Upload className="w-4 h-4" />
            फ़ाइल अपलोड
          </button>
          <button
            onClick={() => setShowCsvTextInput(!showCsvTextInput)}
            disabled={!isIILoggedIn || isBulkImporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#fdf6e3', color: '#632626', border: '1px solid #e8d0a0' }}
          >
            <FileText className="w-4 h-4" />
            टेक्स्ट दर्ज करें
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />

        {showCsvTextInput && (
          <div className="mt-3 space-y-2">
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={"जिला1,गाँव1\nजिला1,गाँव2\nजिला2,गाँव3"}
              rows={5}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', fontFamily: 'monospace' }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCsvTextImport}
                disabled={!csvText.trim() || isBulkImporting}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                आयात करें
              </button>
              <button
                onClick={() => { setShowCsvTextInput(false); setCsvText(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{ background: '#fdf6e3', color: '#8b3a3a', border: '1px solid #e8d0a0' }}
              >
                रद्द करें
              </button>
            </div>
          </div>
        )}

        {isBulkImporting && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: '#8b3a3a' }}>
              <span>आयात हो रहा है...</span>
              <span>{bulkProgress}%</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: '#e8d0a0' }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${bulkProgress}%`, background: '#632626' }}
              />
            </div>
          </div>
        )}

        {bulkImportResult && (
          <div
            className="mt-3 p-3 rounded-lg text-sm"
            style={{
              background: bulkImportResult.success ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${bulkImportResult.success ? '#86efac' : '#fca5a5'}`,
              color: bulkImportResult.success ? '#15803d' : '#dc2626',
            }}
          >
            <div className="flex items-center gap-1.5 font-semibold mb-1">
              {bulkImportResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {bulkImportResult.success ? 'आयात सफल!' : 'आयात में कुछ त्रुटियाँ'}
            </div>
            <p>{bulkImportResult.districtCount} जिले, {bulkImportResult.villageCount} गाँव जोड़े गए</p>
            {bulkImportResult.errors.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-xs">
                {bulkImportResult.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
                {bulkImportResult.errors.length > 5 && (
                  <li>...और {bulkImportResult.errors.length - 5} त्रुटियाँ</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Districts List */}
      <div className="space-y-3">
        {districtsLoading ? (
          <div className="text-center py-8" style={{ color: '#8b3a3a' }}>
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            जिले लोड हो रहे हैं...
          </div>
        ) : districts.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ background: '#fdf6e3', color: '#8b3a3a' }}>
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">अभी तक कोई जिला नहीं जोड़ा गया</p>
          </div>
        ) : (
          districts.map(district => {
            const districtIdNum = Number(district.id);
            const isExpanded = expandedDistricts.has(districtIdNum);
            return (
              <div
                key={district.id.toString()}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: '#e8d0a0' }}
              >
                {/* District Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: '#fdf6e3' }}
                  onClick={() => toggleDistrict(districtIdNum)}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" style={{ color: '#8b3a3a' }} />
                    <span className="font-semibold" style={{ color: '#632626' }}>{district.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: '#e8d0a0', color: '#632626' }}
                    >
                      {district.villages.length} गाँव
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteDistrict(district.id); }}
                      disabled={deleteDistrictMutation.isPending}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ background: '#fee2e2', color: '#dc2626' }}
                      title="जिला हटाएं"
                    >
                      {deleteDistrictMutation.isPending ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" style={{ color: '#8b3a3a' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: '#8b3a3a' }} />
                    )}
                  </div>
                </div>

                {/* Villages */}
                {isExpanded && (
                  <div className="px-4 py-3 border-t" style={{ borderColor: '#e8d0a0', background: '#fffdf5' }}>
                    {district.villages.length === 0 ? (
                      <p className="text-sm text-center py-2" style={{ color: '#aaa' }}>
                        इस जिले में कोई गाँव नहीं
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {district.villages.map(village => (
                          <div
                            key={village.id.toString()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                            style={{ background: '#fdf6e3', border: '1px solid #e8d0a0', color: '#632626' }}
                          >
                            <Home className="w-3 h-3" />
                            {village.name}
                            <button
                              onClick={() => handleDeleteVillage(village.id)}
                              disabled={deleteVillageMutation.isPending}
                              className="ml-1 rounded-full transition-all hover:opacity-70 disabled:opacity-40"
                              style={{ color: '#dc2626' }}
                              title="गाँव हटाएं"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // ---- Main Panel ----
  const tabs: { key: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'donations', label: 'दान', icon: <Heart className="w-4 h-4" />, count: donations.length },
    { key: 'memberships', label: 'सदस्यता', icon: <Users className="w-4 h-4" />, count: memberships.length },
    { key: 'assistance', label: 'सहायता', icon: <Shield className="w-4 h-4" />, count: assistanceRequests.length },
    { key: 'contacts', label: 'संपर्क', icon: <MessageSquare className="w-4 h-4" />, count: contactInquiries.length },
    { key: 'villages', label: 'गाँव', icon: <MapPin className="w-4 h-4" />, count: districts.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)' }}>
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(218,204,150,0.2)', border: '1.5px solid #dacc96' }}
          >
            <Shield className="w-5 h-5" style={{ color: '#dacc96' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#dacc96', fontFamily: 'Noto Serif Devanagari, serif' }}>
              एडमिन पैनल
            </h1>
            <p className="text-xs" style={{ color: '#e8d9a0' }}>गौसिया अशरफिया फाउंडेशन</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isIILoggedIn ? (
            <button
              onClick={handleIILogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(218,204,150,0.15)', color: '#dacc96', border: '1px solid rgba(218,204,150,0.3)' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              लॉगआउट
            </button>
          ) : (
            <button
              onClick={handleIILogin}
              disabled={isLoggingIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(218,204,150,0.15)', color: '#dacc96', border: '1px solid rgba(218,204,150,0.3)' }}
            >
              <LogIn className="w-3.5 h-3.5" />
              {isLoggingIn ? 'लॉगिन...' : 'लॉगिन'}
            </button>
          )}
          <button
            onClick={() => { setIsAuthenticated(false); setPasscode(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(218,204,150,0.15)', color: '#dacc96', border: '1px solid rgba(218,204,150,0.3)' }}
          >
            <X className="w-3.5 h-3.5" />
            बाहर
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto" style={{ background: '#fff8ee', borderBottom: '1px solid #e8d0a0' }}>
        <div className="flex min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap"
              style={{
                color: activeTab === tab.key ? '#632626' : '#8b3a3a',
                borderBottom: activeTab === tab.key ? '2px solid #632626' : '2px solid transparent',
                background: activeTab === tab.key ? '#fdf6e3' : 'transparent',
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: activeTab === tab.key ? '#632626' : '#e8d0a0',
                    color: activeTab === tab.key ? '#dacc96' : '#632626',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'donations' && renderDonations()}
        {activeTab === 'memberships' && renderMemberships()}
        {activeTab === 'assistance' && renderAssistance()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'villages' && renderVillages()}
      </div>
    </div>
  );
}
