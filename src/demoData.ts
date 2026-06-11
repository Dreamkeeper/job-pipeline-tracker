import type { Application } from './types';

export const demoApplications: Application[] = [
  // Active: Applied
  { company: 'Nordwind Robotics', role: 'Senior Product Manager, Autonomy', source: 'LinkedIn', stage: 'Applied', furthestStage: 'Applied', dateApplied: '2026-06-01', lastActivity: '2026-06-01', nextAction: 'Follow up with recruiter', nextActionDate: '2026-06-15' },
  { company: 'Calatrava Health', role: 'Product Manager, Connected Devices', source: 'Company site', stage: 'Applied', furthestStage: 'Applied', dateApplied: '2026-06-04', lastActivity: '2026-06-04', notes: 'Role mentions remote patient monitoring hardware, strong overlap.' },
  { company: 'Helgafell Energy', role: 'Lead Product Manager, Smart Grid', source: 'Job board', stage: 'Applied', furthestStage: 'Applied', dateApplied: '2026-06-08', lastActivity: '2026-06-08' },
  { company: 'Bruyne Audio Labs', role: 'Senior PM, Wireless Speakers', source: 'LinkedIn', stage: 'Applied', furthestStage: 'Applied', dateApplied: '2026-05-28', lastActivity: '2026-06-02', notes: 'Applied via Easy Apply, also messaged hiring manager.' },
  { company: 'Veliko Mobility', role: 'Product Lead, E-Bike Platform', source: 'Referral', link: 'https://example.com/jobs/4821', stage: 'Applied', furthestStage: 'Applied', dateApplied: '2026-06-09', lastActivity: '2026-06-10', nextAction: 'Send thank-you note to referrer', nextActionDate: '2026-06-12' },

  // Active: Screen
  { company: 'Aalto Sense', role: 'Senior Product Manager, IoT Sensors', source: 'LinkedIn', stage: 'Screen', furthestStage: 'Screen', dateApplied: '2026-05-18', lastActivity: '2026-06-05', nextAction: 'Recruiter screen call', nextActionDate: '2026-06-16', notes: 'Recruiter mentioned hiring freeze risk on adjacent teams.' },
  { company: 'Tramontane Systems', role: 'Group Product Manager, Edge Devices', source: 'Company site', stage: 'Screen', furthestStage: 'Screen', dateApplied: '2026-05-22', lastActivity: '2026-06-08' },

  // Active: Interview
  { company: 'Lindqvist Home', role: 'Head of Product, Smart Lighting', source: 'Referral', stage: 'Interview', furthestStage: 'Interview', dateApplied: '2026-04-27', lastActivity: '2026-06-09', nextAction: 'Prepare system design round', nextActionDate: '2026-06-17', notes: 'Panel of 4, includes CTO. Case study on multi-protocol pairing.' },
  { company: 'Ostrava Wearables', role: 'Senior PM, Health Tracking', source: 'Job board', link: 'https://example.com/jobs/1137', stage: 'Interview', furthestStage: 'Interview', dateApplied: '2026-05-06', lastActivity: '2026-06-10', nextAction: 'Take-home product critique', nextActionDate: '2026-06-13', notes: 'Take-home due Friday.' },

  // Offer
  { company: 'Reine Connect', role: 'Principal Product Manager, Gateways', source: 'Referral', stage: 'Offer', furthestStage: 'Offer', dateApplied: '2026-04-13', lastActivity: '2026-06-10', nextAction: 'Review offer details, counter on equity', nextActionDate: '2026-06-14', notes: 'Verbal offer received, written package expected this week.' },

  // Closed: Rejected
  { company: 'Pellegrin Optics', role: 'Product Manager, Smart Eyewear', source: 'LinkedIn', stage: 'Rejected', furthestStage: 'Applied', dateApplied: '2026-04-06', lastActivity: '2026-04-24', notes: 'Auto-rejection email, likely ATS filter.' },
  { company: 'Drava Industrial', role: 'Senior PM, Factory Automation', source: 'Job board', stage: 'Rejected', furthestStage: 'Applied', dateApplied: '2026-04-15', lastActivity: '2026-05-01' },
  { company: 'Skagen Acoustics', role: 'Product Lead, Hearables', source: 'Company site', stage: 'Rejected', furthestStage: 'Screen', dateApplied: '2026-04-20', lastActivity: '2026-05-12', notes: 'Recruiter said they went with an internal candidate.' },
  { company: 'Montfort Domotics', role: 'Senior Product Manager, Smart Locks', source: 'LinkedIn', stage: 'Rejected', furthestStage: 'Interview', dateApplied: '2026-04-08', lastActivity: '2026-05-20', notes: 'Reached final round. Feedback: wanted deeper security domain background.' },

  // Closed: Withdrawn
  { company: 'Garonne Fleet', role: 'Product Manager, Telematics', source: 'Job board', stage: 'Withdrawn', furthestStage: 'Screen', dateApplied: '2026-05-04', lastActivity: '2026-05-26', notes: 'Withdrew after learning the role is purely B2B fleet software, no device work.' },
];
