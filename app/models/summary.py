from pydantic import BaseModel, Field
from typing import List

class KeyFinding(BaseModel):
    finding: str = Field(description="A key finding from the paper")
    evidence: str = Field(description="Quote or section supporting the finding")

class Methodology(BaseModel):
    approach: str = Field(description="The research approach, framework, or method used")
    tools: List[str] = Field(description="Tools, models, datasets, or primary sources used")

class StructuredSummary(BaseModel):
    title: str = Field(description="Title of the paper")
    objective: str = Field(description="Main objective or research question")
    methodology: Methodology
    key_findings: List[KeyFinding]
    conclusion: str = Field(description="The final conclusion or implication")
    limitations: List[str] = Field(description="Limitations mentioned in the paper")
