from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from teacher_chain import get_teacher_chain, get_teaching_context

app = FastAPI(title="ConceptPilot Teacher API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import List, Optional

class TeacherRequest(BaseModel):
    topic: str
    hobby: str
    question: str

class RelevantTopic(BaseModel):
    unit: str
    topic: str
    unit_number: int

class TeacherResponse(BaseModel):
    reply: str
    relevant_topics: List[RelevantTopic]
    context_type: str
    primary_unit: Optional[str] = None

@app.post("/ask-teacher", response_model=TeacherResponse)
async def ask_teacher(request: TeacherRequest):
    """
    Ask the AI teacher a question about any physics topic, relating it to the syllabus.
    """
    try:
        chain = get_teacher_chain()
        
        # Get relevant syllabus context for the question
        syllabus_context = get_teaching_context(request.question)
        
        # Prepare the context string
        if syllabus_context["context_type"] == "specific":
            context_str = "This relates to the following topics in your syllabus:\\n"
            for topic in syllabus_context["relevant_topics"]:
                context_str += f"- {topic['topic']} (Unit: {topic['unit']})\\n"
            if "unit_topics" in syllabus_context:
                context_str += f"\\nOther topics in {syllabus_context['primary_unit']}:\\n"
                for topic in syllabus_context["unit_topics"]:
                    context_str += f"- {topic}\\n"
        else:
            context_str = "This is a general physics question. Your syllabus covers these units:\\n"
            for unit in syllabus_context["units"]:
                context_str += f"- {unit}\\n"
        
        result = await chain.ainvoke({
            "topic": request.topic,
            "hobby": request.hobby,
            "question": request.question,
            "syllabus_context": context_str
        })
        
        reply_text = result.content
        
        return TeacherResponse(
            reply=reply_text,
            relevant_topics=[RelevantTopic(**topic) for topic in syllabus_context.get("relevant_topics", [])],
            context_type=syllabus_context["context_type"],
            primary_unit=syllabus_context.get("primary_unit")
        )
        
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
