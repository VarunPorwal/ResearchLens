from pydantic import BaseModel, Field
from typing import List, Union, Optional

class MetricPoint(BaseModel):
    label: str = Field(description="Name of the metric (e.g., 'Sample Size', 'Accuracy', 'Year')")
    value: Union[float, int, str] = Field(description="Value of the metric")
    unit: Optional[str] = Field(description="Unit of measurement (e.g., '%', 'participants', 'years')")
    category: str = Field(description="Type of metric: 'numerical', 'temporal', or 'categorical'")

class ExtractedMetrics(BaseModel):
    paper_id: str
    metrics: List[MetricPoint]
