import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export default function JobMatching() {
  const { campusDrives, applyForDrive, activeJobModal, setActiveJobModal, profile, discoverJobs, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [minMatch, setMinMatch] = useState(0);

  // AI-discovered jobs (the primary source — replaces seeded drives as the
  // main listing). Loaded automatically on first mount.
  const [aiJobs, setAiJobs] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [location, setLocation] = useState('');

  const fmtDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Load AI jobs on mount using the user's preferred location (or 'India' default)
  const loadAiJobs = useCallback(async (loc) => {
    setAiLoading(true);
    setAiError(null);
    const result = await discoverJobs(loc || location || profile?.preferredJobLocations?.[0] || 'India');
    if (result.error) {
      setAiError(result.error);
    } else {
      setAiJobs(result.jobs || []);
      setAiInsight(result.insight || '');
    }
    setAiLoading(false);
  }, [discoverJobs, location, profile]);

  useEffect(() => {
    loadAiJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter campus drives by search query (the secondary "Campus Drives" section)
  const filteredDrives = (campusDrives || []).filter((drive) => {
    const matchesQuery =
      !searchQuery ||
      (drive.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (drive.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (drive.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScore = (drive.matchPercentage || 0) >= minMatch;
    return matchesQuery && matchesScore;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <section className="card" style={{ padding: '2rem 2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-warning">AI-Powered Job Discovery</span>
          <span className="badge badge-info">{aiJobs.length + (campusDrives?.length || 0)} Opportunities</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '750px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Job Opportunities
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              AI searches live job postings matching your verified skills and self-reported skills.
              Opportunities are matched against your academic CGPA ({profile?.cgpa ?? '—'}) and employment readiness ({profile?.readinessScore ?? 0}%).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Location
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={profile?.preferredJobLocations?.[0] || 'India'}
                className="input-field"
                style={{ width: '160px', padding: '0.4rem 0.6rem' }}
              />
            </label>
            <button
              onClick={() => loadAiJobs(location)}
              disabled={aiLoading}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.55rem 1rem' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: aiLoading ? 'spin 1s linear infinite' : 'none' }}>search</span>
              {aiLoading ? 'Searching…' : 'Refresh AI Jobs'}
            </button>
          </div>
        </div>
      </section>

      {/* AI insight banner */}
      {aiInsight && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start', background: 'var(--secondary-tint)', borderColor: 'var(--secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--secondary)' }}>auto_awesome</span>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>AI Market Insight</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{aiInsight}</p>
          </div>
        </div>
      )}

      {aiError && (
        <div className="card" style={{ padding: '1rem 1.25rem', borderColor: 'var(--danger, #FCA5A5)', color: 'var(--danger, #B91C1C)', fontSize: '0.85rem' }}>
          {aiError}
        </div>
      )}

      {/* AI-Discovered Jobs (primary) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>AI-Discovered Job Postings</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Live openings matched to your skills on LinkedIn, Naukri, Indeed, and more.</p>
          </div>
          {aiLoading && <span className="badge badge-info">Searching the web…</span>}
        </div>

        {!aiLoading && aiJobs.length === 0 && !aiError && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No AI-discovered jobs yet. Click "Refresh AI Jobs" above to search.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
          {aiJobs.map((job, i) => (
            <a key={i} href={job.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1.25rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{job.title}</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem', flexShrink: 0 }}>{job.source}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>{job.snippet}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{job.date ? fmtDate(job.date) : ''}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>View posting →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Campus Drives (secondary — institutional placements managed by admin) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', marginTop: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Campus Placement Drives</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Verified institutional drives with direct application via your Skill-Setu dossier.</p>
          </div>
          <span className="badge badge-info">{filteredDrives.length} active</span>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--text-light)' }}>search</span>
            <input
              type="text"
              placeholder="Search by company, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ border: 'none', padding: '0.35rem 0', boxShadow: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Minimum Alignment:</span>
            <select value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))} className="input-field" style={{ width: 'auto', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>
              <option value={0}>Any Match</option>
              <option value={60}>60%+ Match</option>
              <option value={70}>70%+ Match</option>
              <option value={80}>80%+ Match</option>
              <option value={90}>90%+ Match</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredDrives.map((drive) => (
            <div key={drive.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {drive.logoInitials}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{drive.company}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{drive.location}</p>
                    </div>
                  </div>
                  <span className="badge" style={{ background: drive.matchPercentage >= 90 ? 'var(--success-bg)' : 'var(--warning-bg)', color: drive.matchPercentage >= 90 ? 'var(--success)' : 'var(--warning)', border: `1px solid ${drive.matchPercentage >= 90 ? 'var(--success-border)' : 'var(--warning-border)'}` }}>
                    {drive.matchPercentage}% Match
                  </span>
                </div>
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-main)' }}>{drive.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--saffron)' }}>{drive.ctc}</span>
                    <span style={{ color: 'var(--text-light)' }}>&bull;</span>
                    <span style={{ color: 'var(--text-muted)' }}>Min CGPA: {drive.eligibilityCgpa}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Skills Requirement</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {drive.matchedSkills.map((sk, i) => (
                      <span key={i} className="badge badge-info" style={{ fontSize: '0.72rem' }}>&check; {sk}</span>
                    ))}
                    {drive.missingSkills.map((sk, i) => (
                      <span key={`miss-${i}`} className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Gap: {sk}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline: <strong>{fmtDate(drive.deadline)}</strong></span>
                {drive.applied ? (
                  <span className="badge badge-success" style={{ padding: '0.35rem 0.75rem' }}>Applied</span>
                ) : (
                  <button onClick={() => setActiveJobModal(drive)} className="btn btn-primary btn-sm">Apply Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {activeJobModal && (
        <div className="civic-modal-backdrop" onClick={() => setActiveJobModal(null)}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {activeJobModal.logoInitials}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Apply to {activeJobModal.company}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeJobModal.role} &bull; {activeJobModal.ctc}</p>
                </div>
              </div>
              <button onClick={() => setActiveJobModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Application Credentials</div>
              <div style={{ color: 'var(--text-body)' }}>Candidate: <strong>{profile?.name || '—'}</strong> ({profile?.rollNo || '—'})</div>
              <div style={{ color: 'var(--text-muted)' }}>AICTE ID: {profile?.aicteId || '—'} &bull; CGPA: {profile?.cgpa ?? '—'}</div>
              <div style={{ color: 'var(--text-muted)' }}>Verified Skills: <strong>{profile?.verifiedSkillsCount ?? 0} Competencies Attached</strong></div>
              <div style={{ color: 'var(--success)', fontWeight: 600, marginTop: '0.25rem' }}>&check; Verified academic credentials will be submitted directly to recruiter portal.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveJobModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => { applyForDrive(activeJobModal.id); setActiveJobModal(null); }} className="btn btn-primary btn-sm">Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
