import React from 'react';
import { useApp } from '../context/AppContext';

export default function StudentDashboard() {
  const { profile, skills, targetRoles, campusDrives, setActiveTab } = useApp();

  // While the profile is still loading after login, show a friendly placeholder
  // rather than crashing on `profile.readinessScore`.
  if (!profile) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your dashboard…
      </div>
    );
  }

  const readiness = profile.readinessScore ?? 0;
  const circumference = 251.2;
  const dashOffset = circumference * (1 - readiness / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Hero Greeting Banner */}
      <section className="card" style={{ padding: '2rem 2.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '640px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-success">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
                Skill Set Verified
              </span>
              <span className="badge badge-neutral">
                {profile.employmentStatus || 'Open to Work'}
              </span>
              <span className="badge badge-info">
                SkillSetu ID: {profile.skillSetuId || profile.regId || profile.aicteId}
              </span>
            </div>

            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                Welcome back, {(profile.name || 'Student').split(' ')[0]}
              </h1>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
                {profile.degree} &bull; {profile.institution || 'National Institute of Technology'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('skill-gap-and-courses')}
              className="btn btn-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_circle</span>
              Continue Learning
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics (3-Column Grid) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Metric 1: Overall Readiness */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="stat-header">
            <span className="stat-label">Overall Readiness</span>
                <span className="badge badge-success">Employment readiness</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
            <div style={{ position: 'relative', width: '88px', height: '88px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="88" height="88" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="var(--secondary)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ position: 'absolute', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {readiness}%
              </span>
            </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Employment readiness</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Based on verified skills and target-role matches</p>
              </div>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${readiness}%`, background: 'var(--secondary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Matching target roles
            </span>
            {targetRoles.slice(0, 3).map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveTab('skill-gap-and-courses')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', textAlign: 'left', gap: '0.5rem', minWidth: 0 }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.title}</span>
                <span className="badge badge-info" style={{ flexShrink: 0 }}>{role.currentMatch}%</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('skill-gap-and-courses')}
            className="btn btn-outline btn-sm"
            style={{ marginTop: '1.25rem', width: '100%' }}
          >
            View Readiness Breakdown &rarr;
          </button>
        </div>

        {/* Metric 2: Competency Breakdown */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="stat-header">
            <span className="stat-label">Competency Validation</span>
            <span className="badge badge-info">{skills.length} Validated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.25rem 0' }}>
            {skills.slice(0, 4).map((skill) => (
              <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{skill.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{skill.score}%</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '5px' }}>
                  <div className="progress-bar-fill" style={{ width: `${skill.score}%`, background: skill.score >= 90 ? 'var(--secondary)' : 'var(--saffron)' }} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('user-id')}
            className="btn btn-outline btn-sm"
            style={{ marginTop: 'auto', width: '100%' }}
          >
            All Skills &amp; Credentials &rarr;
          </button>
        </div>

        {/* Metric 3: Priority Campus Drives */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="stat-header">
            <span className="stat-label">Upcoming Drives</span>
            <span className="badge badge-warning">{campusDrives.length} Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {campusDrives.slice(0, 3).map((drive) => (
              <div
                key={drive.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{drive.company}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{drive.role} &bull; {drive.ctc}</div>
                </div>
                <button
                  onClick={() => setActiveTab('job-matching')}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                >
                  View
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('job-matching')}
            className="btn btn-outline btn-sm"
            style={{ marginTop: 'auto', width: '100%' }}
          >
            Explore Campus Placement &rarr;
          </button>
        </div>
      </section>

      {/* 3. Bottom Grid: Placement Notice */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Placement notice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#B45309', fontSize: '24px', flexShrink: 0 }}>
              campaign
            </span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400E', marginBottom: '0.2rem' }}>
                AICTE Placement Notification
              </div>
              <div style={{ fontSize: '0.8rem', color: '#B45309', lineHeight: 1.5 }}>
                Phase-1 campus recruitment drives commence on <strong>18 September 2026</strong>. Ensure your verified certifications and academic documents are synchronized.
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
