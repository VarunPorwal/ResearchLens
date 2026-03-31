
# 🔍 ResearchLens

ResearchLens is a **Retrieval-Augmented Generation (RAG)** based research paper analysis platform that enables users to upload academic papers and receive **structured, AI-generated insights**.

It leverages advanced RAG techniques to extract **summaries, key concepts, methodologies, and conclusions**, while ensuring that all responses are **grounded in the original document** for high accuracy and reliability.

🌐 **Live Demo:** https://research-lens-sepia.vercel.app/

---

## ✨ Features

- 📄 **PDF Parsing & Ingestion**  
  Upload academic papers and extract fully searchable text and metadata.

- 💬 **Interactive AI Chat (RAG)**  
  Ask complex questions and receive context-aware answers grounded in your documents.

- 📝 **Smart Summarization**  
  Generate concise, structured summaries of long academic texts.

- 📊 **Document Comparison**  
  Compare methodologies, results, and insights across multiple papers.

- 🔐 **Secure Authentication & Storage**  
  Integrated with Supabase for secure user authentication and data management.

- ⚡ **Modern & Responsive UI**  
  Built with Next.js, Tailwind CSS, and Framer Motion for a fast and intuitive experience.

---

## 🛠️ Tech Stack

### Frontend
- Next.js  
- Tailwind CSS + shadcn/ui  
- Zustand  
- Framer Motion  
- Recharts  

### Backend
- FastAPI  
- FAISS (Vector Database)  
- Google Gemini (LLM)  
- HuggingFace (Embeddings)  
- PyPDF  

### Infrastructure
- Supabase (Authentication & Database)  
- Vercel (Deployment)  
