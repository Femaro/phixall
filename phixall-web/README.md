Phixall Web App (Next.js + Supabase)

This is the web-only version of Phixall, built with Next.js App Router and Supabase for Auth, Database, and Storage.

## 1) Environment variables

Create `.env.local` in this folder with:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

On Vercel, add the same vars in Project → Settings → Environment Variables.

## 2) Run locally

```bash
npm run dev
```

- Visit `/register` to create an account (confirm email if required).
- Then `/login` → redirected to `/dashboard` (protected page).
- Use `/logout` to sign out.

## 3) Supabase setup (database + auth)

- In Supabase → Auth → URL Configuration:
  - Site URL: `http://localhost:3000` (replace with your Vercel URL after deploy)
  - Redirect URLs: include both localhost and Vercel domain

- Create `profiles` table (SQL):

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by owner" on profiles
  for select using ( auth.uid() = id );

create policy "Users can upsert their own profile" on profiles
  for insert with check ( auth.uid() = id )
  with check ( auth.uid() = id );

create policy "Users can update their own profile" on profiles
  for update using ( auth.uid() = id );
```

- The app upserts a `profiles` row on first visit to `/dashboard`.

### Storage (avatars)

1. In Supabase → Storage → Create bucket named `avatars` and set it to Public.
2. Add Storage policies (SQL → New Policy on bucket `avatars`):

```sql
-- Allow anyone to view files in the avatars bucket
create policy "Public read" on storage.objects
  for select to public
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload/update only within their own folder
create policy "Users can manage their folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
```

- The Profile page uploads to `avatars/<userId>/avatar` and reads via public URL.

## 4) Route protection

- `middleware.ts` protects `/dashboard` and redirects:
  - Unauthed → `/login`
  - Authed visiting `/login`/`/register` → `/dashboard`

## 5) Deploy to Vercel

1. Import the repository on Vercel.
2. Set Project Root to `phixall-web` if deploying from monorepo.
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app`.
4. Deploy.

That’s it—this repo is now a web app backed by Supabase.
