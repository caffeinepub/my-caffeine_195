import React, { useRef, useEffect } from 'react';
import { Heart, BookOpen, Users, Shield, Star, Lightbulb, GraduationCap, Ban, Stethoscope, Briefcase, AlertTriangle } from 'lucide-react';

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

const coreValues = [
  { icon: Heart, title: 'सेवा भाव', desc: 'निःस्वार्थ सेवा और समर्पण' },
  { icon: BookOpen, title: 'शिक्षा', desc: 'ज्ञान और शिक्षा का प्रसार' },
  { icon: Users, title: 'एकता', desc: 'समाज में एकता और भाईचारा' },
  { icon: Shield, title: 'सुरक्षा', desc: 'कमजोर वर्गों की सुरक्षा' },
  { icon: Star, title: 'उत्कृष्टता', desc: 'हर कार्य में श्रेष्ठता' },
  { icon: Lightbulb, title: 'नवाचार', desc: 'नई सोच और समाधान' },
  { icon: GraduationCap, title: 'शिक्षा अभियान', desc: 'बच्चों को शिक्षित करना' },
  { icon: Ban, title: 'दहेज प्रथा रोकथाम', desc: 'दहेज प्रथा के विरुद्ध अभियान' },
  { icon: Stethoscope, title: 'मेडिकल हेल्प', desc: 'स्वास्थ्य सेवाएं और सहायता' },
  { icon: Briefcase, title: 'करियर गाइडेंस', desc: 'युवाओं को करियर मार्गदर्शन' },
  { icon: AlertTriangle, title: 'सामाजिक बुराइयाँ', desc: 'समाज की बुराइयों को खत्म करना' },
];

export default function AboutSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section
      id="about"
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
            हमारे बारे में
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
            <span className="text-xl" style={{ color: '#dacc96' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div
            className="rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#fdf6e3', borderColor: '#dacc96' }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: '#632626' }}>🎯 हमारा मिशन</h3>
            <p className="text-gray-700 leading-relaxed">
              गौसिया अशरफिया फाउंडेशन का मिशन है समाज के हर वर्ग को शिक्षा, स्वास्थ्य और आर्थिक सहायता प्रदान करना। हम 2011 से निरंतर सेवा कार्य में लगे हैं।
            </p>
          </div>
          <div
            className="rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#fdf6e3', borderColor: '#dacc96' }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: '#632626' }}>🌟 हमारा विजन</h3>
            <p className="text-gray-700 leading-relaxed">
              एक ऐसे समाज का निर्माण जहाँ हर व्यक्ति को समान अवसर मिले, कोई भूखा न सोए, हर बच्चा शिक्षित हो और हर परिवार खुशहाल हो।
            </p>
          </div>
        </div>

        {/* History */}
        <div
          className="rounded-2xl p-6 mb-10 border-2"
          style={{ background: '#fdf6e3', borderColor: '#dacc96' }}
        >
          <h3 className="text-xl font-bold mb-3" style={{ color: '#632626' }}>📜 फाउंडेशन का इतिहास</h3>
          <p className="text-gray-700 leading-relaxed">
            गौसिया अशरफिया फाउंडेशन की स्थापना 2011 में हुई थी। तब से लेकर आज तक हमने हजारों परिवारों की मदद की है। हमारी संस्था ने शिक्षा, स्वास्थ्य, और सामाजिक कल्याण के क्षेत्र में अनेक महत्वपूर्ण कार्य किए हैं।
          </p>
        </div>

        {/* Core Values */}
        <h3 className="text-xl font-bold mb-6 text-center" style={{ color: '#632626' }}>हमारे मूल्य</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {coreValues.map((val, i) => {
            const Icon = val.icon;
            return (
              <div
                key={i}
                className="rounded-xl p-4 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: '#fdf6e3', borderColor: '#dacc96' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ background: '#632626' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: '#632626' }}>{val.title}</h4>
                <p className="text-xs text-gray-600">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
