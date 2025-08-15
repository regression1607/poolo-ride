# Supabase Configuration for No Email Confirmation

To disable email confirmation in your Supabase project:

## Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Go to **Authentication** > **Settings**
3. Scroll down to **Email Auth**

## Step 2: Disable Email Confirmation
1. Find the setting **"Enable email confirmations"**
2. **Turn OFF** this toggle switch
3. Save the changes

## Step 3: Alternative - Set up Custom Email Templates (Optional)
If you want to keep email confirmation but make it optional:
1. Go to **Authentication** > **Email Templates**
2. Edit the **Confirm signup** template
3. Add auto-confirmation logic

## Step 4: Restart your Expo app
After making these changes:
```bash
npx expo start --clear
```

## Current Issue
The app currently requires email confirmation because this setting is enabled in your Supabase project. Users will need to click the confirmation link in their email before they can sign in.

## Test Account (if needed)
If you want to test without changing settings, you can:
1. Register with a real email
2. Check your email for confirmation link
3. Click the link to confirm
4. Then try logging in

Once you disable email confirmation in Supabase dashboard, registration will work immediately without any email verification.
