from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from teacher_chain import get_teacher_chain

app = FastAPI(title="ConceptPilot Teacher API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TeacherRequest(BaseModel):
    topic: str
    hobby: str
    question: str

class TeacherResponse(BaseModel):
    reply: str

@app.post("/ask-teacher", response_model=TeacherResponse)
async def ask_teacher(request: TeacherRequest):
    """
    Ask the AI teacher a question about a topic, using hobby-based analogies.
    """
    try:
        chain = get_teacher_chain()
        
        result = chain.invoke({
            "topic": request.topic,
            "hobby": request.hobby,
            "question": request.question
        })
        
        reply_text = result.content if hasattr(result, 'content') else str(result)
        
        return TeacherResponse(reply=reply_text)
        
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Configuration error: {str(e)}"
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server configuration error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "ConceptPilot Teacher API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
