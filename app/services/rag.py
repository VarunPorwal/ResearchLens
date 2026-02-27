import google.generativeai as genai
import os
import re
from typing import List, Dict
from app.services.embedding import EmbeddingService
from app.services.vector_store import VectorStoreService

class RAGService:
    @staticmethod
    def configure_genai(api_key: str):
        genai.configure(api_key=api_key)

    @staticmethod
    def retrieve(query: str, file_id: str, user_id: str, k: int = 5) -> List[str]:
        """
        Retrieves relevant text chunks for a query from a specific file's index.
        """
        # 1. Embed query
        query_embedding = EmbeddingService.embed_texts([query])[0]

        # 2. Load Index and Metadata
        index_path = os.path.join("data/indices", user_id, f"{file_id}.index")
        metadata_path = os.path.join("data/metadata", user_id, f"{file_id}.json")
        
        try:
            index = VectorStoreService.load_index(index_path)
            metadata = VectorStoreService.load_metadata(metadata_path)
        except FileNotFoundError:
            return []

        # 3. Search
        distances, indices = VectorStoreService.search(index, query_embedding, k=k)
        
        # 4. Filter and Retrieve Text
        results = []
        for idx in indices:
            if idx != -1: # Valid result
                # FAISS indices map to 0..N chunks. Metadata keys are strings of these indices.
                chunk_data = metadata.get(str(idx))
                if chunk_data:
                    results.append(chunk_data["text"])
        
        return results

    @staticmethod
    def generate_answer(query: str, context: List[str]) -> str:
        """
        Generates an answer using Gemini.
        """
        if not context:
            return "I couldn't find any relevant information in the document to answer your question."
            
        prompt = f"""You are a helpful research assistant. Answer the question based ONLY on the provided context.
Format your answer using clean Markdown with bullet points, bold text for emphasis, and proper structure to make it highly readable and visually appealing.
        
Context:
{chr(10).join(context)}

Question: {query}

Answer:"""

        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating answer: {str(e)}"

    @staticmethod
    def answer_question(query: str, file_id: str, api_key: str, user_id: str) -> Dict:
        """
        End-to-end RAG pipeline.
        """
        RAGService.configure_genai(api_key)
        
        context = RAGService.retrieve(query, file_id, user_id)
        answer = RAGService.generate_answer(query, context)
        
        return {
            "query": query,
            "answer": answer,
            "context": context
        }

    @staticmethod
    def summarize_document(file_id: str, api_key: str, user_id: str) -> str:
        """
        Generates a structured summary of the document.
        """
        RAGService.configure_genai(api_key)
        
        # Load metadata to get text content
        metadata_path = os.path.join("data/metadata", user_id, f"{file_id}.json")
        try:
            metadata = VectorStoreService.load_metadata(metadata_path)
            # Safe Strategy: Get all available keys, sort them numerically
            sorted_keys = sorted([k for k in metadata.keys()], key=lambda x: int(x))
            
            if not sorted_keys:
                return "Error: Document has no extracted text content."

            # Optimizaton: Take only first 2 chunks (Abstract/Intro) and last 1 chunk (Conclusion) for speed
            selected_keys = sorted_keys[:2]
            if len(sorted_keys) > 2:
                end_keys = sorted_keys[-1:]
                for k in end_keys:
                    if k not in selected_keys:
                        selected_keys.append(k)
                
            context_text = "\n".join([metadata[k]["text"] for k in selected_keys])
            
        except FileNotFoundError:
             return "Error: Document metadata not found."

        prompt = f"""You are a research analyst capable of summarizing academic papers from any discipline (Science, Humanities, Law, etc.). Analyze the following text and output a valid JSON object.
The JSON must strictly follow this structure:
{{
  "title": "Paper Title",
  "objective": "Main objective",
  "methodology": {{
    "approach": "Brief description",
    "tools": ["tool/source1", "tool/source2"]
  }},
  "key_findings": [
    {{"finding": "Finding 1", "evidence": "Short quote"}}
  ],
  "conclusion": "Brief conclusion"
}}

Text to analyze:
{context_text}

JSON Output:"""

        import re
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            print("--- RAW GEMINI SUMMARY RESPONSE ---")
            print(response.text)
            
            # Exact JSON structural extraction without greedy spanning
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            return text.strip() or "{}"
        except Exception as e:
            print(f"Error generating summary: {str(e)}")
            return f"{{\"error\": \"Error generating summary: {str(e)}\"}}"

    @staticmethod
    def compare_documents(file_ids: List[str], user_id: str, query: str = None, api_key: str = "") -> str:
        """
        Compares multiple documents.
        """
        RAGService.configure_genai(api_key)
        
        combined_context = ""
        
        for fid in file_ids:
            metadata_path = os.path.join("data/metadata", user_id, f"{fid}.json")
            try:
                metadata = VectorStoreService.load_metadata(metadata_path)
                
                sorted_keys = sorted([k for k in metadata.keys()], key=lambda x: int(x))
                if not sorted_keys:
                    continue
                
                # Get filename from first chunk safely
                source = metadata.get(sorted_keys[0], {}).get("source", f"Paper {fid}")
                
                # Heuristic: Get first 3 chunks (Intro) and last 1 chunk (Conclusion)
                selected_keys = sorted_keys[:3]
                if len(sorted_keys) > 3:
                     end_keys = sorted_keys[-1:]
                     for k in end_keys:
                         if k not in selected_keys:
                             selected_keys.append(k)
                
                paper_text = "\n".join([metadata[k]["text"] for k in selected_keys])
                
                combined_context += f"\n--- Document: {source} ---\n{paper_text}\n"
                
            except FileNotFoundError:
                combined_context += f"\n--- Document {fid} not found ---\n"

        import json

        prompt_query = query if query else "Compare these papers. Highlight similarities, differences, and unique contributions."

        prompt = f"""You are a research analyst. Compare the following research papers.
        
{prompt_query}

Context from Papers:
{combined_context}

Output a highly structured, valid JSON object exactly matching this format. Do NOT wrap it in markdown or output any surrounding text.
{{
  "metrics": [
    {{"metric": "Core Methodology", "val1": "[Paper 1 Value]", "val2": "[Paper 2 Value]"}},
    {{"metric": "Sample Size / Scope", "val1": "[Paper 1 Value]", "val2": "[Paper 2 Value]"}},
    {{"metric": "Key Finding", "val1": "[Paper 1 Value]", "val2": "[Paper 2 Value]"}}
  ],
  "contrasts": [
    "Difference 1",
    "Difference 2"
  ],
  "synergies": [
    "Similarity 1",
    "Similarity 2"
  ]
}}

Comparison Analysis JSON:"""

        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            print("--- RAW GEMINI COMPARE RESPONSE ---")
            print(response.text)
            
            # Exact JSON structural extraction without greedy spanning
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            return text.strip() or "{\"metrics\": [], \"contrasts\": [], \"synergies\": []}"
        except Exception as e:
            print(f"Error generating comparison: {str(e)}")
            return f"{{\"metrics\": [], \"contrasts\": [], \"synergies\": [], \"error\": \"{str(e)}\"}}"

    @staticmethod
    def extract_metrics(file_id: str, api_key: str, user_id: str) -> str:
        """
        Extracts structured metrics for visualization.
        """
        RAGService.configure_genai(api_key)
        
        # Load metadata to get text content
        metadata_path = os.path.join("data/metadata", user_id, f"{file_id}.json")
        try:
            metadata = VectorStoreService.load_metadata(metadata_path)
            
            sorted_keys = sorted([k for k in metadata.keys()], key=lambda x: int(x))
            if not sorted_keys:
                return "Error: Document has no extracted text content."
            
            count = len(sorted_keys)
            
            selected_keys = sorted_keys[:2] # Abstract/Intro
            
            if count > 2:
                end_keys = sorted_keys[-1:] # Conclusion
                for k in end_keys:
                     if k not in selected_keys:
                         selected_keys.append(k)
                         
            context_text = "\n".join([metadata[k]["text"] for k in selected_keys])
            
        except FileNotFoundError:
             return "Error: Document metadata not found."

        prompt = f"""You are a quantitative and qualitative data extraction AI. Analyze the text from this research paper and extract exactly 4 key structured metrics.
These metrics should be universally applicable across ANY field (Medicine, Humanities, Social Science, Physics, Law, CS, etc).
Do not focus ONLY on machine learning. Extract data points like: Dates, Number of subjects, Number of studies reviewed, Regional focus, Confidence intervals, Key percentage outcomes, Core variables, or Policy recommendations.

Output a valid JSON object with this structure:
{{
  "metrics": [
    {{
      "label": "Short descriptive label (e.g., 'Study Year', 'Sample Size', 'P-value', 'Key Era')",
      "value": "The actual value (number or short string)",
      "unit": "Unit of measurement if applicable, else null",
      "category": "numerical or temporal or categorical"
    }}
  ]
}}

Text to analyze:
{context_text}

JSON Output:"""

        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            print("--- RAW GEMINI ANALYTICS RESPONSE ---")
            print(response.text)
            
            # Exact JSON structural extraction without greedy spanning
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            return text.strip() or "{\"metrics\": []}"
        except Exception as e:
            print(f"Error extraction metrics: {str(e)}")
            return f"{{\"metrics\": [], \"error\": \"{str(e)}\"}}"
