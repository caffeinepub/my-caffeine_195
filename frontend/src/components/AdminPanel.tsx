import React, { useState } from 'react';
import { ArrowLeft, Shield, MapPin, Plus, Trash2, ChevronDown, ChevronUp, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetDistricts,
  useAddDistrict,
  useAddVillage,
  useDeleteDistrict,
  useDeleteVillage,
} from '../hooks/useQueries';

const ADMIN_PASSCODE = 'admin1234';

// ---- Login Section for Admin ----
function AdminLoginSection() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-sm text-green-700 flex-1">
          लॉगिन हैं: <span className="font-mono text-xs">{identity?.getPrincipal().toString().slice(0, 20)}...</span>
        </span>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs">
          लॉगआउट
        </Button>
      </div>
    );
  }

  return (
    <Alert className="mb-4 border-amber-300 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between gap-3">
        <span className="text-amber-800 text-sm">
          जिला/गाँव जोड़ने या हटाने के लिए एडमिन लॉगिन आवश्यक है।
        </span>
        <Button
          size="sm"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              लॉगिन...
            </>
          ) : (
            <>
              <LogIn className="w-3 h-3 mr-1" />
              लॉगिन करें
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// ---- Villages Tab ----
function VillagesTab() {
  const [districtName, setDistrictName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());

  const { data: districts = [], isLoading: districtsLoading } = useGetDistricts();
  const addDistrict = useAddDistrict();
  const addVillage = useAddVillage();
  const deleteDistrict = useDeleteDistrict();
  const deleteVillage = useDeleteVillage();

  const toggleDistrict = (id: string) => {
    setExpandedDistricts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = districtName.trim();
    if (!name) return;
    try {
      await addDistrict.mutateAsync(name);
      setDistrictName('');
    } catch {
      // Error handled in mutation onError with toast
    }
  };

  const handleAddVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = villageName.trim();
    if (!name || !selectedDistrictId) return;
    try {
      await addVillage.mutateAsync({
        districtId: BigInt(selectedDistrictId),
        villageName: name,
      });
      setVillageName('');
      setSelectedDistrictId('');
    } catch {
      // Error handled in mutation onError with toast
    }
  };

  const handleDeleteDistrict = async (id: bigint) => {
    if (!window.confirm('क्या आप इस जिले और उसके सभी गाँवों को हटाना चाहते हैं?')) return;
    try {
      await deleteDistrict.mutateAsync(id);
    } catch {
      // Error handled in mutation onError with toast
    }
  };

  const handleDeleteVillage = async (id: bigint) => {
    if (!window.confirm('क्या आप इस गाँव को हटाना चाहते हैं?')) return;
    try {
      await deleteVillage.mutateAsync(id);
    } catch {
      // Error handled in mutation onError with toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Login Notice */}
      <AdminLoginSection />

      {/* Add District Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            नया जिला जोड़ें
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDistrict} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="districtName" className="sr-only">जिले का नाम</Label>
              <Input
                id="districtName"
                placeholder="जिले का नाम लिखें..."
                value={districtName}
                onChange={e => setDistrictName(e.target.value)}
                disabled={addDistrict.isPending}
                className="border-border"
              />
            </div>
            <Button
              type="submit"
              disabled={addDistrict.isPending || !districtName.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {addDistrict.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="ml-1">जोड़ें</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add Village Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            नया गाँव जोड़ें
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddVillage} className="space-y-3">
            <div>
              <Label htmlFor="selectDistrict">जिला चुनें</Label>
              <Select
                value={selectedDistrictId}
                onValueChange={setSelectedDistrictId}
                disabled={addVillage.isPending}
              >
                <SelectTrigger id="selectDistrict" className="mt-1">
                  <SelectValue placeholder="जिला चुनें..." />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(d => (
                    <SelectItem key={d.id.toString()} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="villageName" className="sr-only">गाँव का नाम</Label>
                <Input
                  id="villageName"
                  placeholder="गाँव का नाम लिखें..."
                  value={villageName}
                  onChange={e => setVillageName(e.target.value)}
                  disabled={addVillage.isPending}
                  className="border-border"
                />
              </div>
              <Button
                type="submit"
                disabled={addVillage.isPending || !villageName.trim() || !selectedDistrictId}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {addVillage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="ml-1">जोड़ें</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Districts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-primary">
            जिले और गाँव ({districts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {districtsLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>लोड हो रहा है...</span>
            </div>
          ) : districts.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              अभी कोई जिला नहीं जोड़ा गया है।
            </p>
          ) : (
            <div className="space-y-2">
              {districts.map(district => {
                const idStr = district.id.toString();
                const isExpanded = expandedDistricts.has(idStr);
                return (
                  <div key={idStr} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <button
                        className="flex items-center gap-2 flex-1 text-left"
                        onClick={() => toggleDistrict(idStr)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium text-foreground">{district.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({district.villages.length} गाँव)
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDistrict(district.id)}
                        disabled={deleteDistrict.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                      >
                        {deleteDistrict.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="p-3 border-t border-border bg-background">
                        {district.villages.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            इस जिले में कोई गाँव नहीं है।
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {district.villages.map(village => (
                              <div
                                key={village.id.toString()}
                                className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                              >
                                <span>{village.name}</span>
                                <button
                                  onClick={() => handleDeleteVillage(village.id)}
                                  disabled={deleteVillage.isPending}
                                  className="ml-1 text-primary/60 hover:text-destructive transition-colors"
                                >
                                  {deleteVillage.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Passcode Gate ----
function PasscodeGate({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      onSuccess();
    } else {
      setError('गलत पासकोड। कृपया पुनः प्रयास करें।');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-xl text-primary">एडमिन पैनल</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">पासकोड दर्ज करें</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="passcode">पासकोड</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="पासकोड दर्ज करें..."
                className="mt-1"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              प्रवेश करें
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Placeholder Tab Content ----
function PlaceholderTab({ title }: { title: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground text-sm">{title} — डेटा उपलब्ध नहीं है।</p>
      </CardContent>
    </Card>
  );
}

// ---- Main AdminPanel ----
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleBack = () => {
    window.location.hash = '';
  };

  if (!isAuthenticated) {
    return <PasscodeGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h1 className="text-lg font-bold">एडमिन पैनल</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="villages">
          <TabsList className="w-full flex-wrap h-auto gap-1 mb-6 bg-muted p-1 rounded-lg">
            <TabsTrigger value="villages" className="flex-1 text-xs sm:text-sm">
              गाँव प्रबंधन
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex-1 text-xs sm:text-sm">
              दान
            </TabsTrigger>
            <TabsTrigger value="memberships" className="flex-1 text-xs sm:text-sm">
              सदस्यता
            </TabsTrigger>
            <TabsTrigger value="assistance" className="flex-1 text-xs sm:text-sm">
              सहायता
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1 text-xs sm:text-sm">
              संपर्क
            </TabsTrigger>
          </TabsList>

          <TabsContent value="villages">
            <VillagesTab />
          </TabsContent>

          <TabsContent value="donations">
            <PlaceholderTab title="दान सूची" />
          </TabsContent>

          <TabsContent value="memberships">
            <PlaceholderTab title="सदस्यता अनुरोध" />
          </TabsContent>

          <TabsContent value="assistance">
            <PlaceholderTab title="सहायता अनुरोध" />
          </TabsContent>

          <TabsContent value="contact">
            <PlaceholderTab title="संपर्क संदेश" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
