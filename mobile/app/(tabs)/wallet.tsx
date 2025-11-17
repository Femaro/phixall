import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, onSnapshot, collection, query, where, onSnapshot as onQuerySnapshot, orderBy } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  description: string;
  status: string;
  createdAt: any;
}

export default function WalletScreen() {
  const { user } = useAuthState();
  const [wallet, setWallet] = useState({ balance: 0, totalDeposits: 0, totalSpent: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();

    // Load wallet
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubscribeWallet = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setWallet({
          balance: data.balance || 0,
          totalDeposits: data.totalDeposits || 0,
          totalSpent: data.totalSpent || 0,
        });
      }
    });

    // Load transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTransactions = onQuerySnapshot(transactionsQuery, (snapshot) => {
      const transactionsData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionsData);
    });

    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
    };
  }, [user]);

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || amount < 100) {
      Alert.alert('Error', 'Minimum deposit is ₦100');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would integrate with payment gateway
      // For now, we'll show a message
      Alert.alert(
        'Payment Integration',
        'Payment gateway integration is required. This would redirect to Stripe/Paystack checkout.',
        [{ text: 'OK' }]
      );
      setDepositAmount('');
    } catch (error) {
      console.error('Deposit error:', error);
      Alert.alert('Error', 'Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '📥';
      case 'payment':
        return '📤';
      case 'refund':
        return '↩️';
      default:
        return '💰';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₦{wallet.balance.toLocaleString()}</Text>
        <View style={styles.balanceStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Deposits</Text>
            <Text style={styles.statValue}>₦{wallet.totalDeposits.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>₦{wallet.totalSpent.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.depositSection}>
        <Text style={styles.sectionTitle}>Deposit Funds</Text>
        <View style={styles.depositForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount (min ₦100)"
            placeholderTextColor="#9CA3AF"
            value={depositAmount}
            onChangeText={setDepositAmount}
            keyboardType="numeric"
          />
          <View style={styles.quickAmounts}>
            {[1000, 5000, 10000, 20000].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => setDepositAmount(amount.toString())}
              >
                <Text style={styles.quickAmountText}>₦{(amount / 1000).toFixed(0)}k</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.depositButton, loading && styles.depositButtonDisabled]}
            onPress={handleDeposit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.depositButtonText}>Deposit Funds</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionIconText}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.createdAt)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'deposit'
                      ? styles.transactionAmountPositive
                      : styles.transactionAmountNegative,
                  ]}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}₦
                  {Math.abs(transaction.amount).toLocaleString()}
                </Text>
              </View>
              {transaction.status !== 'completed' && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#DBEAFE',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  depositSection: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  depositForm: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  depositButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  depositButtonDisabled: {
    opacity: 0.6,
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsSection: {
    margin: 16,
    marginTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmountPositive: {
    color: '#059669',
  },
  transactionAmountNegative: {
    color: '#DC2626',
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

