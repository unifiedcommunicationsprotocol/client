import { createContext, useReducer, useContext } from "react";
import type { ReactNode } from "react";
import type { BridgeAccount, CalEvent, DavFields, ImapFields, Keyset, KeygenKeys, MsgEntry, Note, ThreadMsg } from "./data";

export interface MsgAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface AppState {
  view: string;
  selectedThread: string | null;
  selectedContact: string | null;
  selectedNote: number | null;
  selectedChannel: string | null;
  selectedDM: string | null;
  composing: boolean;
  variant: "A" | "B";
  darkMode: boolean;
  onboardingStep: number;
  // BYOD
  byodMode: boolean;
  byodDomain: string;
  byodVerifying: boolean;
  byodVerified: boolean;
  // Email connect
  connectingProvider: string | null;
  emailConnectStep: "auth" | "connecting" | "done";
  connectedEmails: string[];
  // Reply
  replyOpen: boolean;
  replyText: string;
  replyIsForward: boolean;
  replyShowCc: boolean;
  replyShowBcc: boolean;
  replyTo: string;
  replyCc: string;
  replyBcc: string;
  // Messaging
  msgInputText: string;
  customChanMsgs: Record<string, MsgEntry[]>;
  msgShowFileModal: boolean;
  msgDragOver: boolean;
  msgPendingAttachment: MsgAttachment | null;
  // Bridge
  bridgeOauthProvider: string | null;
  bridgeOauthStep: string;
  bridgeAccountType: string;
  settingsBridgeAccounts: BridgeAccount[];
  settingsCalAccounts: BridgeAccount[];
  settingsCardAccounts: BridgeAccount[];
  imapFields: ImapFields;
  caldavFields: DavFields;
  carddavFields: DavFields;
  imapTesting: boolean;
  caldavTesting: boolean;
  carddavTesting: boolean;
  // Settings
  settingsSection: string;
  renderingMode: "blocks" | "html";
  readReceipts: boolean;
  extImages: boolean;
  notifEnabled: boolean;
  notifSound: boolean;
  notifBadge: boolean;
  // Notes
  noteEdits: Record<number, { title: string; body: string }>;
  customNotes: Note[];
  // Keys
  keygenStep: number;
  keygenKeys: KeygenKeys | null;
  keygenRevSaved: boolean;
  keygenName: string;
  keysets: Keyset[];
  activeKeysetId: string | null;
  editingKeysetId: string | null;
  editingKeysetName: string;
  // Thread
  customThreadMsgs: Record<string, ThreadMsg[]>;
  showUserMenu: boolean;
  // Calendar
  calViewType: "week" | "month";
  calWeekOffset: number;
  calSelectedEvent: string | null;
  calShowDetail: boolean;
  customCalEvents: CalEvent[];
  calCreating: boolean;
  calNewTitle: string;
  calNewDayIdx: number;
  calNewStartH: number;
  calNewEndH: number;
  calNewColor: string;
  // Revoke
  showRevokeModal: boolean;
  revokeReason: string;
  revokeConfirmText: string;
}

