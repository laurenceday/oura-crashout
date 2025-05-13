# Oura Crashout Dashboard

A dashboard that analyzes your Oura Ring data to predict when you might "crash out" based on sleep, activity, and stress data.

## Running on Replit

1. Fork this repository to your Replit account
2. The project will automatically install dependencies and start
3. Once running, you'll need to:
   - Sign in with your Oura account
   - Provide your Personal Access Token (PAT)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Features

- Sleep score analysis
- Daily steps tracking
- Stress level monitoring
- Crash out risk prediction
- Interactive charts for data visualization

## Environment Variables

No environment variables are required for basic functionality. The app uses client-side storage for the Oura PAT.

## Getting Started

First, run the development server:

```bash
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
