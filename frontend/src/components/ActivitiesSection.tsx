import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActivities, useSeedActivities } from "@/hooks/useQueries";

const impactStats = [
  { value: "५०००+", label: "परिवारों की मदद" },
  { value: "१०+", label: "वर्षों की सेवा" },
  { value: "२०+", label: "कार्यक्रम प्रतिवर्ष" },
  { value: "१०००+", label: "स्वयंसेवक" },
];

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("hi-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function ActivitiesSection() {
  const { data: activities, isLoading } = useGetActivities();
  const seedActivities = useSeedActivities();

  useEffect(() => {
    seedActivities.mutate();
  }, []);

  return (
    <section id="activities" className="py-16 px-4" style={{ background: "oklch(0.94 0.010 58)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">हमारी गतिविधियाँ</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-2xl mx-auto">
            हम निरंतर समाज सेवा में लगे हैं। यहाँ हमारी कुछ प्रमुख गतिविधियाँ देखें।
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border" style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}>
                  <Skeleton className="h-44 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            : (activities ?? []).map((activity) => (
                <div
                  key={String(activity.id)}
                  className="rounded-xl overflow-hidden border shadow-card hover:shadow-card-hover transition-shadow"
                  style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
                >
                  <div className="relative h-44 overflow-hidden" style={{ background: "oklch(0.93 0.03 30)" }}>
                    <img
                      src={activity.image.getDirectURL()}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    {/* Date badge */}
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                      style={{ background: "oklch(0.24 0.09 15)", color: "oklch(0.84 0.07 85)" }}
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(activity.date)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-serif mb-1" style={{ color: "oklch(0.24 0.09 15)" }}>{activity.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.50 0.05 30)" }}>{activity.description}</p>
                  </div>
                </div>
              ))}
        </div>

        {/* Impact Stats */}
        <div className="rounded-2xl p-8" style={{ background: "oklch(0.24 0.09 15)" }}>
          <h3 className="text-center text-xl font-bold font-serif mb-8" style={{ color: "oklch(0.84 0.07 85)" }}>
            हमारा प्रभाव
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold font-serif mb-1" style={{ color: "oklch(0.84 0.07 85)" }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "oklch(0.80 0.05 45)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
