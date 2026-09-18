import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { activeTab, setActiveTab, profile, triggerLogout, userRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'upload-and-extract', label: 'Upload & Extract', icon: 'document_scanner' },
    { id: 'job-matching', label: 'Job Opportunities', icon: 'work' },
    { id: 'skill-gap-and-courses', label: 'Courses & Skills', icon: 'auto_graph' }
  ];

  return (
    <header className="site-header">
      <div
        className="layout-container"
        style={{
          height: '4.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <BrandLogo
            variant="compact"
            onClick={() => setActiveTab('student-dashboard')}
          />
        </div>

        {/* Center: Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto',
            padding: '0.25rem 0'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`civic-nav-link ${isActive ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: isActive ? '#1976A8' : '#64748B'
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Profile & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <button
            onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.65rem 0.35rem 0.75rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Open student profile menu"
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                {profile?.name || 'Loading…'}
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D' }}>
                Skill Set Verified
              </span>
            </div>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#102A43',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                person
              </span>
            </div>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                {profileMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {profileMenuOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  minWidth: '210px',
                  padding: '0.4rem',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 20
                }}
              >
                <button
                  onClick={() => {
                    setActiveTab('user-id');
                    setProfileMenuOpen(false);
                  }}
                  className="civic-nav-link"
                  role="menuitem"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.75rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>badge</span>
                  <span>Profile &amp; Documents</span>
                </button>
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveTab('placement-cell-admin');
                      setProfileMenuOpen(false);
                    }}
                    className="civic-nav-link"
                    role="menuitem"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.75rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--secondary)' }}>analytics</span>
                    <span>Government Admin Portal</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    triggerLogout();
                  }}
                  className="civic-nav-link"
                  role="menuitem"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.75rem', color: 'var(--danger)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--danger)' }}>logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle btn-secondary btn-sm"
            style={{ display: 'none', padding: '0.45rem 0.6rem' }}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF',
            padding: '0.75rem 1rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`civic-nav-link ${isActive ? 'active' : ''}`}
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '0.65rem 0.85rem'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: isActive ? '#1976A8' : '#64748B'
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {userRole === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('placement-cell-admin');
                setMobileMenuOpen(false);
              }}
              className={`civic-nav-link ${activeTab === 'placement-cell-admin' ? 'active' : ''}`}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.65rem 0.85rem'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1976A8' }}>
                analytics
              </span>
              <span>Government Admin Portal</span>
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 1080px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 1079px) {
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
