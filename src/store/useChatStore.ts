import {create} from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
}

export interface ChatThread {
  id: string;
  productId: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  messages: Message[];
  unreadCount: number;
}

interface ChatState {
  threads: ChatThread[];
  activeThreadId: string | null;
  setThreads: (threads: ChatThread[]) => void;
  setActiveThread: (id: string) => void;
  addMessage: (threadId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  threads: [],
  activeThreadId: null,
  setThreads: (threads) => set({ threads }),
  setActiveThread: (id) => set({ activeThreadId: id }),
  addMessage: (threadId, message) => set((state) => ({
    threads: state.threads.map(t => 
      t.id === threadId ? { ...t, messages: [...t.messages, message] } : t
    )
  })),
}));
