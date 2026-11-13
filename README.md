# SUZUKA Photography CMS

This is a deploy-ready starter for a public photography portfolio plus a password-protected owner dashboard.

## Included
- `index.html` — public portfolio; reads gallery and site details from Supabase.
- `admin.html` — owner login, photo/video upload, gallery deletion, and editable website details.
- `setup.sql` — database tables, owner-only row policies, and public media bucket policies.

## One-time setup (required before uploads/login work)
1. Create a free project at https://supabase.com/.
2. In Supabase, open **SQL Editor**, paste all of `setup.sql`, and run it.
3. In **Authentication > Users**, create the owner login using your email and a strong password.
4. Copy the owner's **User UID**. In SQL Editor, run:
   `insert into public.site_owners(user_id) values ('PASTE-OWNER-USER-UUID-HERE');`
5. In **Project Settings > API**, copy the Project URL and the `anon` / publishable key.
6. Open both `index.html` and `admin.html`. Replace:
   - `YOUR_SUPABASE_URL` with your Project URL
   - `YOUR_SUPABASE_ANON_KEY` with your anon/publishable key
   Do not put a `service_role` or secret key in either HTML file.
7. Deploy the whole folder to a static host such as Netlify or Cloudflare Pages. Keep `index.html`, `admin.html`, and this folder structure together.
8. Visit your deployed site. Use **Owner login** in the footer, then sign in with the owner email/password.

## Using the dashboard
- Upload an image or video (up to 100 MB), select a category, optionally add a caption, and choose **Upload & publish**.
- Edit tagline, About text, contact email and Instagram, then **Save website details**.
- Delete a gallery item from the owner dashboard; it disappears from the public site.

## Security notes
- The anon/publishable key is designed for browser use; access is restricted by Supabase Row Level Security and Storage policies.
- Only the user UUID explicitly inserted into `site_owners` can upload, edit site settings, or delete portfolio media.
- Never expose the Supabase `service_role` key.
- For a live commercial site, set up backups and test access policies before publishing client work.
- The public media bucket means uploaded portfolio photos/videos are publicly viewable. Do not upload private client material without consent.
