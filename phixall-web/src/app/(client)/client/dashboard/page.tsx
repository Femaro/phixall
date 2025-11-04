'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, db, storage } from '@/lib/firebaseClient';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

export default function ClientDashboardPage(): JSX.Element {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [scheduledAt, setScheduledAt] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		import('firebase/auth').then(({ onAuthStateChanged }) => {
			onAuthStateChanged(auth, (user) => {
				if (!user) window.location.href = '/login';
			});
		});
	}, []);

	async function handleSubmit(e: React.FormEvent): Promise<void> {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);

    const user = auth.currentUser;
    if (!user) { window.location.href = '/login'; return; }
    const jobDoc = await addDoc(collection(db, 'jobs'), {
      clientId: user.uid,
      title,
      description,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: 'requested',
      createdAt: serverTimestamp(),
    });

		// Upload attachments (optional)
    if (files && files.length > 0) {
      for (const f of Array.from(files)) {
        const objectRef = ref(storage, `job-attachments/${jobDoc.id}/${f.name}`);
        await uploadBytes(objectRef, f);
      }
    }

		setMessage('Job request submitted.');
		setSubmitting(false);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Client Dashboard</h1>
                    <button onClick={async ()=>{ const { signOut } = await import('firebase/auth'); await signOut(auth); window.location.href='/login'; }} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100">Sign out</button>
				</div>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-medium">Request a Service</h2>
						<div className="mt-4 space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Title</label>
								<input className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" value={title} onChange={(e)=>setTitle(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Description</label>
								<textarea className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Schedule</label>
								<input type="datetime-local" className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" value={scheduledAt} onChange={(e)=>setScheduledAt(e.target.value)} />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Attachments (photos/videos)</label>
								<input type="file" multiple accept="image/*,video/*" className="mt-1 block w-full" onChange={(e)=>setFiles(e.target.files)} />
							</div>
							{message && <p className="text-sm text-gray-700">{message}</p>}
							<button disabled={submitting} className="mt-2 rounded-lg bg-black px-4 py-2.5 text-white disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit request'}</button>
						</div>
					</form>

					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-medium">Live Tracking</h2>
						<p className="mt-2 text-sm text-gray-600">Track accepted jobs in real-time once an artisan is assigned.</p>
						<Link href="/client/tracking" className="mt-4 inline-block rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Open Tracking</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
