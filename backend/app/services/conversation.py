from threading import Lock

from app.models.schemas import ChatMessage


class ConversationStore:
    """Temporary process-memory storage. It disappears when the backend restarts."""

    def __init__(self) -> None:
        self._conversations: dict[str, list[ChatMessage]] = {}
        self._lock = Lock()

    def replace(self, conversation_id: str, messages: list[ChatMessage]) -> None:
        with self._lock:
            self._conversations[conversation_id] = list(messages)

    def get(self, conversation_id: str) -> list[ChatMessage]:
        with self._lock:
            return list(self._conversations.get(conversation_id, []))


conversation_store = ConversationStore()
