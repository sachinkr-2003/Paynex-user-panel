import React from 'react';
import { Crown, Rocket, ShieldCheck, Zap, UserCheck } from 'lucide-react';

// 3D Bar Chart Visual
const BarChart3D = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', height: '200px', gap: '14px', perspective: '600px' }}>
    {/* Glow behind */}
    <div style={{
      position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      width: '200px', height: '80px',
      background: 'radial-gradient(ellipse, rgba(251,191,36,0.3), transparent 70%)',
      filter: 'blur(20px)',
    }} />

    {[
      { h: 90, color: '#2563eb', shade: '#1d4ed8' },
      { h: 140, color: '#f59e0b', shade: '#d97706', crown: true },
      { h: 110, color: '#0284c7', shade: '#0369a1' },
    ].map((bar, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
        {bar.crown && (
          <div style={{ marginBottom: '6px', filter: 'drop-shadow(0 0 8px gold)', display: 'flex', justifyContent: 'center' }}>
            <Crown size={24} color="#fbbf24" />
          </div>
        )}
        {/* Bar face */}
        <div style={{
          width: '52px', height: `${bar.h}px`,
          background: `linear-gradient(180deg, ${bar.color}ff, ${bar.shade}cc)`,
          borderRadius: '6px 6px 0 0',
          boxShadow: `0 0 20px ${bar.color}66`,
          position: 'relative',
        }}>
          {/* Top face 3D */}
          <div style={{
            position: 'absolute', top: '-14px', left: '-10px', right: '-10px',
            height: '14px',
            background: `linear-gradient(135deg, ${bar.color}dd, ${bar.color}99)`,
            borderRadius: '4px 4px 0 0',
            transform: 'perspective(200px) rotateX(-30deg)',
          }} />
          {/* Side face 3D */}
          <div style={{
            position: 'absolute', top: '-14px', right: '-16px',
            width: '16px', height: `${bar.h + 14}px`,
            background: `${bar.shade}99`,
            transform: 'perspective(200px) rotateY(-30deg)',
            transformOrigin: 'left',
          }} />
        </div>
      </div>
    ))}

    {/* Golden Arrow */}
    <div style={{
      position: 'absolute', bottom: '40px', right: '-20px',
      transform: 'rotate(-40deg)',
      filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.8))',
      display: 'flex',
    }}>
      <Rocket size={34} color="#fbbf24" />
    </div>
  </div>
);

const About = () => {
  return (
    <section id="about-us" style={{
      padding: '100px 48px',
      background: 'linear-gradient(180deg, #070919 0%, #03040a 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
            ABOUT PAYNEX
          </p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '20px' }}>
            Built for Your<br />
            <span className="gradient-text-gold">Financial Growth</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '32px' }}>
            PAYNEX is more than just a platform — it's your digital partner in financial growth. We provide a secure, transparent and easy-to-use environment to help you achieve your financial goals, step by step.
          </p>
          <button className="btn-cyber-primary" style={{ padding: '11px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
            Learn More
          </button>
        </div>

        {/* Center — 3D Chart */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BarChart3D />
        </div>

        {/* Right — Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { icon: <ShieldCheck size={20} color="#fbbf24" />, title: 'Trusted & Transparent', desc: 'We believe in complete transparency and fair processes.' },
            { icon: <Zap size={20} color="#fbbf24" />, title: 'Innovative Technology', desc: 'Built with modern technology for better performance and security.' },
            { icon: <UserCheck size={20} color="#fbbf24" />, title: 'Customer First', desc: 'Your satisfaction is our top priority.' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
