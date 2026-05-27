'use client';
import Link from 'next/link';

interface TopbarProps {
  title?: string;
  backHref?: string;
  breadcrumb?: string;
}

export default function Topbar({ title, backHref, breadcrumb = 'Assignment' }: TopbarProps) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/assignments" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', color: '#1A1A1A',
          transition: 'background-color 0.2s', border: '1px solid #E5E7EB'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1A1A1A', fontSize: 14, fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#666' }}>
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>{breadcrumb}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notification */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 8, height: 8, background: '#E84A2F', borderRadius: '50%'
          }} />
        </div>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '2px solid #E84A2F', borderRadius: 20,
          padding: '4px 12px', cursor: 'pointer', fontSize: 14
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#e0c8a0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12
          }}>👤</div>
          <span style={{ fontWeight: 500 }}>John Doe</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
