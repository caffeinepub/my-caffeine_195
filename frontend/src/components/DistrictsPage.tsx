import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, MapPin, ChevronRight, X, Check } from "lucide-react";
import {
  useGetDistricts,
  useAddDistrict,
  useEditDistrict,
  useDeleteDistrict,
} from "@/hooks/useQueries";
import type { District } from "../backend";
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

interface DistrictFormProps {
  initialValue?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

function DistrictForm({ initialValue = "", onSubmit, onCancel, isLoading, submitLabel }: DistrictFormProps) {
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
        placeholder="जिले का नाम दर्ज करें..."
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

interface DistrictCardProps {
  district: District;
  onNavigate: (district: District) => void;
}

function DistrictCard({ district, onNavigate }: DistrictCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editDistrict = useEditDistrict();
  const deleteDistrict = useDeleteDistrict();

  const handleEdit = (name: string) => {
    editDistrict.mutate(
      { id: district.id, name },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{
        background: "oklch(0.99 0.003 60)",
        borderColor: "oklch(0.86 0.03 45)",
        boxShadow: "0 2px 8px oklch(0.24 0.09 15 / 0.08)",
      }}
    >
      {isEditing ? (
        <div className="px-4 py-3">
          <DistrictForm
            initialValue={district.name}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            isLoading={editDistrict.isPending}
            submitLabel="अपडेट करें"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          {/* District Icon */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.24 0.09 15)" }}
          >
            <MapPin className="w-4 h-4" style={{ color: "oklch(0.84 0.07 85)" }} />
          </div>

          {/* Name + village count */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-base truncate"
              style={{ color: "oklch(0.24 0.09 15)", fontFamily: "Noto Serif Devanagari, serif" }}
            >
              {district.name}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.05 30)" }}>
              {district.villageIds.length} गाँव
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Navigate to villages */}
            <button
              onClick={() => onNavigate(district)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: "oklch(0.24 0.09 15 / 0.08)", color: "oklch(0.30 0.10 15)" }}
              title="गाँव देखें"
            >
              गाँव देखें
              <ChevronRight className="w-3 h-3" />
            </button>

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
                    जिला हटाएं?
                  </AlertDialogTitle>
                  <AlertDialogDescription style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                    क्या आप <strong>"{district.name}"</strong> जिले को हटाना चाहते हैं? इस जिले के सभी गाँव भी हट जाएंगे। यह क्रिया वापस नहीं की जा सकती।
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                    रद्द करें
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteDistrict.mutate(district.id)}
                    style={{
                      background: "oklch(0.55 0.22 25)",
                      fontFamily: "Noto Sans Devanagari, sans-serif",
                    }}
                  >
                    {deleteDistrict.isPending ? (
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

interface DistrictsPageProps {
  onNavigateToVillages: (districtId: bigint, districtName: string) => void;
}

export default function DistrictsPage({ onNavigateToVillages }: DistrictsPageProps) {
  const { data: districts, isLoading, isError } = useGetDistricts();
  const addDistrict = useAddDistrict();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (name: string) => {
    addDistrict.mutate(name, {
      onSuccess: () => setShowAddForm(false),
    });
  };

  return (
    <section className="min-h-screen py-12 px-4" style={{ background: "oklch(0.97 0.006 45)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="ornament">✦ ✦ ✦</div>
          <h1 className="section-heading mb-3">जिले प्रबंधन</h1>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-xl mx-auto">
            जिले जोड़ें, संपादित करें या हटाएं। किसी जिले पर क्लिक करके उसके गाँव देखें।
          </p>
        </div>

        {/* Add District Button / Form */}
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
                नया जिला जोड़ें
              </p>
              <DistrictForm
                onSubmit={handleAdd}
                onCancel={() => setShowAddForm(false)}
                isLoading={addDistrict.isPending}
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
              जिला जोड़ें
            </Button>
          )}
        </div>

        {/* Districts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.40 0.09 15)" }} />
            <span className="ml-3 text-base" style={{ color: "oklch(0.50 0.06 30)" }}>
              जिले लोड हो रहे हैं...
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
        ) : !districts || districts.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
          >
            <MapPin className="w-14 h-14 mx-auto mb-4" style={{ color: "oklch(0.74 0.06 45)" }} />
            <p className="text-base font-medium mb-1" style={{ color: "oklch(0.40 0.06 30)" }}>
              अभी तक कोई जिला नहीं जोड़ा गया।
            </p>
            <p className="text-sm" style={{ color: "oklch(0.60 0.04 45)" }}>
              ऊपर "जिला जोड़ें" बटन से शुरू करें।
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {districts.map(district => (
              <DistrictCard
                key={district.id.toString()}
                district={district}
                onNavigate={d => onNavigateToVillages(d.id, d.name)}
              />
            ))}
          </div>
        )}

        {/* Count */}
        {districts && districts.length > 0 && (
          <p className="text-center text-sm mt-6" style={{ color: "oklch(0.60 0.04 45)" }}>
            कुल {districts.length} जिले
          </p>
        )}
      </div>
    </section>
  );
}
