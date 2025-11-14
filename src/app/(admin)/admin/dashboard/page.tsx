'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, query, onSnapshot, orderBy, where, updateDoc, doc, addDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { trainingModules } from '@/data/trainingModules';
import type { User as FirebaseUser } from 'firebase/auth';
import type { ArtisanOnboarding } from '@/types/onboarding';

type TimestampLike = Date | { seconds: number; nanoseconds: number } | null | undefined;

type AdminProfile = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  [key: string]: unknown;
};

type ArtisanApplication = Partial<ArtisanOnboarding> & { id: string };

type AdminTab = 'overview' | 'users' | 'jobs' | 'resources' | 'billing' | 'registration' | 'analytics' | 'profile' | 'settings';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'artisan';
  status: 'active' | 'suspended';
  phone?: string;
  address?: string;
  createdAt?: TimestampLike;
}

interface Job {
  id: string;
  title: string;
  description: string;
  serviceCategory?: string;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  clientId: string;
  clientName?: string;
  artisanId?: string;
  artisanName?: string;
  amount?: number;
  budget?: number;
  resources?: Resource[];
  createdAt?: TimestampLike;
}

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt?: TimestampLike;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  category: string;
  createdAt?: TimestampLike;
}

interface Bill {
  id: string;
  jobId: string;
  recipientId: string;
  recipientName: string;
  recipientType: 'client' | 'artisan';
  amount: number;
  description: string;
  items: BillItem[];
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt?: TimestampLike;
}