export type AppAction =
  | { type: "setView"; payload: string }
  | { type: "selectThread"; payload: string | null }
  | { type: "selectContact"; payload: string | null }
  | { type: "selectNote"; payload: number | null }
  | { type: "selectChannel"; payload: string }
  | { type: "selectDM"; payload: string }
  | { type: "setComposing"; payload: boolean }
  | { type: "setVariant"; payload: "A" | "B" }
  | { type: "toggleDarkMode" }
  | { type: "setOnboardingStep"; payload: number }
  | { type: "setByodMode"; payload: boolean }
  | { type: "setByodDomain"; payload: string }
  | { type: "setByodVerifying"; payload: boolean }
  | { type: "setByodVerified"; payload: boolean }
  | { type: "setConnectingProvider"; payload: string | null }
  | { type: "setEmailConnectStep"; payload: "auth" | "connecting" | "done" }
  | { type: "addConnectedEmail"; payload: string }
  | { type: "setReplyOpen"; payload: boolean }
  | { type: "setReplyText"; payload: string }
  | { type: "setReplyIsForward"; payload: boolean }
  | { type: "setReplyShowCc"; payload: boolean }
  | { type: "setReplyShowBcc"; payload: boolean }
  | { type: "setReplyTo"; payload: string }
  | { type: "setReplyCc"; payload: string }
  | { type: "setReplyBcc"; payload: string }
  | { type: "setMsgInputText"; payload: string }
  | { type: "addChanMsg"; payload: { channel: string; msg: MsgEntry } }
  | { type: "setMsgShowFileModal"; payload: boolean }
  | { type: "setMsgDragOver"; payload: boolean }
  | { type: "setMsgPendingAttachment"; payload: MsgAttachment | null }
  | { type: "setBridgeOauthProvider"; payload: string | null }
  | { type: "setBridgeOauthStep"; payload: string }
  | { type: "setBridgeAccountType"; payload: string }
  | { type: "addBridgeAccount"; payload: BridgeAccount }
  | { type: "setImapFields"; payload: ImapFields }
  | { type: "setCaldavFields"; payload: DavFields }
  | { type: "setCarddavFields"; payload: DavFields }
  | { type: "setImapTesting"; payload: boolean }
  | { type: "setCaldavTesting"; payload: boolean }
  | { type: "setCarddavTesting"; payload: boolean }
  | { type: "setSettingsSection"; payload: string }
  | { type: "setRenderingMode"; payload: "blocks" | "html" }
  | { type: "setReadReceipts"; payload: boolean }
  | { type: "setExtImages"; payload: boolean }
  | { type: "setNotifEnabled"; payload: boolean }
  | { type: "setNotifSound"; payload: boolean }
  | { type: "setNotifBadge"; payload: boolean }
  | { type: "setNoteEdits"; payload: { id: number; title: string; body: string } }
  | { type: "addCustomNote"; payload: Note }
  | { type: "setKeygenStep"; payload: number }
  | { type: "setKeygenKeys"; payload: KeygenKeys | null }
  | { type: "setKeygenRevSaved"; payload: boolean }
  | { type: "setKeygenName"; payload: string }
  | { type: "addKeyset"; payload: Keyset }
  | { type: "setActiveKeysetId"; payload: string | null }
  | { type: "setEditingKeysetId"; payload: string | null }
  | { type: "setEditingKeysetName"; payload: string }
  | { type: "addThreadMsg"; payload: { threadId: string; msg: ThreadMsg } }
  | { type: "setShowUserMenu"; payload: boolean }
  | { type: "setCalViewType"; payload: "week" | "month" }
  | { type: "setCalWeekOffset"; payload: number }
  | { type: "setCalSelectedEvent"; payload: string | null }
  | { type: "setCalShowDetail"; payload: boolean }
  | { type: "addCalEvent"; payload: CalEvent }
  | { type: "setCalCreating"; payload: boolean }
  | { type: "setCalNewTitle"; payload: string }
  | { type: "setCalNewDayIdx"; payload: number }
  | { type: "setCalNewStartH"; payload: number }
  | { type: "setCalNewEndH"; payload: number }
  | { type: "setCalNewColor"; payload: string }
  | { type: "setShowRevokeModal"; payload: boolean }
  | { type: "setRevokeReason"; payload: string }
  | { type: "setRevokeConfirmText"; payload: string }
  | { type: "revokeIdentity" };

