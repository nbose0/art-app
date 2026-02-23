# Art App
https://art-app-eight.vercel.app/

## What
A small, lightweight website to host a fun drawing night.

## Why
A group of us used to meet up at a museum, pick a room full of sculptures, and spend the afternoon drawing them. It was never really about the art we made — it was about being together with sketchbooks open and getting to know each other, all while being engrossed in the work.

Then some of us moved away. This Art App is how we keep that going.

One person hosts a session, shares the code, and everyone joins in. The host drives — everyone else follows along on the same screen in real time.

We start with a **warm-up**: silly prompts, short timers, no pressure. It loosens everyone up and gets the laughs going early. Then we browse a list of real museums from around the world and pick one to "visit." The site pulls in actual artworks from that museum's collection and randomly selects five — as if we just walked into a room together and these were the pieces displayed there. Then we draw for 45 minutes, just like we used to.


## Getting Started

Install dependencies and start both the Next.js dev server and the PartyKit WebSocket server:

```bash
npm install
npm run dev        # Next.js on http://localhost:3000
npx partykit dev   # PartyKit on http://localhost:1999
```

## Deployment

1. Deploy the PartyKit server:
   ```bash
   npx partykit deploy
   ```

2. Deploy to Vercel and set the environment variable:
   ```
   NEXT_PUBLIC_PARTYKIT_HOST=art-app.YOUR_USERNAME.partykit.dev
   ```

## Acknowledgements
Build in one evening entirely with Claude Code
