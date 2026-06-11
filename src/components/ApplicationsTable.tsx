import type { Application } from '../types';

interface Props {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
}

const stageClass: Record<string, string> = {
  Applied: 'badge-applied',
  Screen: 'badge-screen',
  Interview: 'badge-interview',
  Offer: 'badge-offer',
  Rejected: 'badge-rejected',
  Withdrawn: 'badge-withdrawn',
};

export function ApplicationsTable({ applications, onEdit, onDelete }: Props) {
  if (applications.length === 0) {
    return (
      <p className="empty-state">
        No applications yet. Add your first one, or load the demo data to look around.
      </p>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Stage</th>
            <th>Applied</th>
            <th>Last activity</th>
            <th>Next action</th>
            <th>Source</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noreferrer">{a.company}</a>
                ) : (
                  a.company
                )}
              </td>
              <td>{a.role}</td>
              <td>
                <span className={`badge ${stageClass[a.stage] ?? ''}`}>{a.stage}</span>
              </td>
              <td className="nowrap">{a.dateApplied}</td>
              <td className="nowrap">{a.lastActivity}</td>
              <td>
                {a.nextAction}
                {a.nextActionDate ? <span className="muted nowrap"> ({a.nextActionDate})</span> : null}
              </td>
              <td>{a.source}</td>
              <td className="notes" title={a.notes}>{a.notes}</td>
              <td className="nowrap actions">
                <button onClick={() => onEdit(a)} aria-label={`Edit ${a.company}`}>Edit</button>
                <button className="danger" onClick={() => a.id != null && onDelete(a.id)} aria-label={`Delete ${a.company}`}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