const initialState: AppState = {
  view: "inbox",
  selectedThread: null,
  selectedContact: null,
  selectedNote: null,
  selectedChannel: "general",
  selectedDM: null,
  composing: false,
  variant: "A",
  darkMode: true,
  onboardingStep: 0,
  byodMode: false,
  byodDomain: "",
  byodVerifying: false,
  byodVerified: false,
  connectingProvider: null,
  emailConnectStep: "auth",
  connectedEmails: [],
  replyOpen: false,
  replyText: "",
  replyIsForward: false,
  replyShowCc: false,
  replyShowBcc: false,
  replyTo: "",
  replyCc: "",
  replyBcc: "",
  msgInputText: "",
  customChanMsgs: {},
  msgShowFileModal: false,
  msgDragOver: false,
  msgPendingAttachment: null,
  bridgeOauthProvider: null,
  bridgeOauthStep: "consent",
  bridgeAccountType: "email",
  settingsBridgeAccounts: [],
  settingsCalAccounts: [],
  settingsCardAccounts: [],
  imapFields: { host: "", port: "993", email: "", password: "" },
  caldavFields: { url: "", username: "", password: "" },
  carddavFields: { url: "", username: "", password: "" },
  imapTesting: false,
  caldavTesting: false,
  carddavTesting: false,
  settingsSection: "",
  renderingMode: "blocks",
  readReceipts: false,
  extImages: false,
  notifEnabled: true,
  notifSound: true,
  notifBadge: true,
  noteEdits: {},
  customNotes: [],
  keygenStep: 0,
  keygenKeys: null,
  keygenRevSaved: false,
  keygenName: "",
  keysets: [],
  activeKeysetId: null,
  editingKeysetId: null,
  editingKeysetName: "",
  customThreadMsgs: {},
  showUserMenu: false,
  calViewType: "week",
  calWeekOffset: 0,
  calSelectedEvent: null,
  calShowDetail: false,
  customCalEvents: [],
  calCreating: false,
  calNewTitle: "",
  calNewDayIdx: 0,
  calNewStartH: 9,
  calNewEndH: 10,
  calNewColor: "#6366F1",
  showRevokeModal: false,
  revokeReason: "",
  revokeConfirmText: "",
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setView":
      return { ...state, view: action.payload, selectedThread: null };
    case "selectThread":
      return { ...state, selectedThread: action.payload };
    case "selectContact":
      return { ...state, selectedContact: action.payload };
    case "selectNote":
      return { ...state, selectedNote: action.payload };
    case "selectChannel":
      return { ...state, selectedChannel: action.payload };
    case "selectDM":
      return { ...state, selectedDM: action.payload };
    case "setComposing":
      return { ...state, composing: action.payload };
    case "setVariant":
      return { ...state, variant: action.payload };
    case "toggleDarkMode":
      return { ...state, darkMode: !state.darkMode };
    case "setOnboardingStep":
      return { ...state, onboardingStep: action.payload };
    case "setByodMode":
      return { ...state, byodMode: action.payload };
    case "setByodDomain":
      return { ...state, byodDomain: action.payload };
    case "setByodVerifying":
      return { ...state, byodVerifying: action.payload };
    case "setByodVerified":
      return { ...state, byodVerified: action.payload };
    case "setConnectingProvider":
      return { ...state, connectingProvider: action.payload };
    case "setEmailConnectStep":
      return { ...state, emailConnectStep: action.payload };
    case "addConnectedEmail":
      return { ...state, connectedEmails: [...state.connectedEmails, action.payload] };
    case "setReplyOpen":
      return { ...state, replyOpen: action.payload };
    case "setReplyText":
      return { ...state, replyText: action.payload };
    case "setReplyIsForward":
      return { ...state, replyIsForward: action.payload };
    case "setReplyShowCc":
      return { ...state, replyShowCc: action.payload };
    case "setReplyShowBcc":
      return { ...state, replyShowBcc: action.payload };
    case "setReplyTo":
      return { ...state, replyTo: action.payload };
    case "setReplyCc":
      return { ...state, replyCc: action.payload };
    case "setReplyBcc":
      return { ...state, replyBcc: action.payload };
    case "setMsgInputText":
      return { ...state, msgInputText: action.payload };
    case "addChanMsg": {
      const { channel, msg } = action.payload;
      return {
        ...state,
        customChanMsgs: {
          ...state.customChanMsgs,
          [channel]: [...(state.customChanMsgs[channel] || []), msg],
        },
      };
    }
    case "setMsgShowFileModal":
      return { ...state, msgShowFileModal: action.payload };
    case "setMsgDragOver":
      return { ...state, msgDragOver: action.payload };
    case "setMsgPendingAttachment":
      return { ...state, msgPendingAttachment: action.payload };
    case "setBridgeOauthProvider":
      return { ...state, bridgeOauthProvider: action.payload };
    case "setBridgeOauthStep":
      return { ...state, bridgeOauthStep: action.payload };
    case "setBridgeAccountType":
      return { ...state, bridgeAccountType: action.payload };
    case "addBridgeAccount":
      return { ...state, settingsBridgeAccounts: [...state.settingsBridgeAccounts, action.payload] };
    case "setImapFields":
      return { ...state, imapFields: action.payload };
    case "setCaldavFields":
      return { ...state, caldavFields: action.payload };
    case "setCarddavFields":
      return { ...state, carddavFields: action.payload };
    case "setImapTesting":
      return { ...state, imapTesting: action.payload };
    case "setCaldavTesting":
      return { ...state, caldavTesting: action.payload };
    case "setCarddavTesting":
      return { ...state, carddavTesting: action.payload };
    case "setSettingsSection":
      return { ...state, settingsSection: action.payload };
    case "setRenderingMode":
      return { ...state, renderingMode: action.payload };
    case "setReadReceipts":
      return { ...state, readReceipts: action.payload };
    case "setExtImages":
      return { ...state, extImages: action.payload };
    case "setNotifEnabled":
      return { ...state, notifEnabled: action.payload };
    case "setNotifSound":
      return { ...state, notifSound: action.payload };
    case "setNotifBadge":
      return { ...state, notifBadge: action.payload };
    case "setNoteEdits": {
      const { id, title, body } = action.payload;
      return {
        ...state,
        noteEdits: { ...state.noteEdits, [id]: { title, body } },
      };
    }
    case "addCustomNote":
      return { ...state, customNotes: [...state.customNotes, action.payload] };
    case "setKeygenStep":
      return { ...state, keygenStep: action.payload };
    case "setKeygenKeys":
      return { ...state, keygenKeys: action.payload };
    case "setKeygenRevSaved":
      return { ...state, keygenRevSaved: action.payload };
    case "setKeygenName":
      return { ...state, keygenName: action.payload };
    case "addKeyset":
      return { ...state, keysets: [...state.keysets, action.payload] };
    case "setActiveKeysetId":
      return { ...state, activeKeysetId: action.payload };
    case "setEditingKeysetId":
      return { ...state, editingKeysetId: action.payload };
    case "setEditingKeysetName":
      return { ...state, editingKeysetName: action.payload };
    case "addThreadMsg": {
      const { threadId, msg } = action.payload;
      return {
        ...state,
        customThreadMsgs: {
          ...state.customThreadMsgs,
          [threadId]: [...(state.customThreadMsgs[threadId] || []), msg],
        },
      };
    }
    case "setShowUserMenu":
      return { ...state, showUserMenu: action.payload };
    case "setCalViewType":
      return { ...state, calViewType: action.payload };
    case "setCalWeekOffset":
      return { ...state, calWeekOffset: action.payload };
    case "setCalSelectedEvent":
      return { ...state, calSelectedEvent: action.payload };
    case "setCalShowDetail":
      return { ...state, calShowDetail: action.payload };
    case "addCalEvent":
      return { ...state, customCalEvents: [...state.customCalEvents, action.payload] };
    case "setCalCreating":
      return { ...state, calCreating: action.payload };
    case "setCalNewTitle":
      return { ...state, calNewTitle: action.payload };
    case "setCalNewDayIdx":
      return { ...state, calNewDayIdx: action.payload };
    case "setCalNewStartH":
      return { ...state, calNewStartH: action.payload };
    case "setCalNewEndH":
      return { ...state, calNewEndH: action.payload };
    case "setCalNewColor":
      return { ...state, calNewColor: action.payload };
    case "setShowRevokeModal":
      return { ...state, showRevokeModal: action.payload };
    case "setRevokeReason":
      return { ...state, revokeReason: action.payload };
    case "setRevokeConfirmText":
      return { ...state, revokeConfirmText: action.payload };
    case "revokeIdentity":
      return {
        ...state,
        keysets: [],
        activeKeysetId: null,
        showRevokeModal: false,
        revokeReason: "",
        revokeConfirmText: "",
      };
    default:
      return state;
  }
}

export interface AppContextType {
  state: AppState;
  dispatch: (action: AppAction) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
