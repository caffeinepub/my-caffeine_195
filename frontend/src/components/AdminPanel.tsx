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
  const [showChangePasscode, setShowChangePasscode] = useState(false);

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

  // Internet Identity for admin write operations
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

  const handleDeleteDistrict = async (districtId: bigint) => {
    if (!isIILoggedIn) {
      toast.error('जिला हटाने के लिए पहले लॉगिन करें');
      return;
    }
    if (!confirm('क्या आप इस जिले और इसके सभी गाँवों को हटाना चाहते हैं?')) return;
    try {
      await deleteDistrictMutation.mutateAsync(districtId);
    } catch {
      // error handled in hook
    }
  };

  const handleDeleteVillage = async (villageId: bigint) => {
    if (!isIILoggedIn) {
      toast.error('गाँव हटाने के लिए पहले लॉगिन करें');
      return;
    }
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

  // ---- Tab definitions ----
  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'donations', label: 'दान', icon: <Heart className="w-4 h-4" />, count: donations.length },
    { id: 'memberships', label: 'सदस्यता', icon: <Users className="w-4 h-4" />, count: memberships.length },
    { id: 'assistance', label: 'सहायता', icon: <Shield className="w-4 h-4" />, count: assistanceRequests.length },
    { id: 'contacts', label: 'संपर्क', icon: <MessageSquare className="w-4 h-4" />, count: contactInquiries.length },
    { id: 'villages', label: 'गाँव', icon: <MapPin className="w-4 h-4" />, count: districts.length },
  ];

  // ---- Main Admin Panel ----
  return (
    <div className="min-h-screen" style={{ background: '#fdf6e3' }}>
      {/* Top Header */}
      <div
        className="px-4 py-4 shadow-md"
        style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(218,204,150,0.2)', border: '1px solid #dacc96' }}
            >
              <Shield className="w-5 h-5" style={{ color: '#dacc96' }} />
            </div>
            <div>
              <h1
                className="text-lg font-bold"
                style={{ color: '#dacc96', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                एडमिन पैनल
              </h1>
              <p className="text-xs" style={{ color: '#e8d9a0' }}>गौसिया अशरफिया फाउंडेशन</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* II Login status indicator */}
            {isIILoggedIn ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(100,200,100,0.2)', border: '1px solid rgba(100,200,100,0.4)' }}>
                <User className="w-3 h-3" style={{ color: '#90ee90' }} />
                <span className="text-xs" style={{ color: '#90ee90' }}>लॉगिन</span>
              </div>
            ) : null}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              लॉगआउट
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ background: '#7a2e2e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 flex-shrink-0"
                style={{
                  borderBottomColor: activeTab === tab.id ? '#dacc96' : 'transparent',
                  color: activeTab === tab.id ? '#dacc96' : '#e8c8a0',
                  background: activeTab === tab.id ? 'rgba(218,204,150,0.1)' : 'transparent',
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: activeTab === tab.id ? '#dacc96' : 'rgba(218,204,150,0.3)',
                      color: activeTab === tab.id ? '#632626' : '#e8c8a0',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ---- DONATIONS TAB ---- */}
        {activeTab === 'donations' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5" style={{ color: '#632626' }} />
              <h2
                className="text-xl font-bold"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                दान अनुरोध
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                {donations.length}
              </span>
            </div>
            {donationsLoading ? (
              <div className="text-center py-12" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
            ) : donations.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl"
                style={{ background: '#fff8ee', border: '1px dashed #d4a96a', color: '#8b3a3a' }}
              >
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">अभी तक कोई दान नहीं</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(donations as Donation[]).map((d, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #e8d0a0' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold" style={{ color: '#632626' }}>{d.donorName}</p>
                        <p className="text-sm" style={{ color: '#8b3a3a' }}>₹{d.amount.toString()}</p>
                      </div>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {new Date(Number(d.timestamp) / 1_000_000).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                    {d.message && (
                      <p className="mt-2 text-sm" style={{ color: '#555' }}>{d.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- MEMBERSHIPS TAB ---- */}
        {activeTab === 'memberships' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5" style={{ color: '#632626' }} />
              <h2
                className="text-xl font-bold"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                सदस्यता अनुरोध
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                {memberships.length}
              </span>
            </div>
            {membershipsLoading ? (
              <div className="text-center py-12" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
            ) : memberships.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl"
                style={{ background: '#fff8ee', border: '1px dashed #d4a96a', color: '#8b3a3a' }}
              >
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">अभी तक कोई सदस्यता अनुरोध नहीं</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(memberships as MembershipRequest[]).map((m, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #e8d0a0' }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-bold" style={{ color: '#632626' }}>{m.fullName}</p>
                        <p className="text-sm" style={{ color: '#555' }}>{m.mobileNumber} • {m.city}</p>
                        <p className="text-xs mt-1" style={{ color: '#888' }}>आधार: {m.aadhaarNumber}</p>
                      </div>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {new Date(Number(m.registrationTimestamp) / 1_000_000).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- ASSISTANCE TAB ---- */}
        {activeTab === 'assistance' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5" style={{ color: '#632626' }} />
              <h2
                className="text-xl font-bold"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                सहायता अनुरोध
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                {assistanceRequests.length}
              </span>
            </div>
            {assistanceLoading ? (
              <div className="text-center py-12" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
            ) : assistanceRequests.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl"
                style={{ background: '#fff8ee', border: '1px dashed #d4a96a', color: '#8b3a3a' }}
              >
                <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">अभी तक कोई सहायता अनुरोध नहीं</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(assistanceRequests as AssistanceRequest[]).map((a, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #e8d0a0' }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-bold" style={{ color: '#632626' }}>{a.fullName}</p>
                        <p className="text-sm" style={{ color: '#555' }}>{a.mobileNumber} • {a.city}</p>
                        <p className="text-sm mt-1" style={{ color: '#444' }}>{a.assistanceType}</p>
                      </div>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {new Date(Number(a.submissionTimestamp) / 1_000_000).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- CONTACTS TAB ---- */}
        {activeTab === 'contacts' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5" style={{ color: '#632626' }} />
              <h2
                className="text-xl font-bold"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                संपर्क संदेश
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                {contactInquiries.length}
              </span>
            </div>
            {contactsLoading ? (
              <div className="text-center py-12" style={{ color: '#8b3a3a' }}>लोड हो रहा है...</div>
            ) : contactInquiries.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl"
                style={{ background: '#fff8ee', border: '1px dashed #d4a96a', color: '#8b3a3a' }}
              >
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">अभी तक कोई संदेश नहीं</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(contactInquiries as ContactInquiry[]).map((c, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #e8d0a0' }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-bold" style={{ color: '#632626' }}>{c.name}</p>
                        <p className="text-sm" style={{ color: '#555' }}>{c.email}</p>
                        <p className="text-sm mt-1" style={{ color: '#444' }}>{c.message}</p>
                      </div>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {new Date(Number(c.timestamp) / 1_000_000).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- VILLAGES TAB ---- */}
        {activeTab === 'villages' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" style={{ color: '#632626' }} />
              <h2
                className="text-xl font-bold"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                जिले और गाँव
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#632626', color: '#dacc96' }}
              >
                {districts.length} जिले
              </span>
            </div>

            {/* ---- Internet Identity Login Banner for Villages ---- */}
            {!isIILoggedIn ? (
              <div
                className="mb-6 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{ background: '#fff8ee', border: '2px solid #d4a96a' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <LogIn className="w-5 h-5" style={{ color: '#632626' }} />
                    <p className="font-bold text-base" style={{ color: '#632626' }}>
                      जिला/गाँव जोड़ने के लिए लॉगिन करें
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: '#8b3a3a' }}>
                    जिले और गाँव जोड़ने, हटाने या आयात करने के लिए Internet Identity से लॉगिन आवश्यक है।
                    गाँवों की सूची देखने के लिए लॉगिन की जरूरत नहीं है।
                  </p>
                </div>
                <button
                  onClick={handleIILogin}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      लॉगिन हो रहा है...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Internet Identity से लॉगिन करें
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                className="mb-6 p-3 rounded-xl flex items-center justify-between"
                style={{ background: 'rgba(100,200,100,0.1)', border: '1px solid rgba(100,200,100,0.4)' }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#2e7d32' }} />
                  <span className="text-sm font-medium" style={{ color: '#2e7d32' }}>
                    लॉगिन सफल — अब आप जिले और गाँव जोड़/हटा सकते हैं
                  </span>
                </div>
                <button
                  onClick={handleIILogout}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: 'rgba(100,200,100,0.2)', color: '#2e7d32', border: '1px solid rgba(100,200,100,0.4)' }}
                >
                  <LogOut className="w-3 h-3" />
                  लॉगआउट
                </button>
              </div>
            )}

            {/* Add District */}
            <div
              className="mb-4 p-4 rounded-xl"
              style={{ background: '#fff', border: '1px solid #e8d0a0' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4" style={{ color: '#632626' }} />
                <h3 className="font-bold text-base" style={{ color: '#632626' }}>नया जिला जोड़ें</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDistrictName}
                  onChange={e => setNewDistrictName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddDistrict()}
                  placeholder="जिले का नाम"
                  disabled={!isIILoggedIn || addDistrictMutation.isPending}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', color: '#333' }}
                  onFocus={e => { e.target.style.borderColor = '#632626'; }}
                  onBlur={e => { e.target.style.borderColor = '#e8d0a0'; }}
                />
                <button
                  onClick={handleAddDistrict}
                  disabled={!isIILoggedIn || !newDistrictName.trim() || addDistrictMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
                >
                  {addDistrictMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  जोड़ें
                </button>
              </div>
              {!isIILoggedIn && (
                <p className="mt-2 text-xs" style={{ color: '#c0392b' }}>
                  ⚠ जिला जोड़ने के लिए ऊपर लॉगिन करें
                </p>
              )}
            </div>

            {/* Add Village */}
            <div
              className="mb-4 p-4 rounded-xl"
              style={{ background: '#fff', border: '1px solid #e8d0a0' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-4 h-4" style={{ color: '#632626' }} />
                <h3 className="font-bold text-base" style={{ color: '#632626' }}>नया गाँव जोड़ें</h3>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  value={selectedDistrictId}
                  onChange={e => setSelectedDistrictId(e.target.value)}
                  disabled={!isIILoggedIn || addVillageMutation.isPending}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', color: '#333' }}
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
                    disabled={!isIILoggedIn || addVillageMutation.isPending}
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', color: '#333' }}
                    onFocus={e => { e.target.style.borderColor = '#632626'; }}
                    onBlur={e => { e.target.style.borderColor = '#e8d0a0'; }}
                  />
                  <button
                    onClick={handleAddVillage}
                    disabled={!isIILoggedIn || !selectedDistrictId || !newVillageName.trim() || addVillageMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
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
              {!isIILoggedIn && (
                <p className="mt-2 text-xs" style={{ color: '#c0392b' }}>
                  ⚠ गाँव जोड़ने के लिए ऊपर लॉगिन करें
                </p>
              )}
            </div>

            {/* Bulk Import */}
            <div
              className="mb-4 p-4 rounded-xl"
              style={{ background: '#fff', border: '1px solid #e8d0a0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4" style={{ color: '#632626' }} />
                <h3 className="font-bold text-base" style={{ color: '#632626' }}>बल्क आयात करें</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: '#888' }}>
                Excel (.xlsx/.xls) या CSV फ़ाइल अपलोड करें — Column A: जिला नाम, Column B: गाँव नाम
              </p>

              {!isIILoggedIn && (
                <div
                  className="mb-3 p-2 rounded-lg text-xs font-medium"
                  style={{ background: '#fff0f0', border: '1px solid #f5c6c6', color: '#c0392b' }}
                >
                  ⚠ बल्क आयात के लिए ऊपर Internet Identity से लॉगिन करें
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isIILoggedIn || isBulkImporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
                >
                  <Upload className="w-4 h-4" />
                  फ़ाइल चुनें
                </button>
                <button
                  onClick={() => setShowCsvTextInput(!showCsvTextInput)}
                  disabled={!isIILoggedIn || isBulkImporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#fff8ee', color: '#632626', border: '1.5px solid #d4a96a' }}
                >
                  <FileText className="w-4 h-4" />
                  टेक्स्ट से आयात
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: '#fff8ee', color: '#632626', border: '1.5px solid #d4a96a' }}
                >
                  <Download className="w-4 h-4" />
                  CSV निर्यात
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
                <div className="mt-3">
                  <textarea
                    value={csvText}
                    onChange={e => setCsvText(e.target.value)}
                    placeholder="जिला,गाँव (प्रत्येक पंक्ति में)&#10;उदाहरण:&#10;जौनपुर,मछलीशहर&#10;जौनपुर,सुजानगंज&#10;वाराणसी,सारनाथ"
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{ border: '1.5px solid #e8d0a0', background: '#fffdf5', color: '#333' }}
                    onFocus={e => { e.target.style.borderColor = '#632626'; }}
                    onBlur={e => { e.target.style.borderColor = '#e8d0a0'; }}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleCsvTextImport}
                      disabled={!csvText.trim() || isBulkImporting}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #632626 0%, #8b3a3a 100%)', color: '#dacc96' }}
                    >
                      {isBulkImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      आयात करें
                    </button>
                    <button
                      onClick={() => { setShowCsvTextInput(false); setCsvText(''); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-80"
                      style={{ background: '#f5e6c8', color: '#632626', border: '1px solid #d4a96a' }}
                    >
                      <X className="w-4 h-4" />
                      रद्द करें
                    </button>
                  </div>
                </div>
              )}

              {isBulkImporting && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: '#632626' }}>
                    <span>आयात हो रहा है...</span>
                    <span>{bulkProgress}%</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: '#e8d0a0' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${bulkProgress}%`, background: 'linear-gradient(90deg, #632626, #8b3a3a)' }}
                    />
                  </div>
                </div>
              )}

              {bulkImportResult && (
                <div
                  className="mt-3 p-3 rounded-lg"
                  style={{
                    background: bulkImportResult.success ? 'rgba(100,200,100,0.1)' : '#fff0f0',
                    border: `1px solid ${bulkImportResult.success ? 'rgba(100,200,100,0.4)' : '#f5c6c6'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {bulkImportResult.success ? (
                      <CheckCircle className="w-4 h-4" style={{ color: '#2e7d32' }} />
                    ) : (
                      <AlertCircle className="w-4 h-4" style={{ color: '#c0392b' }} />
                    )}
                    <span className="font-bold text-sm" style={{ color: bulkImportResult.success ? '#2e7d32' : '#c0392b' }}>
                      {bulkImportResult.districtCount} जिले, {bulkImportResult.villageCount} गाँव जोड़े गए
                    </span>
                  </div>
                  {bulkImportResult.errors.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {bulkImportResult.errors.slice(0, 5).map((err, i) => (
                        <li key={i} className="text-xs" style={{ color: '#c0392b' }}>• {err}</li>
                      ))}
                      {bulkImportResult.errors.length > 5 && (
                        <li className="text-xs" style={{ color: '#c0392b' }}>
                          ...और {bulkImportResult.errors.length - 5} त्रुटियाँ
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Districts List */}
            <div
              className="p-4 rounded-xl"
              style={{ background: '#fff', border: '1px solid #e8d0a0' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base" style={{ color: '#632626' }}>
                  जिलों की सूची ({districts.length})
                </h3>
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['districts'] })}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all hover:opacity-80"
                  style={{ background: '#fff8ee', color: '#632626', border: '1px solid #d4a96a' }}
                >
                  <RefreshCw className="w-3 h-3" />
                  रिफ्रेश
                </button>
              </div>

              {districtsLoading ? (
                <div className="text-center py-8" style={{ color: '#8b3a3a' }}>
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  लोड हो रहा है...
                </div>
              ) : districts.length === 0 ? (
                <div
                  className="text-center py-8 rounded-lg"
                  style={{ background: '#fff8ee', border: '1px dashed #d4a96a', color: '#8b3a3a' }}
                >
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">अभी तक कोई जिला नहीं जोड़ा गया</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {districts.map(district => (
                    <div
                      key={district.id.toString()}
                      className="rounded-lg overflow-hidden"
                      style={{ border: '1px solid #e8d0a0' }}
                    >
                      {/* District Header */}
                      <div
                        className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
                        style={{ background: expandedDistricts.has(Number(district.id)) ? '#fff8ee' : '#fffdf5' }}
                        onClick={() => toggleDistrict(Number(district.id))}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" style={{ color: '#632626' }} />
                          <span className="font-bold text-sm" style={{ color: '#632626' }}>{district.name}</span>
                          <span
                            className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: '#632626', color: '#dacc96' }}
                          >
                            {district.villages.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isIILoggedIn && (
                            <button
                              onClick={e => { e.stopPropagation(); handleDeleteDistrict(district.id); }}
                              disabled={deleteDistrictMutation.isPending}
                              className="p-1 rounded transition-all hover:opacity-80 disabled:opacity-50"
                              style={{ color: '#c0392b' }}
                              title="जिला हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {expandedDistricts.has(Number(district.id)) ? (
                            <ChevronUp className="w-4 h-4" style={{ color: '#8b3a3a' }} />
                          ) : (
                            <ChevronDown className="w-4 h-4" style={{ color: '#8b3a3a' }} />
                          )}
                        </div>
                      </div>

                      {/* Villages */}
                      {expandedDistricts.has(Number(district.id)) && (
                        <div className="px-3 py-2" style={{ background: '#fffdf5', borderTop: '1px solid #e8d0a0' }}>
                          {district.villages.length === 0 ? (
                            <p className="text-xs py-1" style={{ color: '#aaa' }}>कोई गाँव नहीं</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {district.villages.map(village => (
                                <div
                                  key={village.id.toString()}
                                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ background: '#fff8ee', border: '1px solid #d4a96a', color: '#632626' }}
                                >
                                  <Home className="w-3 h-3" />
                                  {village.name}
                                  {isIILoggedIn && (
                                    <button
                                      onClick={() => handleDeleteVillage(village.id)}
                                      disabled={deleteVillageMutation.isPending}
                                      className="ml-0.5 hover:opacity-70 disabled:opacity-50"
                                      style={{ color: '#c0392b' }}
                                      title="गाँव हटाएं"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
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
        )}
      </div>
    </div>
  );
}
