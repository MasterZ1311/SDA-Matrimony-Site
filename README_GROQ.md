# Groq + LLM integration

The AI engine now supports Groq for the language-generation layer. The deterministic compatibility score remains local so the 40/25/20/15 weighting is reproducible. Groq is used for natural-language compatibility explanations and icebreakers.

## Setup

1. Create a virtual environment.
2. Install `requirements.txt`.
3. Copy `.env.example` to `.env`.
4. Put your Groq API key in `GROQ_API_KEY`.
5. Run `uvicorn app.main:app --reload`.

Default model: `openai/gpt-oss-20b`. You can set `GROQ_MODEL` to another active Groq model without changing the application code.

## Endpoints

- `GET /v1/ai/status`
- `POST /v1/ai/explanation`
- `POST /v1/ai/icebreakers`

The API key is read only from an environment variable; never commit the real key.
