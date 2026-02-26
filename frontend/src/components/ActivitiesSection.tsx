import React, { useRef, useEffect } from 'react';
import { Heart, BookOpen, Utensils, Home, Stethoscope, Users } from 'lucide-react';

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

const activities = [
  { icon: BookOpen, title: 'शिक्षा सहायता', desc: 'गरीब बच्चों को मुफ्त शिक्षा और किताबें प्रदान करना।' },
  { icon: Utensils, title: 'भोजन वितरण', desc: 'जरूरतमंदों को नियमित भोजन और राशन वितरण।' },
  { icon: Stethoscope, title: 'स्वास्थ्य शिविर', desc: 'मुफ्त चिकित्सा शिविर और दवाइयों का वितरण।' },
  { icon: Home, title: 'आवास सहायता', desc: 'बेघर परिवारों को आवास निर्माण में सहायता।' },
  { icon: Heart, title: 'विधवा सहायता', desc: 'विधवा महिलाओं को आर्थिक और सामाजिक सहायता।' },
  { icon: Users, title: 'युवा विकास', desc: 'युवाओं को कौशल विकास और रोजगार में मदद।' },
];

const stats = [
  { value: '0', label: 'परिवारों की मदद' },
  { value: '0', label: 'शिक्षा लाभार्थी' },
  { value: '0', label: 'स्वास्थ्य शिविर' },
  { value: '0', label: 'गाँव कवर' },
];

export default function ActivitiesSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section
      id="activities"
      ref={sectionRef}
      className="py-16 scroll-animate"
      style={{ background: '#fdf6e3' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
          >
            हमारी गतिविधियाँ
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
            <span className="text-xl" style={{ color: '#dacc96' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {activities.map((act, i) => {
            const Icon = act.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderColor: '#dacc96' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#632626' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#632626' }}>{act.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{act.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div
          className="rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ background: '#632626' }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: '#dacc96' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'rgba(218,204,150,0.8)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