interface BillItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Data states
  const [clients, setClients] = useState<User[]>([]);
  const [artisans, setArtisans] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [applications, setApplications] = useState<ArtisanApplication[]>([]);
  
  // Filter states
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // UI states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showResourceAssignModal, setShowResourceAssignModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [selectedArtisan, setSelectedArtisan] = useState('');
  const [jobBudget, setJobBudget] = useState('');
  
  // Resource form states
  const [resourceForm, setResourceForm] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: 'pcs',
    costPerUnit: 0,
    category: 'materials'
  });
  
  // Resource assignment states
  const [selectedResources, setSelectedResources] = useState<{resourceId: string, quantity: number}[]>([]);
  
  // Bill form states
  const [billForm, setBillForm] = useState({
    recipientId: '',
    recipientType: 'client' as 'client' | 'artisan',
    description: '',
    items: [{ name: '', quantity: 1, rate: 0, amount: 0 }]
  });
  const [openApplicationId, setOpenApplicationId] = useState<string | null>(null);
  
  // Create job states
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    description: '',
    category: '',
    clientId: '',
    artisanId: '',
    budget: ''
  });

  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const { auth } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          window.location.href = '/login';
        } else {
          // Check if user is admin
          const { db } = getFirebase();
          const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
          if (!profileDoc.exists() || profileDoc.data().role !== 'admin') {
            alert('Access denied. Admin only.');
            window.location.href = '/';
            return;
          }
          setUser(currentUser);
          const profileData = profileDoc.data() as AdminProfile;
          setAdminProfile(profileData);
          setProfileForm({
            name: profileData.name || '',
            email: profileData.email || currentUser.email || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          });
          setLoading(false);
        }
      });
    });
  }, []);

  // Load all data
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();

    // Load clients
    const clientsQuery = query(collection(db, 'profiles'), where('role', '==', 'client'));
    const unsubClients = onSnapshot(clientsQuery, (snapshot) => {
      const data: User[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({ 
          id: doc.id, 
          name: docData.name || '',
          email: docData.email || '',
          role: 'client',
          status: docData.status || 'active',
          phone: docData.phone || '',
          address: docData.address || '',
          createdAt: docData.createdAt
        } as User);
      });
      console.log('Loaded clients:', data); // Debug log
      setClients(data);
    });

    // Load artisans
    const artisansQuery = query(collection(db, 'profiles'), where('role', '==', 'artisan'));
    const unsubArtisans = onSnapshot(artisansQuery, (snapshot) => {
      const data: User[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({ 
          id: doc.id, 
          name: docData.name || '',
          email: docData.email || '',
          role: 'artisan',
          status: docData.status || 'active',
          phone: docData.phone || '',
          address: docData.address || '',
          createdAt: docData.createdAt
        } as User);
      });
      console.log('Loaded artisans:', data); // Debug log
      setArtisans(data);
    });
    
    // Load artisan applications
    const applicationsQuery = query(collection(db, 'artisan_onboarding'), orderBy('createdAt', 'desc'));
    const unsubApplications = onSnapshot(applicationsQuery, (snapshot) => {
      const data: ArtisanApplication[] = [];
      snapshot.forEach((applicationDoc) => {
        data.push({ id: applicationDoc.id, ...(applicationDoc.data() as ArtisanOnboarding) });
      });
      setApplications(data);
    });

    // Load jobs
    const jobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubJobs = onSnapshot(jobsQuery, (snapshot) => {
      const data: Job[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(data);
    });

    // Load transactions
    const transactionsQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const data: Transaction[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(data);
    });

    // Load resources
    const resourcesQuery = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubResources = onSnapshot(resourcesQuery, (snapshot) => {
      const data: Resource[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Resource);
      });
      setResources(data);
    });

    // Load bills
    const billsQuery = query(collection(db, 'bills'), orderBy('createdAt', 'desc'));
    const unsubBills = onSnapshot(billsQuery, (snapshot) => {
      const data: Bill[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Bill);
      });
      setBills(data);
    });

    return () => {
      unsubClients();
      unsubArtisans();
      unsubJobs();
      unsubTransactions();
      unsubResources();
      unsubBills();
      unsubApplications();
    };
  }, [user]);

  async function assignJobToArtisan() {
    if (!selectedJob || !selectedArtisan) return;

    if (!user) {
      alert('You must be signed in to assign resources.');
      return;
    }

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', selectedJob.id), {
        artisanId: selectedArtisan,
        artisanName: artisans.find(a => a.id === selectedArtisan)?.name || 'Artisan',
        status: 'accepted',
        assignedBy: 'admin',
        assignedAt: serverTimestamp(),
      });

      alert('Job assigned successfully!');
      setShowAssignModal(false);
      setSelectedJob(null);
      setSelectedArtisan('');
    } catch (error) {
      console.error('Error assigning job:', error);
      alert('Failed to assign job');
    }
  }

  async function setJobBudgetAmount() {
    if (!selectedJob || !jobBudget) return;

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', selectedJob.id), {
        budget: parseFloat(jobBudget),
        amount: parseFloat(jobBudget),
        budgetSetBy: 'admin',
        budgetSetAt: serverTimestamp(),
      });

      alert('Budget set successfully!');
      setShowBudgetModal(false);
      setSelectedJob(null);
      setJobBudget('');
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('Failed to set budget');
    }
  }

  async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', userId), { status });
      alert(`User ${status === 'active' ? 'activated' : 'suspended'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  }

  async function addResource() {
    if (!resourceForm.name || resourceForm.quantity <= 0 || resourceForm.costPerUnit <= 0) {
      alert('Please fill all required fields');
      return;
    }

    if (!user) {
      alert('You must be signed in to add resources.');
      return;
    }

    try {
      const { db } = getFirebase();
      await addDoc(collection(db, 'resources'), {
        ...resourceForm,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      alert('Resource added successfully!');
      setShowAddResourceModal(false);
      setResourceForm({
        name: '',
        description: '',
        quantity: 0,
        unit: 'pcs',
        costPerUnit: 0,
        category: 'materials'
      });
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource');
    }
  }

  async function assignResourcesToJob() {
    if (!selectedJob || selectedResources.length === 0) return;

    if (!user) {
      alert('You must be signed in to assign resources.');
      return;
    }

    try {
      const { db } = getFirebase();
      const assignedResources = selectedResources.map(sr => {
        const resource = resources.find(r => r.id === sr.resourceId);
        return {
          id: sr.resourceId,
          name: resource?.name,
          quantity: sr.quantity,
          costPerUnit: resource?.costPerUnit,
          totalCost: sr.quantity * (resource?.costPerUnit || 0)
        };
      });

      await updateDoc(doc(db, 'jobs', selectedJob.id), {
        resources: assignedResources,
        resourcesAssignedAt: serverTimestamp(),
        resourcesAssignedBy: user.uid,
      });

      // Update resource quantities
      for (const sr of selectedResources) {
        const resource = resources.find(r => r.id === sr.resourceId);
        if (resource) {
          await updateDoc(doc(db, 'resources', sr.resourceId), {
            quantity: resource.quantity - sr.quantity
          });
        }
      }

      alert('Resources assigned to job successfully!');
      setShowResourceAssignModal(false);
      setSelectedJob(null);
      setSelectedResources([]);
    } catch (error) {
      console.error('Error assigning resources:', error);
      alert('Failed to assign resources');
    }
  }

  async function createJob() {
    if (!newJobForm.title || !newJobForm.description || !newJobForm.clientId) {
      alert('Please fill in all required fields (Title, Description, and Client)');
      return;
    }

    if (!user) {
      alert('You must be signed in to create jobs.');
      return;
    }

    if (!user) {
      alert('You must be signed in to create jobs.');
      return;
    }

    try {
      const { db } = getFirebase();
      const jobData: Record<string, unknown> = {
        title: newJobForm.title,
        description: newJobForm.description,
        category: newJobForm.category || 'general',
        clientId: newJobForm.clientId,
        status: 'requested',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        creatorRole: 'admin',
      };

      // Add client name
      const client = clients.find(c => c.id === newJobForm.clientId);
      if (client) {
        jobData.clientName = client.name || client.email;
      }

      // Add optional artisan assignment
      if (newJobForm.artisanId) {
        jobData.artisanId = newJobForm.artisanId;
        jobData.status = 'accepted';
        const artisan = artisans.find(a => a.id === newJobForm.artisanId);
        if (artisan) {
          jobData.artisanName = artisan.name || artisan.email;
        }
      }

      // Add optional budget
      if (newJobForm.budget && parseFloat(newJobForm.budget) > 0) {
        jobData.budget = parseFloat(newJobForm.budget);
        jobData.amount = parseFloat(newJobForm.budget);
        jobData.budgetSetBy = 'admin';
        jobData.budgetSetAt = serverTimestamp();
      }

      await addDoc(collection(db, 'jobs'), jobData);

      alert('Job created successfully!');
      setShowCreateJobModal(false);
      setNewJobForm({
        title: '',
        description: '',
        category: '',
        clientId: '',
        artisanId: '',
        budget: ''
      });
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  }

  async function sendBill() {
    if (!billForm.recipientId || billForm.items.length === 0 || !selectedJob) {
      alert('Please fill all required fields');
      return;
    }

    const totalAmount = billForm.items.reduce((sum, item) => sum + item.amount, 0);

    if (!user) {
      alert('You must be signed in to send bills.');
      return;
    }

    if (!user) {
      alert('You must be signed in to send bills.');
      return;
    }

    try {
      const { db } = getFirebase();
      const recipientUser = billForm.recipientType === 'client' 
        ? clients.find(c => c.id === billForm.recipientId)
        : artisans.find(a => a.id === billForm.recipientId);

      await addDoc(collection(db, 'bills'), {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        recipientId: billForm.recipientId,
        recipientName: recipientUser?.name || 'Unknown',
        recipientType: billForm.recipientType,
        amount: totalAmount,
        description: billForm.description,
        items: billForm.items,
        status: 'pending',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      alert('Bill sent successfully!');
      setShowBillModal(false);
      setBillForm({
        recipientId: '',
        recipientType: 'client',
        description: '',
        items: [{ name: '', quantity: 1, rate: 0, amount: 0 }]
      });
      setSelectedJob(null);
    } catch (error) {
      console.error('Error sending bill:', error);
      alert('Failed to send bill');
    }
  }

  async function updateProfile() {
    if (!user) {
      alert('You must be signed in to update the profile.');
      return;
    }

    if (!user) {
      alert('You must be signed in to update the profile.');
      return;
    }

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
        updatedAt: serverTimestamp(),
      });

      alert('Profile updated successfully!');
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  }

  async function updateApplicationStatus(applicationId: string, status: 'under-review' | 'approved' | 'rejected') {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'artisan_onboarding', applicationId), {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: user?.uid || 'admin',
      });
      alert(`Application updated to ${status}.`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  }

  async function deleteResource(resourceId: string) {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'resources', resourceId));
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  }

  const stats = {
    totalClients: clients.length,
    totalArtisans: artisans.length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => ['requested', 'accepted', 'in-progress'].includes(j.status)).length,
    completedJobs: jobs.filter(j => j.status === 'completed').length,
    totalRevenue: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingRevenue: jobs.filter(j => j.status === 'completed' && !j.amount).length * 5000,
    totalResources: resources.length,
    totalResourceValue: resources.reduce((sum, r) => sum + (r.quantity * r.costPerUnit), 0),
    pendingBills: bills.filter(b => b.status === 'pending').length,
  };

  const applicationStats = {
    total: applications.length,
    inProgress: applications.filter(a => ['pending', 'in-progress', 'training'].includes(a.status ?? '')).length,
    underReview: applications.filter(a => a.status === 'under-review').length,
    approved: applications.filter(a => a.status === 'approved').length,
  };

  const filteredJobs = jobs.filter(job => {
    if (jobStatusFilter === 'all') return true;
    return job.status === jobStatusFilter;
  });

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredArtisans = artisans.filter(artisan =>
    artisan.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    artisan.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'training':
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border border-neutral-200';
    }
  };

  const formatTimestamp = (value: TimestampLike | { toDate?: () => Date } | string | undefined) => {
    if (!value) return '—';
    if (typeof value === 'string') return new Date(value).toLocaleString();
    if (value.toDate) return value.toDate().toLocaleString();
    if (value.seconds) return new Date(value.seconds * 1000).toLocaleString();
    return '—';
  };

  const sidebarTabs: Array<{ id: AdminTab; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'jobs', label: 'Job Management', icon: '💼' },
    { id: 'resources', label: 'Resources', icon: '📦' },
    { id: 'billing', label: 'Billing & Finance', icon: '💰' },
    { id: 'registration', label: 'Artisan Registration', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Left Sidebar Navigation */}
      <div className="relative flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
        {/* Logo & Title */}
        <div className="border-b border-neutral-200 bg-neutral-900 p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Phixall"
              width={48}
              height={48}
              className="h-12 w-12 drop-shadow-lg"
              style={{ filter: 'contrast(1.2) brightness(1.1)' }}
              priority
            />
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-neutral-400">Phixall Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-1 overflow-y-auto p-4 pr-2 pb-24">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 w-64 border-t border-neutral-200 bg-white p-4">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-900">
              {adminProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-neutral-900">{adminProfile?.name || 'Admin'}</p>
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-neutral-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'jobs' && 'Job Management'}
                {activeTab === 'resources' && 'Resources & Materials'}
                {activeTab === 'registration' && 'Artisan Registration'}
                {activeTab === 'billing' && 'Billing & Finance'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'profile' && 'Admin Profile'}
                {activeTab === 'settings' && 'Dashboard Settings'}
              </h2>
              <p className="text-sm text-neutral-600">
                {activeTab === 'overview' && 'Monitor all platform activities and metrics'}
                {activeTab === 'users' && 'Manage clients and artisans'}
                {activeTab === 'jobs' && 'Assign jobs, set budgets, and track progress'}
                {activeTab === 'resources' && 'Manage inventory and resources for job allocation'}
                {activeTab === 'registration' && 'Monitor new artisan signups and capture registration details'}
                {activeTab === 'billing' && 'Monitor financial transactions and revenue'}
                {activeTab === 'analytics' && 'Platform performance metrics'}
                {activeTab === 'profile' && 'Manage your admin account information'}
                {activeTab === 'settings' && 'Configure your admin dashboard preferences'}
              </p>
            </div>
            <button
              onClick={async () => {
                const { auth } = getFirebase();
                const { signOut } = await import('firebase/auth');
                await signOut(auth);
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Clients</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.totalClients}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Artisans</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.totalArtisans}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Active Jobs</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.activeJobs}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Revenue</p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Resources</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.totalResources}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Resource Value</p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">₦{stats.totalResourceValue.toLocaleString()}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending Bills</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.pendingBills}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Completed Jobs</p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.completedJobs}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Recent Jobs</h3>
                <div className="mt-4 space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50">
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{job.title}</p>
                        <p className="text-xs text-neutral-500">Client: {job.clientName || 'Unknown'}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Recent Transactions</h3>
                <div className="mt-4 space-y-3">
                  {transactions.slice(0, 5).map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{txn.type}</p>
                        <p className="text-xs text-neutral-500">{txn.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                      <p className="font-semibold text-neutral-900">₦{Math.abs(txn.amount).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Clients */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Clients ({filteredClients.length})</h3>
                </div>
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg className="h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="mt-4 text-sm font-medium text-neutral-900">No clients found</p>
                      <p className="mt-1 text-xs text-neutral-500">Clients will appear here once they register</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 font-semibold">
                            {client.name?.charAt(0) || client.email.charAt(0)}
                          </div>
                        <div>
                          <p className="font-medium text-neutral-900">{client.name || client.email}</p>
                          <p className="text-xs text-neutral-500">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {client.status || 'active'}
                        </span>
                        <button
                          onClick={() => updateUserStatus(client.id, client.status === 'active' ? 'suspended' : 'active')}
                          className="text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          {client.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Artisans */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Artisans ({filteredArtisans.length})</h3>
                </div>
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {filteredArtisans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg className="h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-sm font-medium text-neutral-900">No artisans found</p>
                      <p className="mt-1 text-xs text-neutral-500">Artisans will appear here once they register</p>
                    </div>
                  ) : (
                    filteredArtisans.map((artisan) => (
                      <div key={artisan.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 font-semibold">
                            {artisan.name?.charAt(0) || artisan.email.charAt(0)}
                          </div>
                        <div>
                          <p className="font-medium text-neutral-900">{artisan.name || artisan.email}</p>
                          <p className="text-xs text-neutral-500">{artisan.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          artisan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {artisan.status || 'active'}
                        </span>
                        <button
                          onClick={() => updateUserStatus(artisan.id, artisan.status === 'active' ? 'suspended' : 'active')}
                          className="text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          {artisan.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Management Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowCreateJobModal(true)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                + Create Job
              </button>
              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mt-6 space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          job.status === 'completed' ? 'bg-green-100 text-green-700' :
                          job.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                          job.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600">{job.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
                        <span className="text-neutral-600"><strong>Client:</strong> {job.clientName || 'Unknown'}</span>
                        {job.artisanName && (
                          <span className="text-neutral-600"><strong>Artisan:</strong> {job.artisanName}</span>
                        )}
                        {job.budget && (
                          <span className="font-semibold text-green-600">Budget: ₦{job.budget.toLocaleString()}</span>
                        )}
                        {job.resources && job.resources.length > 0 && (
                          <span className="text-neutral-600"><strong>Resources:</strong> {job.resources.length} items</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {!job.artisanId && (
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowAssignModal(true);
                          }}
                          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                        >
                          Assign Artisan
                        </button>
                      )}
                      {!job.budget && (
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowBudgetModal(true);
                          }}
                          className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
                        >
                          Set Budget
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowResourceAssignModal(true);
                        }}
                        className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Assign Resources
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowBillModal(true);
                        }}
                        className="rounded-lg border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50"
                      >
                        Send Bill
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={() => setShowAddResourceModal(true)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                + Add Resource
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div key={resource.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900">{resource.name}</h3>
                      <p className="mt-1 text-sm text-neutral-600">{resource.description}</p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="text-neutral-700">
                          <strong>Quantity:</strong> {resource.quantity} {resource.unit}
                        </p>
                        <p className="text-neutral-700">
                          <strong>Cost/Unit:</strong> ₦{resource.costPerUnit.toLocaleString()}
                        </p>
                        <p className="font-semibold text-green-600">
                          Total Value: ₦{(resource.quantity * resource.costPerUnit).toLocaleString()}
                        </p>
                        <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Tab */}
        {activeTab === 'registration' && (
          <div>
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Applications</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">{applicationStats.total}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">In Progress</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">{applicationStats.inProgress}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Under Review</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">{applicationStats.underReview}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Approved</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900 text-green-600">{applicationStats.approved}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {applications.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No applications yet</h3>
                  <p className="mt-2 text-neutral-600">Artisan onboarding submissions will appear here once received.</p>
                </div>
              ) : (
                applications.map((application) => {
                  const applicantName = application.additionalInfo?.fullName || application.email || application.userId;
                  const applicantEmail = application.email || application.additionalInfo?.email || '—';
                  const currentStep = application.currentStep ?? 1;
                  const totalSteps = 3;
                  const isOpen = openApplicationId === application.id;

                  return (
                    <div key={application.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <button
                            onClick={() => setOpenApplicationId(isOpen ? null : application.id)}
                            className="flex w-full flex-1 items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:bg-neutral-100"
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-neutral-900">{applicantName}</h3>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getApplicationStatusColor(application.status)}`}>
                                  {application.status || 'pending'}
                                </span>
                              </div>
                              <p className="text-sm text-neutral-600">{applicantEmail}</p>
                            </div>
                            <svg
                              className={`h-5 w-5 text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          <div className="flex flex-row flex-wrap gap-2 md:flex-col md:items-end">
                            {application.status !== 'under-review' && application.status !== 'approved' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'under-review')}
                                className="min-w-[150px] rounded-lg border border-amber-500 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                              >
                                Move to Review
                              </button>
                            )}
                            {application.status !== 'approved' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className="min-w-[150px] rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                              >
                                Approve
                              </button>
                            )}
                            {application.status !== 'rejected' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                className="min-w-[150px] rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>

                        {isOpen && (
                          <>
                            <div className="grid gap-4 sm:grid-cols-3 text-sm text-neutral-600">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Current Step</p>
                                <p className="mt-1 font-semibold text-neutral-900">
                                  Step {currentStep} of {totalSteps}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Submitted</p>
                                <p className="mt-1 font-semibold text-neutral-900">{formatTimestamp(application.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Last Updated</p>
                                <p className="mt-1 font-semibold text-neutral-900">{formatTimestamp(application.updatedAt)}</p>
                              </div>
                            </div>

                          {application.additionalInfo && (
                            <>
                              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">Primary Skill</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.specificSkill || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">Experience</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.yearsOfExperience ?? 0} yrs</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">City</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.city || '—'}</p>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">Phone</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.phoneNumber || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">Gender</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.sex || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">State</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.state || '—'}</p>
                                </div>
                              </div>

                              {application.additionalInfo.address && (
                                <div className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                                  <p className="text-xs uppercase tracking-wide text-neutral-500">Address</p>
                                  <p className="mt-1 font-medium text-neutral-900">{application.additionalInfo.address}</p>
                                </div>
                              )}

                              {(application.additionalInfo.idFileUrl ||
                                (application.additionalInfo.certifications && application.additionalInfo.certifications.length > 0)) && (
                                <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
                                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">Uploaded Documents</h4>
                                  <div className="space-y-2 text-sm">
                                    {application.additionalInfo.idFileUrl && (
                                      <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                                        <span className="text-neutral-700">Government ID</span>
                                        <a
                                          href={application.additionalInfo.idFileUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-sm font-medium text-brand-600 hover:text-brand-700"
                                        >
                                          View
                                        </a>
                                      </div>
                                    )}
                                    {application.additionalInfo.certifications?.map((cert, idx) => (
                                      <div
                                        key={`${cert.name}-${idx}`}
                                        className="flex flex-col gap-1 rounded-lg bg-neutral-50 px-3 py-2"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium text-neutral-900">{cert.name || 'Certification'}</span>
                                          {cert.fileUrl && (
                                            <a
                                              href={cert.fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-sm font-medium text-brand-600 hover:text-brand-700"
                                            >
                                              View
                                            </a>
                                          )}
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                          {cert.issuer || 'Issuer'} · {cert.dateIssued || 'Date not provided'}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {application.additionalInfo?.references?.length > 0 && (
                            <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
                              <h4 className="text-sm font-semibold text-neutral-900 mb-3">Professional References</h4>
                              <div className="space-y-3 text-sm">
                                {application.additionalInfo.references.map((ref, idx) => (
                                  <div key={`${ref.name}-${idx}`} className="rounded-lg bg-neutral-50 p-3">
                                    <p className="font-medium text-neutral-900">{ref.name || 'Reference'}</p>
                                    <p className="text-neutral-600">{ref.relationship || ref.companyName || '—'}</p>
                                    <p className="text-xs text-neutral-500">{ref.phoneNumber || 'No phone provided'}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {application.training && (
                            <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="text-sm font-semibold text-neutral-900">Training Progress</h4>
                                <p className="text-xs font-semibold text-brand-600">
                                  {application.training.allCompleted
                                    ? application.training.allPassed
                                      ? 'All modules completed and passed'
                                      : 'All modules completed'
                                    : 'In progress'}
                                </p>
                              </div>
                              {application.trainingProgress?.activeModuleId && (
                                <div className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                                  <p className="font-semibold">
                                    Last activity:{' '}
                                    {trainingModules.find((m) => m.id === application.trainingProgress.activeModuleId)?.title || 'Current module'}
                                  </p>
                                  <p>
                                    Page {application.trainingProgress.currentPage + 1}{' '}
                                    {application.trainingProgress.takingAssessment ? '(assessment in progress)' : ''}
                                  </p>
                                </div>
                              )}
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[
                                  { label: 'Safety Training', key: 'safetyTraining', icon: '🛡️' },
                                  { label: 'Residential Training', key: 'residentialTraining', icon: '🏠' },
                                  { label: 'Corporate Training', key: 'corporateTraining', icon: '🏢' },
                                  { label: 'Dashboard Training', key: 'dashboardTraining', icon: '📱' },
                                ].map(({ label, key, icon }) => {
                                  const moduleStatus = application.training[key] || {};
                                  return (
                                    <div key={key} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{icon}</span>
                                        <p className="font-semibold text-neutral-900">{label}</p>
                                      </div>
                                      <p className="mt-2 text-xs text-neutral-500">
                                        {moduleStatus.completed
                                          ? moduleStatus.passedAssessment
                                            ? 'Passed'
                                            : 'Completed - Needs retake'
                                          : 'Not started'}
                                      </p>
                                      {moduleStatus.completed && (
                                        <p className={`mt-1 text-sm font-semibold ${moduleStatus.passedAssessment ? 'text-green-600' : 'text-red-600'}`}>
                                          Score: {moduleStatus.assessmentScore ?? 0}%
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">₦{stats.totalRevenue.toLocaleString()}</p>
                <p className="mt-1 text-xs text-neutral-500">All-time earnings</p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending Payments</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">₦{stats.pendingRevenue.toLocaleString()}</p>
                <p className="mt-1 text-xs text-neutral-500">Awaiting payment</p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Completed Jobs</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">{stats.completedJobs}</p>
                <p className="mt-1 text-xs text-neutral-500">Successfully finished</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">All Transactions</h3>
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          txn.type === 'deposit' || txn.type === 'earning' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {txn.type === 'deposit' || txn.type === 'earning' ? '📥' : '📤'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{txn.type}</p>
                          <p className="text-xs text-neutral-500">{txn.createdAt?.toDate().toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          txn.type === 'deposit' || txn.type === 'earning' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.type === 'deposit' || txn.type === 'earning' ? '+' : '-'}₦{Math.abs(txn.amount).toLocaleString()}
                        </p>
                        <span className={`text-xs ${
                          txn.status === 'completed' ? 'text-green-600' : txn.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Bills Sent</h3>
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                  {bills.map((bill) => (
                    <div key={bill.id} className="rounded-lg border border-neutral-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900">{bill.recipientName}</p>
                          <p className="text-xs text-neutral-500">{bill.description}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          bill.status === 'approved' ? 'bg-green-100 text-green-700' :
                          bill.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          bill.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-neutral-900">₦{bill.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <p className="text-sm text-neutral-600">Total Jobs</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">{stats.totalJobs}</p>
                <p className="mt-1 text-xs text-green-600">↑ All time</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <p className="text-sm text-neutral-600">Completion Rate</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {stats.totalJobs > 0 ? Math.round((stats.completedJobs / stats.totalJobs) * 100) : 0}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">{stats.completedJobs} of {stats.totalJobs}</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <p className="text-sm text-neutral-600">Avg Job Value</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  ₦{stats.completedJobs > 0 ? Math.round(stats.totalRevenue / stats.completedJobs).toLocaleString() : 0}
                </p>
                <p className="mt-1 text-xs text-neutral-500">Per job</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <p className="text-sm text-neutral-600">Active Rate</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">{stats.activeJobs} active now</p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-900">Revenue Trends</h3>
              <div className="mt-4 flex h-64 items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg">
                <p className="text-neutral-500">Chart visualization (Integration ready)</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="max-w-2xl">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-4xl font-bold text-neutral-900">
                    {adminProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{adminProfile?.name || 'Admin User'}</h3>
                    <p className="text-neutral-600">{user?.email}</p>
                    <span className="inline-block mt-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                      Administrator
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="mt-1 block w-full rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Address</label>
                    <textarea
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2"
                      placeholder="Enter your address"
                    />
                  </div>

                  <button
                    onClick={updateProfile}
                    className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-semibold text-white hover:bg-neutral-800"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div className="max-w-2xl space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'New job requests', description: 'Get notified when clients submit new jobs' },
                    { label: 'User registrations', description: 'Alerts when new users sign up' },
                    { label: 'Transaction alerts', description: 'Notifications for all financial transactions' },
                    { label: 'Bill approvals', description: 'Updates when bills are approved/rejected' },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{setting.label}</p>
                        <p className="text-sm text-neutral-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-neutral-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-purple-300"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Platform Settings</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Default Job Status</label>
                    <select className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2">
                      <option>requested</option>
                      <option>accepted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Cash-out Fee (%)</label>
                    <input
                      type="number"
                      defaultValue="2.5"
                      step="0.1"
                      className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                <p className="mt-2 text-sm text-red-700">Irreversible actions that affect the entire platform</p>
                <div className="mt-4 space-y-2">
                  <button className="w-full rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    Export All Data
                  </button>
                  <button className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Reset Platform Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Assign Artisan Modal */}
      {showAssignModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">Assign Artisan to Job</h3>
            <p className="mt-2 text-sm text-neutral-600">{selectedJob.title}</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700">Select Artisan</label>
              <select
                className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3"
                value={selectedArtisan}
                onChange={(e) => setSelectedArtisan(e.target.value)}
              >
                <option value="">Choose an artisan...</option>
                {artisans.filter(a => a.status === 'active').map((artisan) => (
                  <option key={artisan.id} value={artisan.id}>
                    {artisan.name || artisan.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={assignJobToArtisan}
                disabled={!selectedArtisan}
                className="flex-1 rounded-lg bg-neutral-900 px-4 py-3 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Job
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedJob(null);
                  setSelectedArtisan('');
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Budget Modal */}
      {showBudgetModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">Set Job Budget</h3>
            <p className="mt-2 text-sm text-neutral-600">{selectedJob.title}</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700">Budget Amount (₦)</label>
              <input
                type="number"
                min="0"
                step="100"
                className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-lg font-semibold"
                placeholder="Enter amount"
                value={jobBudget}
                onChange={(e) => setJobBudget(e.target.value)}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={setJobBudgetAmount}
                disabled={!jobBudget}
                className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set Budget
              </button>
              <button
                onClick={() => {
                  setShowBudgetModal(false);
                  setSelectedJob(null);
                  setJobBudget('');
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-2xl w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-neutral-900">Create New Job</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Job Title*</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                  placeholder="e.g., Plumbing Repair, Electrical Installation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Description*</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                  rows={4}
                  placeholder="Detailed description of the job requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Category</label>
                <select
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.category}
                  onChange={(e) => setNewJobForm({...newJobForm, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="painting">Painting</option>
                  <option value="hvac">HVAC</option>
                  <option value="roofing">Roofing</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="general">General Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Select Client*</label>
                <select
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.clientId}
                  onChange={(e) => setNewJobForm({...newJobForm, clientId: e.target.value})}
                >
                  <option value="">Choose a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name || client.email}
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">No clients available. Please wait for clients to register.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Assign Artisan (Optional)</label>
                <select
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.artisanId}
                  onChange={(e) => setNewJobForm({...newJobForm, artisanId: e.target.value})}
                >
                  <option value="">No artisan (will be assigned later)</option>
                  {artisans.map((artisan) => (
                    <option key={artisan.id} value={artisan.id}>
                      {artisan.name || artisan.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Budget (Optional)</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  value={newJobForm.budget}
                  onChange={(e) => setNewJobForm({...newJobForm, budget: e.target.value})}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-xs text-neutral-500">Leave empty to set budget later</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateJobModal(false);
                  setNewJobForm({
                    title: '',
                    description: '',
                    category: '',
                    clientId: '',
                    artisanId: '',
                    budget: ''
                  });
                }}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={createJob}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-neutral-900">Add New Resource</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Resource Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={resourceForm.name}
                  onChange={(e) => setResourceForm({...resourceForm, name: e.target.value})}
                  placeholder="e.g., Cement, PVC Pipes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                  rows={2}
                  placeholder="Brief description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Quantity</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={resourceForm.quantity}
                    onChange={(e) => setResourceForm({...resourceForm, quantity: parseFloat(e.target.value)})}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Unit</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={resourceForm.unit}
                    onChange={(e) => setResourceForm({...resourceForm, unit: e.target.value})}
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="m">Meters</option>
                    <option value="bags">Bags</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Cost per Unit (₦)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={resourceForm.costPerUnit}
                    onChange={(e) => setResourceForm({...resourceForm, costPerUnit: parseFloat(e.target.value)})}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Category</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({...resourceForm, category: e.target.value})}
                  >
                    <option value="materials">Materials</option>
                    <option value="tools">Tools</option>
                    <option value="equipment">Equipment</option>
                    <option value="consumables">Consumables</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-700">Total Value</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">
                  ₦{(resourceForm.quantity * resourceForm.costPerUnit).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={addResource}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Add Resource
              </button>
              <button
                onClick={() => {
                  setShowAddResourceModal(false);
                  setResourceForm({
                    name: '',
                    description: '',
                    quantity: 0,
                    unit: 'pcs',
                    costPerUnit: 0,
                    category: 'materials'
                  });
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Resources to Job Modal */}
      {showResourceAssignModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-2xl w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-neutral-900">Assign Resources to Job</h3>
            <p className="mt-1 text-sm text-neutral-600">{selectedJob.title}</p>
            
            <div className="mt-4 space-y-3">
              {resources.filter(r => r.quantity > 0).map((resource) => (
                <div key={resource.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                  <div>
                    <p className="font-medium text-neutral-900">{resource.name}</p>
                    <p className="text-sm text-neutral-600">Available: {resource.quantity} {resource.unit} | ₦{resource.costPerUnit}/{resource.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={resource.quantity}
                      placeholder="Qty"
                      className="w-20 rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                      onChange={(e) => {
                        const qty = parseFloat(e.target.value) || 0;
                        setSelectedResources(prev => {
                          const existing = prev.find(r => r.resourceId === resource.id);
                          if (existing) {
                            return prev.map(r => r.resourceId === resource.id ? {...r, quantity: qty} : r);
                          } else {
                            return [...prev, { resourceId: resource.id, quantity: qty }];
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-700">Total Cost</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                ₦{selectedResources.reduce((sum, sr) => {
                  const resource = resources.find(r => r.id === sr.resourceId);
                  return sum + (sr.quantity * (resource?.costPerUnit || 0));
                }, 0).toLocaleString()}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={assignResourcesToJob}
                disabled={selectedResources.length === 0}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Resources
              </button>
              <button
                onClick={() => {
                  setShowResourceAssignModal(false);
                  setSelectedJob(null);
                  setSelectedResources([]);
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Bill Modal */}
      {showBillModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-2xl w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-neutral-900">Send Bill</h3>
            <p className="mt-1 text-sm text-neutral-600">For job: {selectedJob.title}</p>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Recipient Type</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={billForm.recipientType}
                    onChange={(e) => setBillForm({...billForm, recipientType: e.target.value as 'client' | 'artisan', recipientId: ''})}
                  >
                    <option value="client">Client</option>
                    <option value="artisan">Artisan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Recipient</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                    value={billForm.recipientId}
                    onChange={(e) => setBillForm({...billForm, recipientId: e.target.value})}
                  >
                    <option value="">Select {billForm.recipientType}</option>
                    {(billForm.recipientType === 'client' ? clients : artisans).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={billForm.description}
                  onChange={(e) => setBillForm({...billForm, description: e.target.value})}
                  rows={2}
                  placeholder="Bill description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700">Line Items</label>
                  <button
                    onClick={() => setBillForm({
                      ...billForm,
                      items: [...billForm.items, { name: '', quantity: 1, rate: 0, amount: 0 }]
                    })}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {billForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...billForm.items];
                          newItems[index].name = e.target.value;
                          setBillForm({...billForm, items: newItems});
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...billForm.items];
                          newItems[index].quantity = parseFloat(e.target.value) || 0;
                          newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                          setBillForm({...billForm, items: newItems});
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        value={item.rate}
                        onChange={(e) => {
                          const newItems = [...billForm.items];
                          newItems[index].rate = parseFloat(e.target.value) || 0;
                          newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                          setBillForm({...billForm, items: newItems});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-700">Total Amount</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">
                  ₦{billForm.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={sendBill}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-700"
              >
                Send Bill
              </button>
              <button
                onClick={() => {
                  setShowBillModal(false);
                  setSelectedJob(null);
                  setBillForm({
                    recipientId: '',
                    recipientType: 'client',
                    description: '',
                    items: [{ name: '', quantity: 1, rate: 0, amount: 0 }]
                  });
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">Edit Profile</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2"
                  value={profileForm.email}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Address</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={updateProfile}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
