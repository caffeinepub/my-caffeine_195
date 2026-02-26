import React, { useRef, useEffect } from 'react';
import { Home, Heart, GraduationCap, Briefcase, Baby, Flame } from 'lucide-react';

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const schemes = [
  {
    icon: Home,
    title: 'PM आवास योजना',
    desc: 'गरीब परिवारों को पक्का मकान बनाने के लिए सरकारी सहायता।',
    eligibility: 'BPL परिवार, कच्चे मकान वाले',
  },
  {
    icon: Heart,
    title: 'आयुष्मान भारत',
    desc: '5 लाख रुपये तक का मुफ्त इलाज सरकारी और प्राइवेट अस्पतालों में।',
    eligibility: 'SECC डेटाबेस में शामिल परिवार',
  },
  {
    icon: GraduationCap,
    title: 'अल्पसंख्यक छात्रवृत्ति',
    desc: 'अल्पसंख्यक समुदाय के छात्रों को शिक्षा के लिए वित्तीय सहायता।',
    eligibility: 'अल्पसंख्यक समुदाय के छात्र',
  },
  {
    icon: Briefcase,
    title: 'PMEGP योजना',
    desc: 'स्वरोजगार के लिए 25 लाख तक का ऋण और सब्सिडी।',
    eligibility: '18+ आयु, 8वीं पास',
  },
  {
    icon: Baby,
    title: 'बेटी बचाओ बेटी पढ़ाओ',
    desc: 'बालिकाओं की शिक्षा और सुरक्षा के लिए विशेष योजना।',
    eligibility: 'सभी परिवार जिनमें बेटियाँ हैं',
  },
  {
    icon: Flame,
    title: 'उज्ज्वला योजना',
    desc: 'BPL परिवारों को मुफ्त LPG कनेक्शन और गैस सिलेंडर।',
    eligibility: 'BPL परिवार की महिलाएं',
  },
];

export default function GovernmentSchemesSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section
      id="schemes"
      ref={sectionRef}
      className="py-16 scroll-animate"
      style={{ background: '#fff' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
          >
            सरकारी योजनाएं
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
            <span className="text-xl" style={{ color: '#dacc96' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            हम आपको सरकारी योजनाओं का लाभ दिलाने में मदद करते हैं। नीचे दी गई योजनाओं के बारे में जानें और आवेदन करें।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schemes.map((scheme, i) => {
            const Icon = scheme.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#632626' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#632626' }}>{scheme.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{scheme.desc}</p>
                <div
                  className="text-xs px-3 py-1.5 rounded-full inline-block"
                  style={{ background: 'rgba(99,38,38,0.1)', color: '#632626' }}
                >
                  पात्रता: {scheme.eligibility}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
