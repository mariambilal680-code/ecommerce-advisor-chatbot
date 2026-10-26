from groq import Groq

from app.config import SYSTEM_PROMPT, Settings
from app.models.schemas import ChatMessage


class EcommerceAdvisor:
    """Generates e-commerce advice using Groq's hosted chat completion API."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None

    def generate_response(self, messages: list[ChatMessage]) -> str:
        if self.client is None:
            raise RuntimeError("The e_commerce_bot environment variable is not configured.")

        conversation = [{"role": "system", "content": SYSTEM_PROMPT}]
        conversation.extend(
            {"role": message.role, "content": message.content}
            for message in messages
            if message.role != "system"
        )

        completion = self.client.chat.completions.create(
            model=self.settings.groq_model,
            messages=conversation,
            max_completion_tokens=self.settings.max_new_tokens,
            temperature=self.settings.temperature,
        )
        response = completion.choices[0].message.content
        if not response or not response.strip():
            raise RuntimeError("Groq returned an empty response.")
        return response.strip()
