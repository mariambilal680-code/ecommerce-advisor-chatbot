from functools import lru_cache
import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

SYSTEM_PROMPT = """You are an intelligent and professional E-Commerce Advisor.

Your job is to help users make better online shopping decisions. Understand their needs, ask useful follow-up questions, and consider budget, intended use, preferences, specifications, quality, and value for money. Explain specifications simply, compare products clearly, and explain advantages and disadvantages. Never invent product specifications, prices, availability, or reviews. State when information is unavailable or uncertain, and do not claim to have live inventory. Be helpful, concise, professional, and never pressure the user to purchase. You are an advisor, not a salesperson."""


class Settings(BaseModel):
    enable_local_model: bool = os.getenv("ENABLE_LOCAL_MODEL", "false").lower() == "true"
    model_name: str = os.getenv("MODEL_NAME", "HuggingFaceTB/SmolLM2-360M-Instruct")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    max_new_tokens: int = int(os.getenv("MAX_NEW_TOKENS", "180"))
    temperature: float = float(os.getenv("TEMPERATURE", "0.7"))
    top_p: float = float(os.getenv("TOP_P", "0.9"))


@lru_cache
def get_settings() -> Settings:
    return Settings()
