import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Application, Stage } from './types';
import { STAGES, progressRank } from './types';
import { db, deleteApplication, clearAllData, exportData, importData, seedApplications } from './db';
import { demoApplications } from './demoData';
import { Funnel } from './components/Funnel';
import { ApplicationForm } from './components/ApplicationForm';
import { ApplicationsTable } from './components/ApplicationsTable';
import './App.css';

type SortKey = 'company' | 'dateApplied' | 'lastActivity' | 'stage';
type SortDir = 'asc' | 'desc';

export default function App() {
  const applications = useLiveQuery(() => db.applications.toArray(), [], undefined);
  const [stageFilter, setStageFilter] = useState<'All' | Stage>('All');
  const [companyFilter, setCompanyFilter] = useState('');
  const [nextActionFilter, setNextActionFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastActivity');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const loading = applications === undefined;
  const all = applications ?? [];

  const companyQuery = companyFilter.trim().toLowerCase();
  const nextActionQuery = nextActionFilter.trim().toLowerCase();

  const visible = all
    .filter((a) => stageFilter === 'All' || a.stage === stageFilter)
    .filter((a) => a.company.toLowerCase().includes(companyQuery))
    .filter((a) => (a.nextAction ?? '').toLowerCase().includes(nextActionQuery))
    .sort((a, b) => {
      let cmp: number;
      if (sortKey === 'company') {
        cmp = a.company.localeCompare(b.company);
      } else if (sortKey === 'stage') {
        const order = (s: Stage) => {
          const r = progressRank(s);
          return r === -1 ? STAGES.indexOf(s) + 10 : r;
        };
        cmp = order(a.stage) - order(b.stage) || a.lastActivity.localeCompare(b.lastActivity);
      } else {
        cmp = (a[sortKey] ?? '').localeCompare(b[sortKey] ?? '');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 4000);
  };

  const onExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-pipeline-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Delay revocation so the download stream is initiated before the URL is freed.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (all.length > 0 && !window.confirm('Importing replaces all current data. Continue?')) return;
    try {
      const parsed = JSON.parse(await file.text());
      const count = await importData(parsed);
      flash(`Imported ${count} applications.`);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Import failed: file could not be read.');
    }
  };

  const onDemo = async () => {
    if (all.length > 0 && !window.confirm('Loading demo data replaces all current data. Continue?')) return;
    await seedApplications(demoApplications);
    flash('Demo data loaded. This is fictional sample data.');
  };

  const onClear = async () => {
    if (!window.confirm('Delete all applications from this browser? Export a backup first if you need one.')) return;
    await clearAllData();
    flash('All data cleared.');
  };

  return (
    <main className="container">
      <header>
        <h1>Job Pipeline Tracker</h1>
        <p className="privacy-note">
          All data stays in your browser. Nothing is sent to any server. Use Export for backups.
        </p>
      </header>

      <div className="toolbar">
        <button
          className="primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add application
        </button>
        <button onClick={onExport} disabled={all.length === 0}>Export JSON</button>
        <button onClick={() => fileInput.current?.click()}>Import JSON</button>
        <input ref={fileInput} type="file" accept="application/json" hidden onChange={onImportFile} />
        <span className="spacer" />
        <button onClick={onDemo}>Load demo data</button>
        <button className="danger" onClick={onClear} disabled={all.length === 0}>Clear all data</button>
      </div>

      {message && <p className="flash" role="status">{message}</p>}

      {formOpen && (
        <ApplicationForm
          editing={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <section>
        <h2>Funnel</h2>
        <Funnel applications={all} />
      </section>

      <section>
        <div className="table-controls">
          <h2>Applications ({visible.length})</h2>
          <label>
            Company
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company"
            />
          </label>
          <label>
            Stage
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as 'All' | Stage)}>
              <option value="All">All</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Next action
            <input
              type="text"
              value={nextActionFilter}
              onChange={(e) => setNextActionFilter(e.target.value)}
              placeholder="Filter by next action"
            />
          </label>
          <label>
            Sort by
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
              <option value="company">Company</option>
              <option value="dateApplied">Date applied</option>
              <option value="lastActivity">Last activity</option>
              <option value="stage">Stage</option>
            </select>
          </label>
          <label>
            Direction
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDir)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
        </div>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : (
          <ApplicationsTable
            applications={visible}
            onEdit={(app) => {
              setEditing(app);
              setFormOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={(id) => void deleteApplication(id)}
          />
        )}
      </section>

      <footer>
        <p className="muted">
          Local-first by design: your job search data is sensitive, so this app never receives it.
        </p>
      </footer>
    </main>
  );
}
