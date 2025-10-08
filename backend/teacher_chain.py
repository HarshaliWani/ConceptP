import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

load_dotenv()

def get_teacher_chain():
    """
    Creates and returns a LangChain chain for the teacher prompt.
    
    Returns:
        LLMChain: A chain ready to invoke with topic, hobby, and question variables
        
    Raises:
        ValueError: If GOOGLE_API_KEY is not set
        FileNotFoundError: If the prompt template file is not found
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY not found in environment. "
            "Please set it in Replit Secrets or .env file."
        )
    
    prompt_path = Path(__file__).parent / "prompts" / "teacher_prompt.txt"
    if not prompt_path.exists():
        raise FileNotFoundError(f"Prompt template not found at {prompt_path}")
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=api_key,
        temperature=0.7
    )
    
    chat_prompt = ChatPromptTemplate.from_template(prompt_template)
    
    chain = chat_prompt | llm
    
    return chain
