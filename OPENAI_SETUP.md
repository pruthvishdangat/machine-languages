# Public Fridge - OpenAI Integration Setup

## Overview

The Public Fridge now includes AI-powered responses via OpenAI. The backend server processes user interactions (text, speech, food clicks) and generates contextually aware, philosophically observant responses that influence the fridge's mood and behavior.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

## Setup Instructions

### 1. Install Backend Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management
- `openai` - OpenAI API client

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
NODE_ENV=development
```

⚠️ **Important**: Never commit `.env` to git. It's already in `.gitignore`.

### 3. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
🧊 Fridge server listening on port 3001
OpenAI API Key configured: Yes
```

### 4. Open the Website

Open `fridge/thisfridgetalks.html` in your browser. The fridge will now have AI-powered responses!

## How It Works

### API Endpoint

The server exposes one endpoint:

```
POST http://localhost:3001/api/fridge-response
```

**Request Body:**
```json
{
  "userInput": "What the person said or did",
  "state": { /* current fridge state object */ },
  "foodItem": "optional food item name",
  "interactionType": "text|speech|food_click|door_open"
}
```

**Response:**
```json
{
  "response": "The AI-generated fridge commentary",
  "moodShift": {
    "health": 0,
    "discipline": 2,
    "taste": 1,
    "consistency": 0,
    "projection": 3,
    "mood": "curiosity"
  },
  "timestamp": 1712778123456
}
```

### Fridge Personality System

The AI uses a detailed system prompt that defines the fridge as:
- **Observant**: Notices patterns in human behavior
- **Philosophical**: Reflects on desire, discipline, and choice
- **Slightly Judgmental**: Has opinions about food quality and habits
- **Poetic**: Speaks with subtlety and implication
- **Aware**: Understands the existential weight of small decisions

### Response Triggers

AI responses are generated when:

1. **Text Input**: User types in the text input field
2. **Speech Input**: User speaks (via microphone if enabled)
3. **Food Click**: User clicks on a food item in the 3D fridge
4. **Door Open**: User opens the fridge door

### Score Adjustments

The AI analysis automatically adjusts the fridge's scores based on detected sentiment:

- **Respect**: Detected by words like "consistent", "discipline", "structure" → increases discipline
- **Disapproval**: Detected by words like "predictable", "repetitive", "habit" → decreases discipline
- **Curiosity**: Detected by words like "new", "unusual", "unexpected" → increases projection
- **Disgust**: Detected by words like "rotten", "decay", "expired" → decreases health

## Troubleshooting

### "Cannot connect to server"
- Make sure the backend is running (`npm start`)
- Check that port 3001 is not blocked by firewall
- Verify the server is listening on `localhost:3001`

### "OPENAI_API_KEY is not set"
- Confirm `.env` file exists and has the correct key
- Restart the server after updating `.env`
- Check that the key format is correct: `sk-...`

### "API Error: Invalid authentication"
- Your OpenAI API key may be invalid or expired
- Check your API key at https://platform.openai.com/api-keys
- Regenerate a key if needed

### "CORS Error"
- Ensure the backend is running
- The server should have CORS enabled for` localhost:*`
- Check browser console for detailed error

### No AI Responses Appearing
- Check browser console (F12 > Console tab) for errors
- Check server console for API errors
- Verify the backend is responding to requests

## API Cost Considerations

Each interaction calls the Claude API. As of April 2026, costs are:

- Input: Minimal (typically $0.0001-0.0003 per request)
- Output: Minimal (typically $0.0003-0.001 per request)

The fridge generates responses for:
- Every text/speech submission
- Every food item click
- Door opens (only if clicked, not hovering)

**Estimate**: ~500 interactions per day = ~$1-2/day at typical usage.

Consider adding rate limiting or token budgets if needed.

## Development

### Project Structure

```
/machine-languages/
├── server.js                    # Express backend with OpenAI integration
├── package.json                 # Node dependencies
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example                # Template for .env
└── fridge/
    └── thisfridgetalks.html    # Main fridge experience (frontend)
```

### Frontend Integration

The frontend calls the API in three places:

1. **ingestSpeech()** - After processing text/speech input
2. **inspectItem()** - When a food item is clicked
3. **onPointerDown()** - Door open (if needed)

The API call is in `getFridgeAIResponse()` function.

### Modifying the Fridge Personality

To change the fridge's tone, edit the `FRIDGE_SYSTEM` constant in `server.js`. It contains the system prompt that defines how the fridge responds.

## Future Enhancements

- [ ] Cache responses to reduce API calls
- [ ] Add rate limiting per user/session
- [ ] Implement memory persistence across sessions
- [ ] Add mood-based response filtering
- [ ] Support for different AI models
- [ ] Custom personality configurations via UI

## License

Same as the main project.
