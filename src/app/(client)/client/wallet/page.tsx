'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebaseClient';
import PaymentButton from '@/components/payments/PaymentButton';
import { formatCurrency } from '@/lib/paystackClient';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: any;
  reference?: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { auth } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchWalletData(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchWalletData = async (userId: string) => {
    try {
      const { db } = getFirebase();
      
      // Fetch wallet balance
      const walletRef = doc(db, 'wallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        setBalance(walletSnap.data().balance || 0);
      }

      // Listen to transactions
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
        const transactionsData: Transaction[] = [];
        snapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(transactionsData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    setShowSuccess(true);
    setAmount('');
    setTimeout(() => setShowSuccess(false), 5000);
    // Refresh wallet balance
    if (user) {
      fetchWalletData(user.uid);
    }
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const quickAmounts = [1000, 5000, 10000, 20000, 50000];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-neutral-900">My Wallet</h1>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <p className="font-medium text-green-800">Payment successful! Your wallet has been funded.</p>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="font-medium text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Balance Card */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white shadow-lg">
          <p className="text-sm uppercase opacity-90">Available Balance</p>
          <p className="mt-2 text-4xl font-bold">{formatCurrency(balance)}</p>
        </div>

        {/* Fund Wallet Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Fund Wallet</h2>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700">
              Enter Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="100"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 text-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-neutral-700">Quick amounts:</p>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600"
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {user && amount && parseFloat(amount) >= 100 && (
            <PaymentButton
              email={user.email || ''}
              amount={parseFloat(amount)}
              userId={user.uid}
              type="wallet_funding"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}

          {amount && parseFloat(amount) < 100 && (
            <p className="text-sm text-red-600">Minimum amount is ₦100</p>
          )}
        </div>

        {/* Transaction History */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <p className="text-center text-neutral-600">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {transaction.type === 'wallet_funding' && 'Wallet Funding'}
                      {transaction.type === 'job_payment' && 'Job Payment'}
                      {transaction.type === 'payout' && 'Payout'}
                      {transaction.type === 'payment' && 'Payment'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {transaction.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </p>
                    {transaction.reference && (
                      <p className="text-xs text-neutral-500">Ref: {transaction.reference}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === 'payout' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {transaction.type === 'payout' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'text-green-600'
                          : transaction.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


