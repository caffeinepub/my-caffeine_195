import { Home, Heart, GraduationCap, Briefcase, Users, Leaf } from "lucide-react";

const schemes = [
  {
    icon: Home,
    name: "प्रधानमंत्री आवास योजना",
    englishName: "PM Awas Yojana",
    description:
      "गरीब और मध्यम वर्ग के परिवारों को पक्का मकान बनाने के लिए सरकारी सहायता प्रदान की जाती है।",
    eligibility: "पात्रता: BPL परिवार, EWS/LIG श्रेणी के नागरिक",
    color: "oklch(0.55 0.12 25)",
  },
  {
    icon: Heart,
    name: "आयुष्मान भारत योजना",
    englishName: "Ayushman Bharat - PMJAY",
    description:
      "प्रति परिवार ₹5 लाख तक का स्वास्थ्य बीमा कवर — सरकारी और सूचीबद्ध निजी अस्पतालों में मुफ्त इलाज।",
    eligibility: "पात्रता: SECC डेटाबेस में शामिल परिवार",
    color: "oklch(0.50 0.10 15)",
  },
  {
    icon: GraduationCap,
    name: "अल्पसंख्यक छात्रवृत्ति योजना",
    englishName: "Minority Scholarship Scheme",
    description:
      "अल्पसंख्यक समुदाय के मेधावी छात्रों को प्री-मैट्रिक, पोस्ट-मैट्रिक और मेरिट-कम-मीन्स छात्रवृत्ति।",
    eligibility: "पात्रता: अल्पसंख्यक समुदाय के छात्र, पारिवारिक आय ₹2 लाख से कम",
    color: "oklch(0.45 0.09 200)",
  },
  {
    icon: Briefcase,
    name: "प्रधानमंत्री रोजगार सृजन कार्यक्रम",
    englishName: "PM Employment Generation Programme",
    description:
      "स्वरोजगार के लिए ₹25 लाख तक का ऋण और 15–35% तक की सब्सिडी — नया व्यवसाय शुरू करने के लिए।",
    eligibility: "पात्रता: 18 वर्ष से अधिक आयु, कम से कम 8वीं पास",
    color: "oklch(0.48 0.10 140)",
  },
  {
    icon: Users,
    name: "बेटी बचाओ बेटी पढ़ाओ",
    englishName: "Beti Bachao Beti Padhao",
    description:
      "बालिकाओं की शिक्षा और सुरक्षा के लिए सुकन्या समृद्धि योजना के तहत बचत और सरकारी सहायता।",
    eligibility: "पात्रता: 10 वर्ष से कम आयु की बालिकाएं",
    color: "oklch(0.52 0.11 330)",
  },
  {
    icon: Leaf,
    name: "प्रधानमंत्री उज्ज्वला योजना",
    englishName: "PM Ujjwala Yojana",
    description:
      "BPL परिवारों की महिलाओं को मुफ्त LPG कनेक्शन — स्वच्छ ईंधन और बेहतर स्वास्थ्य के लिए।",
    eligibility: "पात्रता: BPL परिवार की महिला मुखिया, आयु 18 वर्ष से अधिक",
    color: "oklch(0.50 0.10 80)",
  },
];

export default function GovernmentSchemesSection() {
  return (
    <section id="government-schemes" className="py-16 px-4" style={{ background: "oklch(0.94 0.010 58)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">सरकारी योजनाएं</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-2xl mx-auto">
            सरकार की इन महत्वपूर्ण योजनाओं का लाभ उठाएं — हम आपकी मदद के लिए तैयार हैं।
          </p>
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => {
            const Icon = scheme.icon;
            return (
              <div
                key={index}
                className="rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
              >
                {/* Card top accent */}
                <div className="h-1.5 w-full" style={{ background: scheme.color }} />

                <div className="p-5">
                  {/* Icon + Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${scheme.color}22` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: scheme.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold font-serif text-sm leading-snug" style={{ color: "oklch(0.24 0.09 15)" }}>
                        {scheme.name}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.05 30)" }}>
                        {scheme.englishName}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.40 0.05 30)" }}>
                    {scheme.description}
                  </p>

                  {/* Eligibility */}
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{ background: "oklch(0.93 0.03 58)", color: "oklch(0.30 0.08 15)" }}
                  >
                    {scheme.eligibility}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <div
            className="inline-block rounded-xl px-6 py-4 text-sm font-medium"
            style={{ background: "oklch(0.24 0.09 15)", color: "oklch(0.84 0.07 85)" }}
          >
            किसी भी योजना के बारे में अधिक जानकारी के लिए हमसे{" "}
            <a
              href="#contact"
              className="underline font-bold"
              style={{ color: "oklch(0.84 0.07 85)" }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              संपर्क करें
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
