This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash

NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


What’s Done
UI Setup (Next.js + Tailwind + ShadCN)

Your UI is clean, responsive, and working.

Input field and button for user prompts.

Response display section styled.

LLM API Integration via Hugging Face


API-compatible model like mistralai/Mistral-7B-Instruct-v0.1.

Working Prompt/Response Flow

Prompt sent to API.

Response received and displayed in real-time on the UI.

Error handling added for API failures.
===============pending=================
✅ Next Steps 
Let’s level up your prototype from here:

🧠 1. Add Prompt Engineering Layer
Structure your prompts better based on content comparison, for example:

ts
Copy
Edit
"Compare the following lesson with this benchmark lesson. Highlight key differences in engagement, tone, and structure."
📊 2. Add Loading Skeleton or Spinner
Improve UX while the model is generating the response.

💾 3. Log API Results
Save prompt and response pairs in local storage or Supabase for:



 show embedded YouTube video and image as part of the rendered result too?

 /Users/sbharti/insightbridge-ui/insightbridges-ui/public/students.json# Hackaton25
