import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Loader2 } from "lucide-react";
import { useGetDistricts, useGetVillagesByDistrict } from "@/hooks/useQueries";
import type { District } from "../backend";

function VillageChips({ districtId }: { districtId: bigint }) {
  const { data: villages, isLoading } = useGetVillagesByDistrict(districtId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "oklch(0.64 0.08 45)" }} />
        <span className="ml-2 text-sm" style={{ color: "oklch(0.55 0.05 30)" }}>लोड हो रहा है...</span>
      </div>
    );
  }

  if (!villages || villages.length === 0) {
    return (
      <p className="text-sm italic py-3 text-center" style={{ color: "oklch(0.60 0.04 45)" }}>
        कोई गाँव नहीं जोड़ा गया
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {villages.map((village) => (
        <span
          key={village.id.toString()}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border"
          style={{
            background: "oklch(0.97 0.008 60)",
            borderColor: "oklch(0.84 0.07 85)",
            color: "oklch(0.30 0.09 15)",
          }}
        >
          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "oklch(0.64 0.08 45)" }} />
          {village.name}
        </span>
      ))}
    </div>
  );
}

function DistrictCard({ district, isOpen, onToggle }: {
  district: District;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden transition-shadow"
      style={{
        borderColor: isOpen ? "oklch(0.64 0.08 45)" : "oklch(0.86 0.03 45)",
        boxShadow: isOpen ? "0 4px 16px oklch(0.24 0.09 15 / 0.12)" : "none",
      }}
    >
      {/* District Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{
          background: isOpen ? "oklch(0.24 0.09 15)" : "oklch(0.99 0.003 60)",
        }}
        onMouseEnter={e => {
          if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.96 0.01 30)";
        }}
        onMouseLeave={e => {
          if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.99 0.003 60)";
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: isOpen ? "oklch(0.64 0.08 45)" : "oklch(0.24 0.09 15)",
            }}
          >
            <MapPin className="w-4 h-4" style={{ color: isOpen ? "oklch(0.18 0.06 15)" : "oklch(0.84 0.07 85)" }} />
          </div>
          <span
            className="font-semibold font-serif text-base"
            style={{ color: isOpen ? "oklch(0.84 0.07 85)" : "oklch(0.24 0.09 15)" }}
          >
            {district.name}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: isOpen ? "oklch(0.64 0.08 45 / 0.25)" : "oklch(0.24 0.09 15 / 0.08)",
              color: isOpen ? "oklch(0.84 0.07 85)" : "oklch(0.40 0.08 15)",
            }}
          >
            {district.villageIds.length} गाँव
          </span>
        </div>
        <div style={{ color: isOpen ? "oklch(0.84 0.07 85)" : "oklch(0.50 0.06 30)" }}>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Villages Panel */}
      {isOpen && (
        <div
          className="px-5 pb-5 pt-3 border-t"
          style={{
            background: "oklch(0.98 0.005 60)",
            borderColor: "oklch(0.64 0.08 45 / 0.30)",
          }}
        >
          <VillageChips districtId={district.id} />
        </div>
      )}
    </div>
  );
}

export default function VillagesSection() {
  const { data: districts, isLoading } = useGetDistricts();
  const [openDistrictId, setOpenDistrictId] = useState<bigint | null>(null);

  const handleToggle = (id: bigint) => {
    setOpenDistrictId(prev => (prev === id ? null : id));
  };

  return (
    <section id="villages" className="py-16 px-4" style={{ background: "oklch(0.97 0.006 45)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">हमसे जुड़े गाँव</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-xl mx-auto">
            नीचे दिए गए जिलों पर क्लिक करें और उस जिले के जुड़े हुए गाँवों की सूची देखें।
          </p>
        </div>

        {/* Districts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.40 0.09 15)" }} />
            <span className="ml-3 text-base" style={{ color: "oklch(0.50 0.06 30)" }}>जिले लोड हो रहे हैं...</span>
          </div>
        ) : !districts || districts.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{
              background: "oklch(0.99 0.003 60)",
              borderColor: "oklch(0.86 0.03 45)",
            }}
          >
            <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: "oklch(0.74 0.06 45)" }} />
            <p className="text-base font-medium" style={{ color: "oklch(0.40 0.06 30)" }}>
              अभी तक कोई जिला नहीं जोड़ा गया।
            </p>
            <p className="text-sm mt-1" style={{ color: "oklch(0.60 0.04 45)" }}>
              जिले प्रबंधन पेज से जिले और गाँव जोड़ें।
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {districts.map((district) => (
              <DistrictCard
                key={district.id.toString()}
                district={district}
                isOpen={openDistrictId === district.id}
                onToggle={() => handleToggle(district.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
