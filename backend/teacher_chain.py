import os
import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

load_dotenv()

class SyllabusManager:
    def __init__(self):
        self.syllabus = self._load_syllabus()

    def _load_syllabus(self):
        syllabus_path = Path(__file__).parent / "data" / "physics_syllabus.json"
        if not syllabus_path.exists():
            raise FileNotFoundError(f"Syllabus not found at {syllabus_path}")
        
        with open(syllabus_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def find_relevant_topics(self, query: str) -> list[dict]:
        """Find topics in the syllabus relevant to the query."""
        relevant_topics = []
        query_terms = set(query.lower().split())
        
        for unit in self.syllabus["units"]:
            unit_title = unit["title"].lower()
            
            # Check if query is related to the unit
            unit_relevance = any(term in unit_title for term in query_terms)
            
            for topic in unit["topics"]:
                topic_lower = topic.lower()
                # Check if query terms appear in the topic
                topic_relevance = any(term in topic_lower for term in query_terms)
                
                if unit_relevance or topic_relevance:
                    relevant_topics.append({
                        "unit": unit["title"],
                        "topic": topic,
                        "unit_number": unit["unit"]
                    })
        
        return relevant_topics

    def get_syllabus_context(self, query: str) -> dict:
        """Get relevant syllabus context for a query."""
        relevant_topics = self.find_relevant_topics(query)
        
        if not relevant_topics:
            # If no direct matches, return overview context
            return {
                "relevant_topics": [],
                "context_type": "general",
                "units": [unit["title"] for unit in self.syllabus["units"]]
            }
        
        # Get the unit containing most relevant topics
        unit_counts = {}
        for topic in relevant_topics:
            unit_counts[topic["unit"]] = unit_counts.get(topic["unit"], 0) + 1
        
        primary_unit = max(unit_counts.items(), key=lambda x: x[1])[0]
        
        # Get unit details
        unit_details = next(unit for unit in self.syllabus["units"] 
                          if unit["title"] == primary_unit)
        
        return {
            "relevant_topics": relevant_topics,
            "context_type": "specific",
            "primary_unit": primary_unit,
            "unit_topics": unit_details["topics"]
        }

# Global syllabus manager
syllabus_manager = SyllabusManager()

def get_teacher_chain():
    """
    Creates and returns a LangChain chain for the interactive teacher prompt.
    
    Returns:
        LLMChain: A chain ready to invoke with context variables
        
    Raises:
        ValueError: If GOOGLE_API_KEY is not set
        FileNotFoundError: If required files are not found
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY not found in environment. "
            "Please set it in .env file."
        )
    
    prompt_path = Path(__file__).parent / "prompts" / "flexible_teacher_prompt.txt"
    if not prompt_path.exists():
        raise FileNotFoundError(f"Prompt template not found at {prompt_path}")
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7
    )
    
    chat_prompt = ChatPromptTemplate.from_messages([
        ("human", prompt_template)
    ])
    
    chain = chat_prompt | llm
    
    return chain

def get_teaching_context(question: str):
    """
    Returns the teaching context based on the student's question.
    """
    return syllabus_manager.get_syllabus_context(question)
