from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router, set_advisor
from app.config import get_settings
from app.services.chatbot import EcommerceAdvisor

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    set_advisor(EcommerceAdvisor(settings))
    yield


app = FastAPI(title="E-Commerce Advisor API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "E-commerce Advisor API is running"}


app.include_router(router)
