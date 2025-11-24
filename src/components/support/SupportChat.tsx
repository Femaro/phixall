'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, addDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant' | 'agent';
  text: string;
  createdAt?: Date;
};

type SupportChatProps = {
  user: User | null;
  role: 'client' | 'Phixer';
};

export function SupportChat({ user, role }: SupportChatProps) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string>('bot');
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const sessionKey = useMemo(() => (role && user?.uid ? `support_session_${role}_${user.uid}` : null), [role, user]);

  useEffect(() => {
    if (!user || !sessionKey) return;
    const existing = localStorage.getItem(sessionKey);
    if (existing) {
      setSessionId(existing);
      return;
    }

    const createSession = async () => {
      try {
        const { db } = getFirebase();
        const sessionRef = doc(collection(db, 'support_sessions'));
        await setDoc(sessionRef, {
          userId: user.uid,
          role,
          status: 'bot',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        localStorage.setItem(sessionKey, sessionRef.id);
        setSessionId(sessionRef.id);
      } catch (err) {
        console.error('Failed to create support session', err);
      }
    };

    createSession();
  }, [role, user, sessionKey]);

  useEffect(() => {
    if (!sessionId) return;
    const { db } = getFirebase();
    const messagesRef = collection(db, 'support_sessions', sessionId, 'messages');
    const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'asc')), (snapshot) => {
      const nextMessages: ChatMessage[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          sender: data.sender,
          text: data.text,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      });
      setMessages(nextMessages);
      if (messagesContainerRef.current) {
        requestAnimationFrame(() => {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        });
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const { db } = getFirebase();
    const sessionRef = doc(db, 'support_sessions', sessionId);
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.status) {
        setSessionStatus(data.status);
      }
    });
    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || !user) return;
    setLoading(true);
    setError(null);
    const text = input.trim();
    setInput('');
    try {
      const { db } = getFirebase();
      const messagesRef = collection(db, 'support_sessions', sessionId, 'messages');
      await addDoc(messagesRef, {
        sender: 'user',
        text,
        createdAt: serverTimestamp(),
      });

      const historyPayload = messages.slice(-8).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.createdAt?.toISOString() ?? new Date().toISOString(),
      }));

      const response = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, role, message: text, history: historyPayload }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Support bot is unavailable. Please try again.');
      } else {
        await addDoc(messagesRef, {
          sender: 'assistant',
          text: data.reply,
          createdAt: serverTimestamp(),
          metadata: {
            followUp: data.followUp,
            escalationRecommended: data.escalationRecommended,
          },
        });

        if (data.escalationRecommended) {
          await updateDoc(doc(db, 'support_sessions', sessionId), {
            status: 'pending-agent',
            escalationRequested: true,
            updatedAt: serverTimestamp(),
          });
          await addDoc(collection(db, 'support_notifications'), {
            sessionId,
            userId: user.uid,
            role,
            type: 'escalation',
            message: 'Assistant requested a live agent',
            createdAt: serverTimestamp(),
            read: false,
          });
        } else {
          await updateDoc(doc(db, 'support_sessions', sessionId), {
            status: 'bot',
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (err) {
      console.error('Support chat error', err);
      setError('Unable to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
      >
        💬 Support
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:justify-end sm:p-6">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] sm:max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Phixall Support</p>
                <p className="text-xs text-neutral-500">AI assistant + live agent handoff</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-neutral-500 transition hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <div
              className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
              ref={messagesContainerRef}
            >
              {messages.length === 0 && (
                <p className="text-sm text-neutral-500">Start a conversation and we’ll be happy to help.</p>
              )}
              {sessionStatus === 'pending-agent' && (
                <p className="text-xs font-medium text-amber-600">A live agent has been requested—please hold on.</p>
              )}
              {sessionStatus === 'agent' && (
                <p className="text-xs font-medium text-blue-600">A live agent has joined the chat.</p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  } text-sm`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white'
                        : msg.sender === 'agent'
                          ? 'bg-brand-100 text-brand-900 border border-brand-200'
                          : 'bg-white text-neutral-800 border border-neutral-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-1 text-[10px] uppercase tracking-wide ${
                        msg.sender === 'user' ? 'text-white/80' : 'text-neutral-400'
                      }`}
                    >
                      {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="border-t border-neutral-200 px-4 py-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="Type your message..."
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!sessionId || !user) return;
                    const { db } = getFirebase();
                    try {
                      await updateDoc(doc(db, 'support_sessions', sessionId), {
                        status: 'pending-agent',
                        escalationRequested: true,
                        updatedAt: serverTimestamp(),
                      });
                      await addDoc(collection(db, 'support_notifications'), {
                        sessionId,
                        userId: user.uid,
                        role,
                        type: 'escalation',
                        message: 'User requested a live agent',
                        createdAt: serverTimestamp(),
                        read: false,
                      });
                      setError('A live agent will join shortly.');
                    } catch (err) {
                      console.error('Failed to escalate support session', err);
                      setError('Unable to request a live agent right now.');
                    }
                  }}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                >
                  Need a human?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


