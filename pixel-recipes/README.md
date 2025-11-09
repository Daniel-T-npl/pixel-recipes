image.raw

Stop just scrolling. Start learning.
image.raw is "GitHub for Creatives"—a platform to share not just your final photos, but the exact source code (recipe) behind them.

Inspiration

We all see stunning photos online—on Instagram, Pinterest, or Unsplash—and wonder, "How did they do that?" The internet is great at showing the final masterpiece, but terrible at showing the process. We realized there was a massive gap between passive inspiration and active learning. We built image.raw to close that gap, creating a community where creators don't just show off their work, but share their exact step-by-step editing "recipes" so others can learn, replicate, and remix their style.

What it does

image.raw is a full-stack web application that lets digital artists and photographers document their creative process.

For Browsers: Users can explore a gallery of transformations. Clicking a project reveals our signature "wow" feature: an interactive before-and-after slider that lets you physically drag to see the raw image transform into the final edit. Below it, they find the "Recipe"—a detailed Markdown log of every software setting used.

For Creators: Artists can easily upload their raw and final images, write up their process using a simple editor, and publish it to their profile. They have a dashboard to manage, edit, or delete their logs.

For Everyone: Stuck creatively? Our integrated AI Theme Helper lets you describe a "vibe" (e.g., "Cyberpunk rainy night") and instantly generates a custom Lightroom preset recipe to get you started.

How we built it

We built image.raw for speed and performance using a modern serverless stack.

Frontend: We used Next.js to give us a fast, SEO-friendly React framework. It handles our routing and allowed us to easily create API routes for our AI integration.

Styling: We went all-in on Tailwind CSS for rapid UI development, using it for everything from the grid layouts to the custom animations and glassmorphism effects in the navbar.

Backend: We leveraged Firebase as our complete backend-as-a-service.

Firebase Auth handles all user management via Google Sign-In.

Cloud Firestore stores all our recipe data, user profiles, and project metadata.

Firebase Storage hosts the high-resolution before/after images.

AI: We integrated the OpenAI API (GPT-3.5 Turbo) with a custom system prompt to act as a professional photo editor, turning natural language queries into structured technical recipes.

Challenges we ran into

The "Hydration" Headache: Integrating client-side Firebase Authentication with Next.js server-side rendering caused mismatched UI states (the dreaded "hydration failed" error). We had to learn to carefully manage our React hooks to ensure auth-dependent components only rendered on the client.

Image Ratios: Images rarely have perfect, matching aspect ratios. Our initial slider implementation would jump around or stretch images strangely. We had to use some clever CSS tricks with object-fit and absolute positioning to force a smooth comparison without distorting the artwork.

Dynamic UI Glitches: Building the "scroll-away" navbar and the custom glowing mouse cursor introduced weird z-index stacking context issues, where aesthetic elements would accidentally block clicks on functional buttons.

Accomplishments that we're proud of

The Polish: We didn't just build a functional CRUD app; we built something that feels premium. The dark mode aesthetic, the smooth animations, the parallax scrolling on the home page, and the custom mouse glow all add up to an experience we're really proud of.

The Slider: It works incredibly smoothly and immediately communicates the value of the app. It's just fun to use.

Real CRUD in 48 Hours: We have a fully functional app where users can create, read, update, and delete their own complex data models with image uploads.

What we learned

Firestore Indexes: We learned the hard way that complex compound queries (like filtering by user ID and sorting by date) require manual indexing in Firestore.

Next.js Rendering Modes: We gained a much deeper understanding of when to use Server-Side Generation (SSG), Server-Side Rendering (SSR), and Client-Side Rendering (CSR) to balance performance with dynamic user data.

The Power of Tailwind: We realized how much faster we could iterate on design directly in markup without constantly switching CSS files.

What's next for Team D

We have big plans to turn image.raw into a true community platform:

"Forking" Recipes: Allowing a user to duplicate another artist's recipe as a starting point for their own creation.

Social Features: Adding likes, comments, and user follows to build stronger community bonds.

Direct Software Integration: Building plugins for Lightroom or Photoshop that can automatically export a "recipe" file directly to our platform, removing the need for manual typing.

Getting started (quick)
-----------------------

These are the minimal steps to run the project locally on your machine (Windows / PowerShell):

1. Install dependencies

```powershell
npm install
```

2. Create a `.env.local` file in the project root and add your keys (do not commit this file):

```text
# Firebase (for client-side usage these keys are safe to use but should still be kept out of repo)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# OpenAI API key (server-side only)
OPEN_AI_KEY=sk-...
```

3. Ensure sensitive files are ignored (the project already adds `lib/firebase.js` to `.gitignore`, but make sure `.env.local` is ignored too):

```powershell
# if needed
# echo ".env.local" >> .gitignore
```

4. Start the dev server

```powershell
npm run dev
```

Notes about environment variables
---------------------------------

- Next.js loads `.env.local`, and other `.env.*` files from the project root. After changing these files you must restart the dev server so the variables are available to the running process.
- Client-side code can only access environment variables that begin with `NEXT_PUBLIC_`. Anything without that prefix will not be exposed to the browser (this is by design).
- The OpenAI key must be kept server-side. The API route at `/api/ai-theme` uses `process.env.OPEN_AI_KEY`. If that's not set it currently falls back to the placeholder `OPEN_AI_KEY` — change that behavior if you prefer a hard error when missing.

AI Theme Helper
---------------

- Accessible at `/ai-theme` (desktop and mobile). The navbar contains a link to the AI Theme feature; the mobile burger menu also includes it.
- The UI accepts a one-sentence theme and sends it to an API route that forwards the prompt to the OpenAI Chat Completions endpoint and returns a concise Lightroom-style development specification.
- Because the OpenAI key is used server-side, you should set `OPEN_AI_KEY` in your `.env.local` before using the feature.

Firebase notes
--------------

- `lib/firebase.js` is configured to read Firebase config from environment variables (prefers `NEXT_PUBLIC_FIREBASE_*` for client exposure). If you previously had values hard-coded you should remove them and rotate keys if they were committed.
- If you accidentally committed secrets earlier, remove them from the repo history (BFG / git filter-branch) or rotate the keys in the provider console.


