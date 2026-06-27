export interface ThreadMsg {
  id: string;
  from: string;
  to?: string;
  cc?: string;
  timestamp: string;
  subject: string;
  body: string;
  encrypted: boolean;
}

export interface MsgEntry {
  id: string;
  from: string;
  timestamp: string;
  body: string;
}

export interface CalEvent {
  id: string;
  title: string;
  date: string;
  startH: number;
  endH: number;
  color: string;
}

export interface Note {
  id: number;
  title: string;
  body: string;
  pinned: boolean;
}

export interface BridgeAccount {
  id: string;
  name: string;
  provider: string;
  email: string;
}

export interface Keyset {
  id: string;
  name: string;
  created: string;
  rotation: string;
  status: 'active' | 'retired';
}

export interface KeygenKeys {
  signing: string;
  revocation: string;
}

export interface ImapFields {
  host: string;
  port: string;
  email: string;
  password: string;
}

export interface DavFields {
  url: string;
  username: string;
  password: string;
}

export const THREADS = [
  {
    id: "1",
    from: "Sarah Chen",
    subject: "Q3 Research Collaboration Proposal",
    preview: "Following up on our call last week. I've been thinking more about the distributed consensus angles...",
    timestamp: "Jun 16, 10:24 AM",
    unread: 1,
    avatar: "SC",
    avatarColor: "#6366F1",
  },
  {
    id: "2",
    from: "GitHub",
    subject: "[relay/core] PR #42: WebTransport",
    preview: "cheriko opened a pull request. A comprehensive approach to WebTransport...",
    timestamp: "9:15 AM",
    unread: 0,
    avatar: "G",
    avatarColor: "#EA4335",
  },
  {
    id: "3",
    from: "scheduler-age...",
    subject: "Suggested: Focus block Fri 2-...",
    preview: "Based on your email patterns, I've...",
    timestamp: "8:50 AM",
    unread: 0,
    avatar: "S",
    avatarColor: "#9333EA",
  },
  {
    id: "4",
    from: "Miguel Torr...",
    subject: "Dinner this Saturday?",
    preview: "Hey! Thinking of setting a group...",
    timestamp: "Yesterday",
    unread: 1,
    avatar: "MT",
    avatarColor: "#0EA5E9",
  },
  {
    id: "5",
    from: "Relay Securi...",
    subject: "Signing key rotation in 7 days",
    preview: "Your current signing key (sk_a3f...",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "R",
    avatarColor: "#22C55E",
  },
  {
    id: "6",
    from: "Fastmail",
    subject: "Storage limit update",
    preview: "We're excited to let you know about...",
    timestamp: "Mon",
    unread: 0,
    avatar: "F",
    avatarColor: "#FBBF24",
  },
];

export const THREAD_MSGS: Record<string, ThreadMsg[]> = {
  "1": [
    {
      id: "1-1",
      from: "Sarah Chen",
      to: "you@relay.im",
      timestamp: "Jun 16, 10:24 AM",
      subject: "Q3 Research Collaboration Proposal",
      body: "Following up on our call last week. I've been thinking more about the distributed consensus angles we discussed.\n\nI found a paper that might be relevant: \"Byzantine Fault Tolerance in Asynchronous Networks\" (2023). It addresses some of the scalability concerns we mentioned.\n\nWould you be interested in collaborating on a research proposal? I think we could have something interesting to submit to the next conference cycle.",
      encrypted: true,
    },
  ],
  "2": [
    {
      id: "2-1",
      from: "GitHub Notifications",
      to: "you@relay.im",
      timestamp: "9:15 AM",
      subject: "[relay/core] PR #42: WebTransport",
      body: "cheriko opened a pull request on relay/core:\n\nPR #42: WebTransport\n\nA comprehensive approach to WebTransport implementation, including fallback to HTTP/2 for older clients. The changes include:\n\n• New transport layer abstraction\n• WebTransport connection pooling\n• Automatic fallback mechanism\n• Performance benchmarks\n\nReady for review.",
      encrypted: false,
    },
  ],
};

export const CONTACTS = [
  { id: "1", name: "Sarah Chen", handle: "sarah@relay.im", onRelay: true, initials: "SC", color: "#6366F1" },
  { id: "2", name: "Alex Johnson", handle: "alex@example.com", onRelay: true, initials: "AJ", color: "#EA4335" },
  { id: "3", name: "Maya Patel", handle: "maya@relay.im", onRelay: true, initials: "MP", color: "#9333EA" },
  { id: "4", name: "David Lee", handle: "david@acme.com", onRelay: false, initials: "DL", color: "#0EA5E9" },
  { id: "5", name: "Emma Wilson", handle: "emma@company.io", onRelay: true, initials: "EW", color: "#22C55E" },
  { id: "6", name: "Frank Brown", handle: "frank@relay.im", onRelay: false, initials: "FB", color: "#FBBF24" },
];

export const NOTES: Note[] = [
  {
    id: 1,
    title: "Q3 Planning Notes",
    body: "Quarterly objectives and key results. Focus on distributed systems research and protocol improvements.",
    pinned: true,
  },
  {
    id: 2,
    title: "Conference Talk Ideas",
    body: "Talk proposal for IETF 120: Next-generation email protocols. Time: 30 min. Abstract due: Sept 1.",
    pinned: true,
  },
  {
    id: 3,
    title: "Reading List",
    body: "Papers to review this month:\n- Byzantine Fault Tolerance in Asynchronous Networks\n- HPKE and Modern Cryptography\n- MLS Group Operations",
    pinned: false,
  },
  {
    id: 4,
    title: "Meeting with Steering Committee",
    body: "June 28, 2pm. Topics: roadmap approval, funding discussion, resource allocation.",
    pinned: false,
  },
  {
    id: 5,
    title: "Code Review Checklist",
    body: "Before merging:\n- All tests pass\n- No breaking changes\n- Documentation updated\n- Security review complete",
    pinned: false,
  },
];

export const CAL_EVENTS: CalEvent[] = [
  { id: "e1", title: "Project Kickoff", date: "2026-06-28", startH: 10, endH: 11, color: "#6366F1" },
  { id: "e2", title: "1:1 with Sarah", date: "2026-06-28", startH: 14, endH: 14.5, color: "#EA4335" },
  { id: "e3", title: "Team Standup", date: "2026-06-29", startH: 9, endH: 9.5, color: "#22C55E" },
  { id: "e4", title: "Protocol Design Review", date: "2026-06-29", startH: 15, endH: 16.5, color: "#F59E0B" },
  { id: "e5", title: "Conference Planning", date: "2026-06-30", startH: 13, endH: 14, color: "#8B5CF6" },
];

export const MSG_CHANNELS = [
  { id: "general", name: "general", members: 124 },
  { id: "engineering", name: "engineering", members: 42 },
  { id: "protocol-spec", name: "protocol-spec", members: 18 },
];

export const MSG_DMS = [
  { id: "dm-1", name: "Sarah Chen", avatar: "SC", color: "#6366F1" },
  { id: "dm-2", name: "Miguel Torres", avatar: "MT", color: "#0EA5E9" },
];

export const DEFAULT_BRIDGE_ACCOUNTS: BridgeAccount[] = [
  { id: "b1", name: "Gmail", provider: "google", email: "user@gmail.com" },
];

export const DEFAULT_KEYSETS: Keyset[] = [
  {
    id: "ks-primary",
    name: "Primary Key",
    created: "2026-01-15",
    rotation: "2026-04-15",
    status: "active",
  },
];
