import { useEffect, useState } from 'react';
import type { Application, Stage } from '../types';
import { STAGES } from '../types';
import { saveApplication } from '../db';

const today = () => new Date().toISOString().slice(0, 10);

function emptyDraft(): Application {
  return {
    company: '',
    role: '',
    link: '',
    source: '',
    stage: 'Applied',
    furthestStage: 'Applied',
    dateApplied: today(),
    lastActivity: today(),
    nextAction: '',
    nextActionDate: '',
    notes: '',
  };
}

interface Props {
  editing: Application | null;
  onClose: () => void;
}

export function ApplicationForm({ editing, onClose }: Props) {
  const [draft, setDraft] = useState<Application>(editing ?? emptyDraft());

  useEffect(() => {
    setDraft(editing ?? emptyDraft());
  }, [editing]);

  const set = <K extends keyof Application>(key: K, value: Application[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return;
    await saveApplication({ ...draft, lastActivity: draft.lastActivity || today() });
    onClose();
  };

  return (
    <form className="app-form" onSubmit={submit}>
      <h2>{editing ? 'Edit application' : 'Add application'}</h2>
      <div className="form-grid">
        <label>
          Company *
          <input value={draft.company} onChange={(e) => set('company', e.target.value)} required autoFocus />
        </label>
        <label>
          Role *
          <input value={draft.role} onChange={(e) => set('role', e.target.value)} required />
        </label>
        <label>
          Job link
          <input type="url" value={draft.link ?? ''} onChange={(e) => set('link', e.target.value)} placeholder="https://" />
        </label>
        <label>
          Source
          <input value={draft.source ?? ''} onChange={(e) => set('source', e.target.value)} placeholder="LinkedIn, referral..." />
        </label>
        <label>
          Stage
          <select value={draft.stage} onChange={(e) => set('stage', e.target.value as Stage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Date applied
          <input type="date" value={draft.dateApplied} onChange={(e) => set('dateApplied', e.target.value)} required />
        </label>
        <label>
          Last activity
          <input type="date" value={draft.lastActivity} onChange={(e) => set('lastActivity', e.target.value)} />
        </label>
        <label>
          Next action
          <input value={draft.nextAction ?? ''} onChange={(e) => set('nextAction', e.target.value)} placeholder="Follow up, prep interview..." />
        </label>
        <label>
          Next action date
          <input type="date" value={draft.nextActionDate ?? ''} onChange={(e) => set('nextActionDate', e.target.value)} />
        </label>
        <label className="span-2">
          Notes
          <textarea value={draft.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={2} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="primary">{editing ? 'Save changes' : 'Add'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}
