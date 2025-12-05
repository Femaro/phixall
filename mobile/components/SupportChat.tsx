import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthState } from '@/hooks/useAuthState';
import { getFirebase } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'agent';
  text: string;
  createdAt: any;
}

interface SupportChatProps {
  role: 'client' | 'Phixer' | 'artisan';
}

export function SupportChat({ role }: SupportChatProps) {
  const { user } = useAuthState();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string>('bot');
  const scrollViewRef = useRef<ScrollView>(null);

  // Create or get session
  useEffect(() => {
    if (!user) return;

    const createOrGetSession = async () => {
      try {
        const { db } = getFirebase();
        
        // Check for existing session
        const sessionsQuery = query(
          collection(db, 'support_sessions'),
          orderBy('updatedAt', 'desc')
        );
        
        const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
          const userSessions = snapshot.docs.filter(
            (doc) => doc.data().userId === user.uid && doc.data().role === role
          );
          
          if (userSessions.length > 0) {
            const latestSession = userSessions[0];
            setSessionId(latestSession.id);
            setSessionStatus(latestSession.data().status || 'bot');
          } else {
            // Create new session
            const sessionRef = doc(collection(db, 'support_sessions'));
            setDoc(sessionRef, {
              userId: user.uid,
              role,
              status: 'bot',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setSessionId(sessionRef.id);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Failed to create support session', err);
        setError('Failed to initialize support chat');
      }
    };

    createOrGetSession();
  }, [user, role]);

  // Load messages
  useEffect(() => {
    if (!sessionId) return;

    const { db } = getFirebase();
    const messagesRef = collection(db, 'support_sessions', sessionId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(messagesData);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || !user || loading) return;

    setLoading(true);
    setError(null);
    const text = input.trim();
    setInput('');

    try {
      const { db } = getFirebase();
      const messagesRef = collection(db, 'support_sessions', sessionId, 'messages');

      // Add user message
      await addDoc(messagesRef, {
        sender: 'user',
        text,
        createdAt: serverTimestamp(),
      });

      // Update session
      await updateDoc(doc(db, 'support_sessions', sessionId), {
        updatedAt: serverTimestamp(),
      });

      // Prepare history for API
      const historyPayload = messages.slice(-8).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }));

      // Call support API
      const response = await fetch('https://phixall.com/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          role,
          message: text,
          history: historyPayload,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to send message');
        return;
      }

      // Add bot response
      await addDoc(messagesRef, {
        sender: 'assistant',
        text: data.reply || 'I apologize, but I encountered an error. Please try again.',
        createdAt: serverTimestamp(),
      });

      // Check if escalation is recommended
      if (data.escalationRecommended) {
        await updateDoc(doc(db, 'support_sessions', sessionId), {
          status: 'pending-agent',
          updatedAt: serverTimestamp(),
        });
        setSessionStatus('pending-agent');
      }
    } catch (err) {
      console.error('Support chat error', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.floatingButtonText}>💬</Text>
        {sessionStatus === 'pending-agent' && (
          <View style={styles.badge} />
        )}
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Phixall Support</Text>
                <Text style={styles.headerSubtitle}>
                  {sessionStatus === 'pending-agent'
                    ? 'Agent requested - waiting for response'
                    : sessionStatus === 'agent-joined'
                    ? 'Agent is here to help'
                    : 'AI assistant + live agent handoff'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    Start a conversation and we'll be happy to help.
                  </Text>
                </View>
              )}
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.sender === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
                </View>
              ))}
              {loading && (
                <View style={[styles.messageContainer, styles.botMessage]}>
                  <ActivityIndicator size="small" color="#2563EB" />
                </View>
              )}
            </ScrollView>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#DBEAFE',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

