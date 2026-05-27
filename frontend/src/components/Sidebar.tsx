'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';

const navItems = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'My Groups', href: '/groups', icon: GroupsIcon },
  { label: 'Assignments', href: '/assignments', icon: AssignmentsIcon, badge: true },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: ToolkitIcon },
  { label: 'My Library', href: '/library', icon: LibraryIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { assignments } = useAssignmentStore();
  const count = assignments.length;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" style={{ border: 'none', padding: '8px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#brand-orange-grad)" />
          <path d="M9 10 L16 21 L23 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="brand-orange-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F06045" />
              <stop stopColor="#E84A2F" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.5px' }}>VedaAI</span>
      </div>

      {/* Create button */}
      <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
        <button className="btn-create">
          <span style={{ fontSize: 18 }}>+</span> Create Assignment
        </button>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon />
              <span>{item.label}</span>
              {item.badge && count > 0 && (
                <span className="badge">{count > 99 ? '99+' : count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <Link href="/settings" className="nav-item" style={{ marginBottom: 12 }}>
          <SettingsIcon />
          <span>Settings</span>
        </Link>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
          borderRadius: 10, background: '#f8f8f8'
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#e0c8a0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>🧑‍🏫</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Delhi Public School</div>
            <div style={{ fontSize: 11, color: '#888' }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function GroupsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function AssignmentsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function ToolkitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
