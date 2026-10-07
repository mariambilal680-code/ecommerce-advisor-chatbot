from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["system", "user", "assistant"]


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    conversation_id: str = Field(min_length=1, max_length=120)
    messages: list[ChatMessage] = Field(min_length=1, max_length=40)


class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage


class HealthResponse(BaseModel):
    status: str
    model: str
