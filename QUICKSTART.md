# Quick Start: OpenAI Integration for the Public Fridge

## What's Been Set Up

✅ **Backend Server** (`server.js`)
- Express.js server for secure OpenAI API calls
- Analyzes fridge interactions and generates contextual responses
- Adjusts mood and scores based on AI sentiment analysis

✅ **Frontend Integration**
- Text input → AI commentary on what people type
- Speech input → AI reactions to what people say
- Food clicks → AI observations about choices
- Door opens → AI reflections on patterns

✅ **Configuration Files**
- `package.json` - Node.js dependencies
- `.env.example` - Template for environment variables
- `.gitignore` - Prevent accidental .env commits
- `OPENAI_SETUP.md` - Detailed setup guide

## Getting Started (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure OpenAI API Key
```bash
cp .env.example .env
# Edit .env and paste your OpenAI API key after OPENAI_API_KEY=
```

Get your API key at: https://platform.openai.com/api-keys

### Step 3: Start the Backend
```bash
npm start
```

You should see:
```
🧊 Fridge server listening on port 3001
OpenAI API Key configured: Yes
```

## Testing It Out

1. Open `fridge/thisfridgetalks.html` in your browser
2. Try these interactions:
   - **Type something**: The fridge will respond with AI commentary
   - **Click a food item**: Get AI observations about your choice
   - **Open the door**: Trigger mood shifts based on patterns

## How It Works

### The Conversation Flow
```
User Action (text/speech/click)
    ↓
Frontend catches event
    ↓
Backend analyzes with OpenAI
    ↓
AI generates contextual response
    ↓
Mood/scores automatically adjust
    ↓
Fridge speaks the response
```

### Example Interactions

**Text Input:**
- User types: "I'm eating salad for health"
- AI responds: "Intention announced upfront. The fridge respects when the defense arrives before the verdict."
- Scores: Discipline ↑, Taste ↑

**Food Click:**
- User clicks: Processed soda can
- AI responds: "The fridge notices the pattern. Convenience repeats like a song with only one verse."
- Scores: Health ↓, Discipline ↓, Projection ↑

## What's Running Where

| Component | Location | Purpose |
|-----------|----------|---------|
| Backend | `localhost:3001` | Handles OpenAI API calls securely |
| Frontend | `fridge/thisfridgetalks.html` | Web interface for the fridge |
| Data | Browser localStorage | Persists fridge memory & state |

## Costs

- ~$0.0005-0.001 per interaction
- Typical session (50 interactions) = ~$0.03-0.05
- Heavy daily usage (~500 interactions) = ~$1-2/day

Monitor your OpenAI account at: https://platform.openai.com/account/billing/overview

## Troubleshooting

**Backend won't start:**
- Run: `npm install` first
- Check Node.js version: `node --version` (needs 18+)

**"Cannot connect to server":**
- Ensure backend is running on port 3001
- Check firewall isn't blocking port 3001

**"Invalid API key":**
- Verify key is correct in `.env`
- Keys start with `sk-`
- Regenerate at: https://platform.openai.com/api-keys

**No AI responses in browser:**
- Open browser console (F12 > Console)
- Look for error messages
- Check backend logs

## Next Steps

- Customize the fridge personality by editing `FRIDGE_SYSTEM` in `server.js`
- Add response caching to reduce API costs
- Implement rate limiting per session
- Deploy backend to production (Vercel, Heroku, etc.)

For detailed documentation, see `OPENAI_SETUP.md`

---

**Ready?** Run `npm start` and open the fridge! 🧊
