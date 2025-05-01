from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from google import genai
from typing import List, Optional
import os
from functools import lru_cache
from pydantic_settings import BaseSettings
import json
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware


# Environment configuration
class Settings(BaseSettings):
    gemini_api_key: str
    model_name: str = "gemini-2.0-pro"

    class Config:
        # Load from .env file
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create settings dependency
@lru_cache()
def get_settings():
    return Settings()


# FastAPI app setup
app = FastAPI(title="Word Enrichment API")

# Add CORS middleware to allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Pydantic model for word details
class WordDetails(BaseModel):
    CEFR: str
    type: str
    English: str
    Turkish: str


# Pydantic model for enriched word details (structured response)
class Example(BaseModel):
    en: str
    tr: str


class WordEnrichment(BaseModel):
    English: str
    Turkish: str
    CEFR: str
    type: str
    definition: str
    example: Example
    synonyms: List[str] = []  # Default to empty list if no synonyms
    notes: Optional[str] = None


# Helper function to enrich word using Gemini
def enrich_word(word_details: WordDetails, settings: Settings) -> WordEnrichment:
    try:
        # Initialize the client with API key from environment
        client = genai.Client(api_key=settings.gemini_api_key)

        prompt = f"""
        Enrich the following word with structured dictionary information.
        Return the response strictly in the following JSON schema:

        {{
          "English": string,
          "Turkish": string,
          "CEFR": string,
          "type": string,
          "definition": string,
          "example": {{
            "en": string,
            "tr": string
          }},
          "synonyms": [string],
          "notes": string (optional)
        }}

        Important instructions:
        1. The 'example' field must be an object with EXACTLY two fields: 'en' and 'tr'.
        2. The 'synonyms' field must be an array of strings. If there are no synonyms, return an empty array [].
        3. If no suitable note exists, you may omit the 'notes' field completely.

        Word: {word_details.English}
        Turkish translation: {word_details.Turkish}
        Type: {word_details.type}
        CEFR Level: {word_details.CEFR}
        """

        response = client.models.generate_content(
            model=settings.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
            },
        )

        # Parse the response manually
        try:
            response_json = response.text

            # First convert to dict to handle potential missing fields
            response_dict = json.loads(response_json)

            # Ensure synonyms is at least an empty list
            if "synonyms" not in response_dict or response_dict["synonyms"] is None:
                response_dict["synonyms"] = []

            # Ensure example contains only en and tr fields
            if "example" in response_dict and isinstance(
                response_dict["example"], dict
            ):
                # Extract only the required fields
                example_data = {
                    "en": response_dict["example"].get("en", ""),
                    "tr": response_dict["example"].get("tr", ""),
                }
                response_dict["example"] = example_data

            # Convert modified dict to JSON
            updated_json = json.dumps(response_dict)

            # Convert JSON to our Pydantic model
            result = WordEnrichment.model_validate_json(updated_json)
            return result
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Raw response: {response.text}")
            raise HTTPException(
                status_code=500, detail=f"Invalid JSON in Gemini response: {str(e)}"
            )
        except Exception as e:
            print(f"Error parsing response: {str(e)}")
            print(f"Response received: {response.text}")
            raise HTTPException(
                status_code=500, detail=f"Error parsing Gemini response: {str(e)}"
            )
    except Exception as e:
        # Log the error and raise an HTTP exception
        print(f"Error enriching word: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )


# Health check route
@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok"}


# Endpoint to receive word details and return enriched data
@app.post("/words/detail", response_model=dict, tags=["words"])
def receive_word(details: WordDetails, settings: Settings = Depends(get_settings)):
    enriched_data = enrich_word(details, settings)
    return {"message": "Word enriched successfully", "data": enriched_data}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
