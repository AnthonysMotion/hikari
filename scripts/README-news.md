# News System

The news system automatically fetches anime and manga news from various RSS feeds and displays them on the home page.

## Setup

1. **Run database migration:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Initial news fetch:**
   ```bash
   npm run update-news
   ```

## News Sources

Currently fetching from:
- **Anime News Network (ANN)** - Comprehensive anime and manga news
- **Anime Corner** - Latest anime news and updates
- **Crunchyroll News** - Official Crunchyroll news feed

## Updating News

### Manual Update
```bash
npm run update-news
```

Or call the API endpoint:
```bash
curl http://localhost:3000/api/news/update
```

### Automatic Updates (Cron Job)

For production, set up a cron job or scheduled task to update news periodically:

**Using Vercel Cron:**
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/news/update",
    "schedule": "0 */6 * * *"
  }]
}
```

**Using Node-Cron (if running your own server):**
```javascript
const cron = require('node-cron')
cron.schedule('0 */6 * * *', () => {
  fetch('http://localhost:3000/api/news/update')
})
```

**Windows Task Scheduler:**
Schedule a task to run every 6 hours:
```
npm run update-news
```

**Linux Crontab:**
```bash
0 */6 * * * cd /path/to/project && npm run update-news
```

## News Categories

The system automatically categorizes news based on keywords:
- **Trailer** - New trailers, PVs, opening/ending videos
- **Announcement** - New series announcements, reveals
- **Adaptation** - Manga/LN/Game adaptations
- **Staff** - Staff changes, casting announcements
- **Delay** - Production delays, postponements
- **Production** - Production issues, cancellations, studio news

## Display

News is displayed on the home page for both logged-in and logged-out users. The section shows the 6 most recent news items with:
- Featured images
- Category badges
- Source information
- Relative time stamps
- Links to original articles

