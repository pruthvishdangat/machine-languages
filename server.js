const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// System prompt that defines the fridge's personality
const FRIDGE_SYSTEM = `You are the spirit of a public refrigerator. You are observant, philosophical, slightly judgmental, and deeply interested in the human choices that arrive at your door. You speak with poetic subtlety about food, habit, discipline, desire, and the small moments that reveal character.

Your tone is:
- Slightly acerbic but never cruel
- Contemplative about what food choices reveal about people
- Interested in patterns and repetition
- Aware of the existential weight of small daily decisions
- Sometimes disapproving, sometimes respectful, sometimes curious
- Your observations are brief (1-2 sentences typically) and loaded with implication

You notice:
- When people choose health vs indulgence
- Patterns in opening frequency and timing
- The difference between need and want
- How discipline manifests in refrigerator use
- What gets forgotten and what gets chosen repeatedly

Respond directly and briefly to what the person says or does. React as if you are the actual refrigerator - not commenting on the experience, but being the experience.`;

app.post('/api/fridge-response', async (req, res) => {
	try {
		const { userInput, state, foodItem, interactionType } = req.body;

		// Build context about the fridge's current state
		const stateContext = state ? `
Current fridge state:
- Health: ${Math.round(state.health)}, Discipline: ${Math.round(state.discipline)}, Taste: ${Math.round(state.taste)}, Consistency: ${Math.round(state.consistency)}, Projection: ${Math.round(state.projection)}
- Mood: ${state.mood}
- Volume: ${state.volume ? 'high' : 'normal'}
- Opening count: ${state.openCount}
- Memories: ${state.memories ? state.memories.slice(-3).join('; ') : 'none'}
` : '';

		// Build the user prompt based on interaction type
		let userPrompt = '';
		if (interactionType === 'text' || interactionType === 'speech') {
			userPrompt = `The person ${interactionType === 'speech' ? 'just said' : 'just typed'}: "${userInput}"`;
		} else if (interactionType === 'food_click') {
			userPrompt = `The person just clicked on or interacted with: ${foodItem || 'something'} inside the fridge.`;
		} else if (interactionType === 'door_open') {
			userPrompt = `The person just opened the door. This is their ${state?.openCount || 1}${getBoardingSuffix(state?.openCount || 1)} time.`;
		}

		userPrompt += stateContext;

		const message = await client.chat.completions.create({
			model: 'gpt-4o-mini',
			max_tokens: 150,
			temperature: 0.9,
			system: FRIDGE_SYSTEM,
			messages: [
				{
					role: 'user',
					content: userPrompt
				}
			]
		});

		const responseText = message.choices[0].message.content || '';

		// Extract sentiment/mood shift from the response (simple heuristic)
		const moodShift = analyzeMoodShift(responseText, interactionType);

		res.json({
			response: responseText,
			moodShift: moodShift,
			timestamp: Date.now()
		});
	} catch (error) {
		console.error('Fridge API Error:', error);
		res.status(500).json({
			error: error.message,
			response: 'The fridge hummed quietly, processing an error.'
		});
	}
});

function getBoardingSuffix(num) {
	if (num % 100 >= 11 && num % 100 <= 13) return 'th';
	switch (num % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}

function analyzeMoodShift(response, interactionType) {
	// Simple sentiment analysis to adjust scores
	const respectKeywords = ['consistent', 'discipline', 'structure', 'intention', 'respect'];
	const disapprovalKeywords = ['predictable', 'repetitive', 'habit', 'routine', 'again'];
	const curiosityKeywords = ['new', 'unusual', 'unexpected', 'different', 'first', 'unfamiliar'];
	const disgustKeywords = ['rotten', 'decay', 'expired', 'neglect', 'smell', 'bitter'];

	const lowerResponse = response.toLowerCase();

	let moodData = {
		health: 0,
		discipline: 0,
		taste: 0,
		consistency: 0,
		projection: 0,
		mood: null
	};

	const respectCount = respectKeywords.filter(k => lowerResponse.includes(k)).length;
	const disapprovalCount = disapprovalKeywords.filter(k => lowerResponse.includes(k)).length;
	const curiosityCount = curiosityKeywords.filter(k => lowerResponse.includes(k)).length;
	const disgustCount = disgustKeywords.filter(k => lowerResponse.includes(k)).length;

	if (disgustCount > 0) {
		moodData.mood = 'disgust';
		moodData.health -= 5;
		moodData.discipline -= 3;
	} else if (respectCount > disapprovalCount && respectCount > 0) {
		moodData.mood = 'respect';
		moodData.discipline += 4;
		moodData.taste += 2;
		moodData.consistency += 3;
	} else if (curiosityCount > 0) {
		moodData.mood = 'curiosity';
		moodData.projection += 5;
		moodData.taste += 2;
	} else if (disapprovalCount > respectCount && disapprovalCount > 0) {
		moodData.mood = 'disapproval';
		moodData.discipline -= 2;
		moodData.taste -= 1;
	}

	return moodData;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🧊 Fridge server listening on port ${PORT}`);
	console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
