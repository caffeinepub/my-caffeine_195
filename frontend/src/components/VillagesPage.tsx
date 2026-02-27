import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, MapPin, ArrowLeft, X, Check } from "lucide-react";
import {
  useGetVillagesByDistrict,
  useAddVillage,
  useEditVillage,
  useDeleteVillage,
} from "@/hooks/useQueries";
import type { Village } from "../backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VillageFormProps {
  initialValue?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

function VillageForm({ initialValue = "", onSubmit, onCancel, isLoading, submitLabel }: VillageFormProps) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="गाँव का नाम दर्ज करें..."
        className="flex-1 text-sm"
        style={{
          borderColor: "oklch(0.64 0.08 45)",
          fontFamily: "Noto Sans Devanagari, sans-serif",
        }}
        autoFocus
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
        style={{ background: "oklch(0.30 0.10 15)", color: "oklch(0.84 0.07 85)" }}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="p-2 rounded-lg transition-all hover:opacity-70"
        style={{ color: "oklch(0.50 0.06 30)" }}
      >
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}

interface VillageCardProps {
  village: Village;
  districtId: bigint;
}

function VillageCard({ village, districtId }: VillageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editVillage = useEditVillage();
  const deleteVillage = useDeleteVillage();

  const handleEdit = (name: string) => {
    editVillage.mutate(
      { id: village.id, name, districtId },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{
        background: "oklch(0.99 0.003 60)",
        borderColor: "oklch(0.86 0.03 45)",
        boxShadow: "0 2px 8px oklch(0.24 0.09 15 / 0.06)",
      }}
    >
      {isEditing ? (
        <div className="px-4 py-3">
          <VillageForm
            initialValue={village.name}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            isLoading={editVillage.isPending}
            submitLabel="अपडेट करें"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Village Icon */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.64 0.08 45 / 0.15)" }}
          >
            <MapPin className="w-4 h-4" style={{ color: "oklch(0.50 0.08 45)" }} />
          </div>

          {/* Name */}
          <p
            className="flex-1 font-medium text-base truncate"
            style={{ color: "oklch(0.24 0.09 15)", fontFamily: "Noto Sans Devanagari, sans-serif" }}
          >
            {village.name}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Edit */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg transition-all hover:opacity-70"
              style={{ color: "oklch(0.50 0.08 45)" }}
              title="संपादित करें"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 rounded-lg transition-all hover:opacity-70"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle style={{ fontFamily: "Noto Serif Devanagari, serif" }}>
                    गाँव हटाएं?
                  </AlertDialogTitle>
                  <AlertDialogDescription style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                    क्या आप <strong>"{village.name}"</strong> गाँव को हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                    रद्द करें
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteVillage.mutate({ id: village.id, districtId })}
                    style={{
                      background: "oklch(0.55 0.22 25)",
                      fontFamily: "Noto Sans Devanagari, sans-serif",
                    }}
                  >
                    {deleteVillage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : null}
                    हाँ, हटाएं
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}

interface VillagesPageProps {
  districtId: bigint;
  districtName: string;
  onBack: () => void;
}

export default function VillagesPage({ districtId, districtName, onBack }: VillagesPageProps) {
  const { data: villages, isLoading, isError } = useGetVillagesByDistrict(districtId);
  const addVillage = useAddVillage();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (name: string) => {
    addVillage.mutate(
      { districtId, name },
      { onSuccess: () => setShowAddForm(false) }
    );
  };

  return (
    <section className="min-h-screen py-12 px-4" style={{ background: "oklch(0.97 0.006 45)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium mb-6 transition-all hover:opacity-70"
            style={{ color: "oklch(0.46 0.10 15)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            जिलों पर वापस जाएं
          </button>
          <div className="text-center">
            <div className="ornament">✦ ✦ ✦</div>
            <h1 className="section-heading mb-1">{districtName}</h1>
            <p className="text-sm" style={{ color: "oklch(0.55 0.05 30)" }}>गाँव प्रबंधन</p>
            <div className="gold-divider mt-3" />
          </div>
        </div>

        {/* Add Village Button / Form */}
        <div className="mb-6">
          {showAddForm ? (
            <div
              className="rounded-xl border p-4"
              style={{
                background: "oklch(0.99 0.003 60)",
                borderColor: "oklch(0.64 0.08 45)",
                boxShadow: "0 2px 12px oklch(0.24 0.09 15 / 0.10)",
              }}
            >
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "oklch(0.30 0.10 15)", fontFamily: "Noto Serif Devanagari, serif" }}
              >
                नया गाँव जोड़ें
              </p>
              <VillageForm
                onSubmit={handleAdd}
                onCancel={() => setShowAddForm(false)}
                isLoading={addVillage.isPending}
                submitLabel="जोड़ें"
              />
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 font-medium"
              style={{
                background: "oklch(0.30 0.10 15)",
                color: "oklch(0.84 0.07 85)",
                fontFamily: "Noto Sans Devanagari, sans-serif",
              }}
            >
              <Plus className="w-4 h-4" />
              गाँव जोड़ें
            </Button>
          )}
        </div>

        {/* Villages List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.40 0.09 15)" }} />
            <span className="ml-3 text-base" style={{ color: "oklch(0.50 0.06 30)" }}>
              गाँव लोड हो रहे हैं...
            </span>
          </div>
        ) : isError ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
          >
            <p className="text-base font-medium" style={{ color: "oklch(0.55 0.22 25)" }}>
              डेटा लोड करने में त्रुटि हुई।
            </p>
          </div>
        ) : !villages || villages.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
          >
            <MapPin className="w-14 h-14 mx-auto mb-4" style={{ color: "oklch(0.74 0.06 45)" }} />
            <p className="text-base font-medium mb-1" style={{ color: "oklch(0.40 0.06 30)" }}>
              इस जिले में अभी कोई गाँव नहीं है।
            </p>
            <p className="text-sm" style={{ color: "oklch(0.60 0.04 45)" }}>
              ऊपर "गाँव जोड़ें" बटन से शुरू करें।
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {villages.map(village => (
              <VillageCard
                key={village.id.toString()}
                village={village}
                districtId={districtId}
              />
            ))}
          </div>
        )}

        {/* Count */}
        {villages && villages.length > 0 && (
          <p className="text-center text-sm mt-6" style={{ color: "oklch(0.60 0.04 45)" }}>
            कुल {villages.length} गाँव
          </p>
        )}
      </div>
    </section>
  );
}
