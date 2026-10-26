from fastapi import APIRouter, HTTPException

from app.config import get_settings
from app.models.schemas import ChatMessage, ChatRequest, ChatResponse, HealthResponse
from app.services.chatbot import EcommerceAdvisor
from app.services.conversation import conversation_store

router = APIRouter(prefix="/api")
settings = get_settings()
advisor: EcommerceAdvisor | None = None


def set_advisor(service: EcommerceAdvisor) -> None:
    global advisor
    advisor = service


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model=settings.groq_model)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if advisor is None:
        raise HTTPException(status_code=503, detail="The advisor model is still loading.")

    user_messages = [message for message in request.messages if message.role != "system"]
    if not user_messages or user_messages[-1].role != "user":
        raise HTTPException(status_code=400, detail="The final message must be from the user.")

    conversation_store.replace(request.conversation_id, user_messages)
    try:
        answer = advisor.generate_response(user_messages)
    except Exception as error:
        raise HTTPException(status_code=503, detail="The advisor could not generate a response.") from error

    assistant_message = ChatMessage(role="assistant", content=answer)
    conversation_store.replace(request.conversation_id, [*user_messages, assistant_message])
    return ChatResponse(conversation_id=request.conversation_id, message=assistant_message)
