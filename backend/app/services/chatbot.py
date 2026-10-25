from threading import Lock

from app.config import SYSTEM_PROMPT, Settings
from app.models.schemas import ChatMessage


class EcommerceAdvisor:
    """Loads one local causal language Transformer and reuses it for requests."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.generator = None
        self.torch = None
        if settings.enable_local_model:
            try:
                import torch
                from transformers import pipeline

                self.torch = torch
                self.device = 0 if torch.cuda.is_available() else -1
                self.generator = pipeline(
                    "text-generation",
                    model=settings.model_name,
                    device=self.device,
                    torch_dtype=torch.float16 if self.device == 0 else torch.float32,
                )
            except Exception:
                self.generator = None
        self._generation_lock = Lock()

    def generate_response(self, messages: list[ChatMessage]) -> str:
        if self.generator is None:
            return self._fallback_response(messages)

        context = [{"role": "system", "content": SYSTEM_PROMPT}]
        context.extend(
            {"role": message.role, "content": message.content}
            for message in messages
            if message.role != "system"
        )

        with self._generation_lock, self.torch.inference_mode():
            result = self.generator(
                context,
                max_new_tokens=self.settings.max_new_tokens,
                temperature=self.settings.temperature,
                top_p=self.settings.top_p,
                do_sample=True,
                return_full_text=False,
            )

        generated = result[0].get("generated_text", "")
        if isinstance(generated, list):
            generated = generated[-1].get("content", "")
        response = str(generated).strip()
        return response or "I’m sorry, I couldn’t generate a useful answer. Could you rephrase that?"

    @staticmethod
    def _fallback_response(messages: list[ChatMessage]) -> str:
        latest_message = messages[-1].content if messages else "your purchase"
        return (
            f"I can help you evaluate {latest_message}. To narrow this down, "
            "please share your budget, intended use, must-have features, and any "
            "brands or trade-offs you prefer. I do not have live prices or inventory, "
            "so I will focus on the criteria that make a product a good fit."
        )
