'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getFirebase } from '@/lib/firebaseClient';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  where,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

type SupportSession = {
  id: string;
  userId: string;
  role: 'client' | 'artisan' | 'admin';
  status: string;
  updatedAt?: Date;
  createdAt?: Date;
  firstAgentResponseAt?: Date;
  resolvedAt?: Date;
};

type SupportMessage = {
  id: string;
  sender: 'user' | 'assistant' | 'agent';
  text: string;
  createdAt?: Date;
};

type SupportNotification = {
  id: string;
  sessionId: string;
  message: string;
  type: string;
  createdAt?: Date;
};

type ArticleForm = {
  title: string;
  content: string;
  tags: string;
  priority: string;
  roles: Record<'client' | 'artisan' | 'admin' | 'general', boolean>;
};

type SupportArticleItem = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  roles: string[];
  priority?: number;
};

type SupportMacro = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

export default function AdminSupportPage() {
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [articles, setArticles] = useState<SupportArticleItem[]>([]);
  const [macros, setMacros] = useState<SupportMacro[]>([]);
  const [savingArticle, setSavingArticle] = useState(false);
  const [savingMacro, setSavingMacro] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [agentOnline, setAgentOnline] = useState(false);
  const [onlineAgents, setOnlineAgents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<SupportNotification[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const createRoleTemplate = () => ({
    client: false,
    artisan: false,
    admin: false,
    general: true,
  });

  const [articleForm, setArticleForm] = useState<ArticleForm>({
    title: '',
    content: '',
    tags: '',
    priority: '1',
    roles: createRoleTemplate(),
  });

  const [macroForm, setMacroForm] = useState({
    title: '',
    body: '',
    tags: '',
  });

  useEffect(() => {
    const { auth, db } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.location.href = '/login';
          return;
        }
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (!profileDoc.exists() || profileDoc.data()?.role !== 'admin') {
          alert('Access denied. Admins only.');
          window.location.href = '/';
          return;
        }
        setCurrentUser(user);
        setAuthLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    const { db } = getFirebase();
    const sessionsRef = collection(db, 'support_sessions');
    const unsubscribe = onSnapshot(
      query(
        sessionsRef,
        where('status', 'in', ['pending-agent', 'agent', 'bot', 'resolved']),
        orderBy('updatedAt', 'desc')
      ),
      (snapshot) => {
        const next: SupportSession[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId,
            role: data.role,
            status: data.status,
            updatedAt: data.updatedAt?.toDate?.(),
            createdAt: data.createdAt?.toDate?.(),
            firstAgentResponseAt: data.firstAgentResponseAt?.toDate?.(),
            resolvedAt: data.resolvedAt?.toDate?.(),
          };
        });
        setSessions(next);
        if (selectedSession) {
          const stillExists = next.find((session) => session.id === selectedSession.id);
          if (!stillExists) {
            setSelectedSession(null);
            setMessages([]);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [selectedSession]);

  useEffect(() => {
    const { db } = getFirebase();
    const articlesRef = collection(db, 'support_articles');
    const unsubscribe = onSnapshot(query(articlesRef, orderBy('updatedAt', 'desc')), (snapshot) => {
      const next: SupportArticleItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          roles: data.roles || [data.role || 'general'],
          priority: data.priority,
        };
      });
      setArticles(next);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const { db } = getFirebase();
    const macrosRef = collection(db, 'support_macros');
    const unsubscribe = onSnapshot(query(macrosRef, orderBy('updatedAt', 'desc')), (snapshot) => {
      const next: SupportMacro[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          body: data.body,
          tags: data.tags || [],
        };
      });
      setMacros(next);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    const { db } = getFirebase();
    const messagesRef = collection(db, 'support_sessions', selectedSession.id, 'messages');
    const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'asc')), (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          sender: data.sender,
          text: data.text,
          createdAt: data.createdAt?.toDate?.(),
        } as SupportMessage;
      });
      setMessages(next);
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
  }, [selectedSession]);

  useEffect(() => {
    if (!currentUser) return;
    const { db } = getFirebase();
    const agentRef = doc(db, 'support_agents', currentUser.uid);
    const unsubscribe = onSnapshot(agentRef, (snapshot) => {
      const data = snapshot.data();
      setAgentOnline(Boolean(data?.online));
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const { db } = getFirebase();
    const onlineQuery = query(collection(db, 'support_agents'), where('online', '==', true));
    const unsubscribe = onSnapshot(onlineQuery, (snapshot) => {
      const names = snapshot.docs.map((docSnap) => docSnap.data().displayName || 'Agent');
      setOnlineAgents(names);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const { db } = getFirebase();
    const notificationsRef = collection(db, 'support_notifications');
    const unsubscribe = onSnapshot(query(notificationsRef, orderBy('createdAt', 'desc')), (snapshot) => {
      const items: SupportNotification[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          sessionId: data.sessionId,
          message: data.message,
          type: data.type || 'info',
          createdAt: data.createdAt?.toDate?.(),
        };
      });
      setNotifications(items);
    });
    return () => unsubscribe();
  }, []);

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedSession) return;
    setSending(true);
    try {
      const { db } = getFirebase();
      const messagesRef = collection(db, 'support_sessions', selectedSession.id, 'messages');
      await addDoc(messagesRef, {
        sender: 'agent',
        text: reply.trim(),
        createdAt: serverTimestamp(),
      });
      const sessionRef = doc(db, 'support_sessions', selectedSession.id);
      const updates: Record<string, unknown> = {
        status: 'agent',
        updatedAt: serverTimestamp(),
        lastAgentMessageAt: serverTimestamp(),
      };
      if (!selectedSession.firstAgentResponseAt) {
        updates.firstAgentResponseAt = serverTimestamp();
      }
      await updateDoc(sessionRef, updates);
      setReply('');
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSending(false);
    }
  };

  const roleOptions: Array<{ id: keyof ArticleForm['roles']; label: string }> = [
    { id: 'client', label: 'Clients' },
    { id: 'artisan', label: 'Artisans' },
    { id: 'admin', label: 'Admins' },
    { id: 'general', label: 'General' },
  ];

  const resetArticleForm = () =>
    setArticleForm({
      title: '',
      content: '',
      tags: '',
      priority: '1',
      roles: createRoleTemplate(),
    });

  const handleCreateArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) return;
    setSavingArticle(true);
    try {
      const { db } = getFirebase();
      const roles = Object.entries(articleForm.roles)
        .filter(([, value]) => value)
        .map(([role]) => role);
      await addDoc(collection(db, 'support_articles'), {
        title: articleForm.title.trim(),
        content: articleForm.content.trim(),
        tags: articleForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        roles: roles.length ? roles : ['general'],
        priority: Number(articleForm.priority) || 0,
        updatedAt: serverTimestamp(),
      });
      resetArticleForm();
    } catch (error) {
      console.error('Failed to add article', error);
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!articleId) return;
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'support_articles', articleId));
    } catch (error) {
      console.error('Failed to delete article', error);
    }
  };

  const resetMacroForm = () =>
    setMacroForm({
      title: '',
      body: '',
      tags: '',
    });

  const handleCreateMacro = async () => {
    if (!macroForm.title.trim() || !macroForm.body.trim()) return;
    setSavingMacro(true);
    try {
      const { db } = getFirebase();
      await addDoc(collection(db, 'support_macros'), {
        title: macroForm.title.trim(),
        body: macroForm.body.trim(),
        tags: macroForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        updatedAt: serverTimestamp(),
      });
      resetMacroForm();
    } catch (error) {
      console.error('Failed to add macro', error);
    } finally {
      setSavingMacro(false);
    }
  };

  const handleDeleteMacro = async (macroId: string) => {
    if (!macroId) return;
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'support_macros', macroId));
    } catch (error) {
      console.error('Failed to delete macro', error);
    }
  };

  const insertMacro = (body: string) => {
    setReply((prev) => (prev ? `${prev.trim()}\n\n${body}` : body));
  };

  const toggleAgentStatus = async () => {
    if (!currentUser) return;
    try {
      const { db } = getFirebase();
      await setDoc(
        doc(db, 'support_agents', currentUser.uid),
        {
          online: !agentOnline,
          updatedAt: serverTimestamp(),
          displayName: currentUser.displayName || currentUser.email || 'Admin',
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to toggle agent availability', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'support_notifications', notificationId));
    } catch (error) {
      console.error('Failed to dismiss notification', error);
    }
  };

  const resolveSession = async () => {
    if (!selectedSession) return;
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'support_sessions', selectedSession.id), {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedSession(null);
      setMessages([]);
    } catch (error) {
      console.error('Failed to resolve session', error);
    }
  };

  const analytics = useMemo(() => {
    if (!sessions.length) {
      return {
        total: 0,
        pending: 0,
        resolved: 0,
        avgFirstResponse: 0,
        avgResolution: 0,
      };
    }
    const pending = sessions.filter((s) => s.status === 'pending-agent').length;
    const resolved = sessions.filter((s) => s.status === 'resolved').length;
    const firstResponseTimes = sessions
      .filter((s) => s.firstAgentResponseAt && s.createdAt)
      .map((s) => (s.firstAgentResponseAt!.getTime() - s.createdAt!.getTime()) / 60000);
    const resolutionTimes = sessions
      .filter((s) => s.resolvedAt && s.createdAt)
      .map((s) => (s.resolvedAt!.getTime() - s.createdAt!.getTime()) / 60000);
    return {
      total: sessions.length,
      pending,
      resolved,
      avgFirstResponse: firstResponseTimes.length
        ? Math.round((firstResponseTimes.reduce((sum, val) => sum + val, 0) / firstResponseTimes.length) * 10) / 10
        : 0,
      avgResolution: resolutionTimes.length
        ? Math.round((resolutionTimes.reduce((sum, val) => sum + val, 0) / resolutionTimes.length) * 10) / 10
        : 0,
    };
  }, [sessions]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-600">Loading support console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm lg:w-1/3 lg:max-h-[75vh]">
          <div className="flex flex-col gap-2 border-b border-neutral-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-neutral-900">Support Queue</h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAgentStatus}
                  disabled={!currentUser}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold text-white ${
                    agentOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-500 hover:bg-neutral-600'
                  }`}
                >
                  {agentOnline ? 'Go Offline' : 'Go Online'}
                </button>
                <Link href="/admin/dashboard" className="text-xs font-medium text-brand-600 hover:underline">
                  ← Back
                </Link>
              </div>
            </div>
            <p className="text-xs text-neutral-500">
              Online agents: {onlineAgents.length ? onlineAgents.join(', ') : 'None'}
            </p>
          </div>
          <div className="max-h-[70vh] space-y-2 overflow-y-auto p-4">
            {sessions.length === 0 && (
              <p className="text-sm text-neutral-500">No open sessions. All caught up!</p>
            )}
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => setSelectedSession(session)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selectedSession?.id === session.id
                    ? 'border-brand-200 bg-brand-50 text-brand-900'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize">{session.role}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      session.status === 'pending-agent'
                        ? 'bg-amber-100 text-amber-700'
                        : session.status === 'agent'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Updated {session.updatedAt?.toLocaleString() || '—'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm lg:w-2/3 lg:max-h-[75vh]">
          {selectedSession ? (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b border-neutral-200 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">Conversation</p>
                <p className="text-xs text-neutral-500">Session ID: {selectedSession.id}</p>
              </div>
              <div
                className="flex-1 space-y-3 overflow-y-auto px-4 py-3 bg-neutral-50"
                ref={messagesContainerRef}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'} text-sm`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-white text-neutral-900 border border-neutral-200'
                          : msg.sender === 'assistant'
                            ? 'bg-brand-50 text-brand-900 border border-brand-100'
                            : 'bg-brand-600 text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                        {msg.sender}
                      </div>
                      <p className="mt-1 leading-relaxed">{msg.text}</p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 px-4 py-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Type your reply…"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={sending || !reply.trim()}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? 'Sending…' : 'Send Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={resolveSession}
                    disabled={!selectedSession || selectedSession.status === 'resolved'}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mark Resolved
                  </button>
                </div>
                {macros.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-neutral-500">Quick macros</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {macros.slice(0, 6).map((macro) => (
                        <button
                          key={macro.id}
                          type="button"
                          onClick={() => insertMacro(macro.body)}
                          className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          {macro.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="text-4xl">💬</div>
              <p className="text-sm text-neutral-600">Select a session to view messages.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Knowledge Base</h2>
              <p className="text-xs text-neutral-500">Articles served to the AI assistant</p>
            </div>
            <span className="text-xs text-neutral-500">{articles.length} articles</span>
          </div>
          <div className="mt-4 max-h-60 space-y-3 overflow-y-auto">
            {articles.length === 0 && <p className="text-sm text-neutral-500">No articles yet.</p>}
            {articles.map((article) => (
              <div key={article.id} className="rounded-xl border border-neutral-200 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-neutral-900">{article.title}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(article.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-1 line-clamp-2 text-neutral-600">{article.content}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <input
              type="text"
              value={articleForm.title}
              onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
              placeholder="Article title"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <textarea
              value={articleForm.content}
              onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
              placeholder="Content / guidance"
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <input
              type="text"
              value={articleForm.tags}
              onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <div className="flex flex-wrap gap-3 text-xs">
              {roleOptions.map((role) => (
                <label key={role.id} className="flex items-center gap-1 text-neutral-600">
                  <input
                    type="checkbox"
                    checked={articleForm.roles[role.id]}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        roles: { ...articleForm.roles, [role.id]: e.target.checked },
                      })
                    }
                  />
                  {role.label}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={articleForm.priority}
                onChange={(e) => setArticleForm({ ...articleForm, priority: e.target.value })}
                className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="Priority"
              />
              <button
                type="button"
                onClick={handleCreateArticle}
                disabled={savingArticle}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {savingArticle ? 'Saving…' : 'Add article'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Agent Macros</h2>
              <p className="text-xs text-neutral-500">Reusable snippets for faster replies</p>
            </div>
            <span className="text-xs text-neutral-500">{macros.length} macros</span>
          </div>

          <div className="mt-4 max-h-60 space-y-3 overflow-y-auto">
            {macros.length === 0 && <p className="text-sm text-neutral-500">No macros yet.</p>}
            {macros.map((macro) => (
              <div key={macro.id} className="rounded-xl border border-neutral-200 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-neutral-900">{macro.title}</p>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => insertMacro(macro.body)}
                      className="text-brand-600 hover:underline"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMacro(macro.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 text-neutral-600">{macro.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <input
              type="text"
              value={macroForm.title}
              onChange={(e) => setMacroForm({ ...macroForm, title: e.target.value })}
              placeholder="Macro title"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <textarea
              value={macroForm.body}
              onChange={(e) => setMacroForm({ ...macroForm, body: e.target.value })}
              placeholder="Macro body"
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <input
              type="text"
              value={macroForm.tags}
              onChange={(e) => setMacroForm({ ...macroForm, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={handleCreateMacro}
              disabled={savingMacro}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingMacro ? 'Saving…' : 'Add macro'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Live Notifications</h2>
              <p className="text-xs text-neutral-500">New escalations and alerts</p>
            </div>
            <span className="text-xs text-neutral-500">{notifications.length} open</span>
          </div>
          <div className="mt-4 max-h-60 space-y-3 overflow-y-auto">
            {notifications.length === 0 && <p className="text-sm text-neutral-500">All quiet for now.</p>}
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-xl border border-neutral-200 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold capitalize text-neutral-900">{notification.type}</p>
                  <span className="text-xs text-neutral-500">
                    {notification.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '—'}
                  </span>
                </div>
                <p className="mt-1 text-neutral-700">{notification.message}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const target = sessions.find((session) => session.id === notification.sessionId);
                      if (target) {
                        setSelectedSession(target);
                      }
                    }}
                    className="rounded-lg border border-brand-200 px-3 py-1 font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    View session
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissNotification(notification.id)}
                    className="rounded-lg border border-neutral-200 px-3 py-1 font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Support Analytics</h2>
          <p className="text-xs text-neutral-500">Realtime service-level indicators</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Open Sessions</p>
              <p className="text-2xl font-semibold text-neutral-900">{analytics.total}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Pending Escalations</p>
              <p className="text-2xl font-semibold text-amber-700">{analytics.pending}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <p className="text-xs text-green-700">Resolved Today</p>
              <p className="text-2xl font-semibold text-green-700">{analytics.resolved}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Avg First Response</p>
              <p className="text-2xl font-semibold text-neutral-900">{analytics.avgFirstResponse} min</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Avg Resolution</p>
              <p className="text-2xl font-semibold text-neutral-900">{analytics.avgResolution} min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

