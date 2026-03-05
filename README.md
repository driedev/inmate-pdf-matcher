# Inmate PDF Matcher

## Overview
The **Inmate PDF Matcher** is a full-stack application designed to automate the process of matching names from PDF documents (like court notices or booking summaries) against live inmate rosters from Madison and Limestone County, Alabama. It uses Playwright for web scraping, OpenAI for document classification, and Fuse.js for fuzzy name matching.

## Features
- **Live Scraper**: Dynamically scrapes inmate rosters from Madison and Limestone County.
- **PDF Extraction**: Extracts text and potential names from uploaded PDF files.
- **AI Document Classification**: Uses OpenAI to classify documents as Booking Summaries, Court Dockets, etc.
- **Fuzzy Matching**: Matches extracted names against the database with configurable similarity thresholds.
- **Email Alerts**: Sends automated email notifications when a high-confidence match is found.
- **Dashboard**: A React-based interface for uploading files and reviewing match results.

## Architecture
- **Frontend**: React (Vite) + Tailwind CSS + Shadcn UI.
- **Backend**: Node.js (Express) + TypeScript.
- **Scraper**: Playwright (Headless Chromium).
- **Matching**: Fuse.js for fuzzy string matching.
- **AI**: OpenAI API for intelligent document analysis.
- **Database**: Local JSON file storage (extendable to PostgreSQL).

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```

### Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
ALERT_EMAIL=recipient@example.com
```
*Note: OpenAI configuration is handled automatically if running in the Replit environment.*

### Running the App
```bash
npm run dev
```

## Matching Logic
The system normalizes names from both the PDF and the roster (uppercase, removing special characters) and uses a fuzzy matching algorithm. A match is flagged if the confidence score exceeds 0.7 (70% similarity).

## Security
- API keys and secrets are managed via environment variables and never hardcoded.
- Input validation ensures only PDF files are processed.
- Headless scraping is performed securely without exposing browser instances.

## Scaling Considerations
For production at scale, the system can be migrated from JSON storage to a persistent database like PostgreSQL and the scraping task can be moved to a scheduled background worker (CRON job).
