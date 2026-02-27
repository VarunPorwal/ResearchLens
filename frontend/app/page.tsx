"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight, Play, FileUp, MessageSquare, FileText,
  GitCompareArrows, BarChart3, Brain, Upload, Search,
  Lightbulb, Sparkles, Menu, X, User, Bot
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/auth-provider";

function CountUp({ end, suffix = "", decimals = 0 }: { end: number, suffix?: string, decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (inView) motionValue.set(end);
  }, [inView, motionValue, end]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals) + suffix);
    });
  }, [springValue, decimals, suffix]);

  return <span ref={ref}>{display}</span>;
}

const features = [
  {
    icon: <FileUp className="h-6 w-6 text-primary" />,
    title: "PDF Upload",
    description: "Drag and drop research papers in PDF format. Our system extracts and indexes content instantly for AI analysis."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Ask Questions",
    description: "Ask natural language questions about any uploaded paper and get precise, citation-backed answers in seconds."
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Structured Summary",
    description: "Get comprehensive paper summaries organized by methodology, findings, limitations, and future work."
  },
  {
    icon: <GitCompareArrows className="h-6 w-6 text-primary" />,
    title: "Paper Comparison",
    description: "Compare methodologies, results, and conclusions across multiple research papers side by side."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Visualization Dashboard",
    description: "Explore interactive charts and metrics that surface key patterns and trends from your research corpus."
  },
  {
    icon: <Brain className="h-6 w-6 text-primary" />,
    title: "Analytical Insights",
    description: "Uncover hidden connections between papers with AI-driven relationship mapping and insight generation."
  }
];

const steps = [
  {
    num: "01",
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "Upload Papers",
    description: "Drop your research PDFs into ResearchLens. We process and index every page using advanced document parsing."
  },
  {
    num: "02",
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Ask Anything",
    description: "Query your papers with natural language. Our RAG pipeline retrieves the most relevant context and generates precise answers."
  },
  {
    num: "03",
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Get Insights",
    description: "Receive structured summaries, key findings, and methodology breakdowns extracted intelligently from each paper."
  },
  {
    num: "04",
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Visualize & Compare",
    description: "Compare papers side-by-side, explore analytical dashboards, and discover connections across your research corpus."
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">


      {/* 1. NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">ResearchLens</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 border border-border/50 bg-secondary/30 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4" />
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Launch Now
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30">Log in</Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Launch Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* 2. HERO SECTION */}
      <main className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center">

        {/* Background Decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle ambient fade layer (optional, but helps text contrast on the rest of the page) */}
        <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-transparent via-[#050508]/80 to-[#050508] opacity-90 pointer-events-none z-[-1]" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-border/60 bg-secondary/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-foreground">AI-Powered Research Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mx-auto leading-tight"
          >
            Understand Research<br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">10x Faster</span>
            {" "}
            with AI
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty leading-relaxed"
          >
            Upload papers, ask questions, get structured summaries, and compare multiple research papers — all powered by advanced RAG intelligence.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group">
                Launch Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border/60 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50">
                <Play className="mr-2 h-4 w-4" /> View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 pt-10 border-t border-border/40 grid grid-cols-3 max-w-3xl mx-auto"
          >
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                <CountUp end={50} suffix="K+" />
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Papers Analyzed</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                <CountUp end={12} suffix="K+" />
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Researchers</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                <CountUp end={99.2} suffix="%" decimals={1} />
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Accuracy</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 mb-4">
              Everything you need for<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">research intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
              A complete suite of AI-powered tools designed to accelerate your research workflow from upload to insight.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 pb-2">
              From upload to insight<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">in minutes</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <span className="font-mono text-xs text-muted-foreground mb-2 block">Step {step.num}</span>
                <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[250px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEMO PREVIEW SECTION */}
      <section id="demo" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary">Preview</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2">
              See <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">ResearchLens</span> in action
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur-sm overflow-hidden"
          >
            {/* Browser Chrome */}
            <div className="h-10 border-b border-border/50 flex items-center px-4 bg-background/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-accent/60" />
              </div>
              <div className="mx-auto rounded-md bg-secondary/50 px-24 py-1 flex items-center">
                <span className="text-[10px] text-muted-foreground font-mono">researchlens.ai/dashboard</span>
              </div>
            </div>

            {/* Browser Content */}
            <div className="flex h-[500px]">
              {/* Mock Sidebar */}
              <div className="hidden md:flex flex-col w-48 border-r border-border/50 bg-[#121217] p-3">
                <div className="flex items-center gap-2 mb-6 ml-1 mt-1">
                  <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">RL</span>
                  </div>
                  <span className="text-xs font-bold">ResearchLens</span>
                </div>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[11px] text-muted-foreground rounded-lg">Upload</div>
                  <div className="px-3 py-2 text-[11px] bg-primary/10 text-primary font-medium rounded-lg">Chat</div>
                  <div className="px-3 py-2 text-[11px] text-muted-foreground rounded-lg">Summaries</div>
                  <div className="px-3 py-2 text-[11px] text-muted-foreground rounded-lg">Analytics</div>
                </div>
              </div>

              {/* Mock Main Area */}
              <div className="flex-1 p-4 grid sm:grid-cols-2 gap-4 bg-background overflow-hidden relative">
                <div className="absolute top-[10%] right-[10%] h-[200px] w-[200px] bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

                {/* Left Col */}
                <div className="space-y-4">
                  {/* Dropper */}
                  <div className="h-32 rounded-xl border-2 border-dashed border-border/60 bg-card/30 flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-[11px] text-muted-foreground">Drop PDFs here</span>
                  </div>
                  {/* Chat */}
                  <div className="flex-1 border border-border/50 rounded-xl bg-card/30 p-3 space-y-3">
                    <div className="flex justify-end gap-2 items-end">
                      <div className="bg-primary/10 p-2 rounded-lg rounded-tr-none text-[10px]">What are the key findings of this paper?</div>
                      <div className="h-5 w-5 rounded bg-primary flex flex-shrink-0 items-center justify-center">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded bg-accent flex flex-shrink-0 items-center justify-center mt-0.5">
                        <Bot className="h-3 w-3 text-accent-foreground" />
                      </div>
                      <div className="bg-secondary/50 p-2 rounded-lg rounded-tl-none text-[10px] leading-relaxed text-muted-foreground border border-border/40">
                        The key findings indicate the Transformer architecture significantly improves performance on sequence tasks, highlighting its capabilities in few-shot learning and efficient cross-domain transfer without the use of recurrence.
                      </div>
                    </div>
                    <div className="mt-8 relative">
                      <div className="h-8 rounded-md border border-border/50 bg-background w-full" />
                      <div className="absolute right-1.5 top-1.5 h-5 w-5 rounded bg-primary flex items-center justify-center">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-4 hidden sm:block">
                  {/* Summary slice */}
                  <div className="h-32 rounded-xl border border-border/50 bg-card/30 p-3">
                    <div className="text-[12px] font-semibold mb-2 flex items-center gap-1.5"><FileText className="h-3 w-3 text-primary" /> Summary generated</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="px-1.5 py-0.5 bg-secondary text-[9px] rounded text-primary">Methodology</div><div className="h-2 w-24 bg-border/40 rounded-full" /></div>
                      <div className="flex items-center gap-2"><div className="px-1.5 py-0.5 bg-secondary text-[9px] rounded text-accent">Key Finding</div><div className="h-2 w-32 bg-border/40 rounded-full" /></div>
                      <div className="flex items-center gap-2"><div className="px-1.5 py-0.5 bg-secondary text-[9px] rounded text-destructive">Limitation</div><div className="h-2 w-16 bg-border/40 rounded-full" /></div>
                    </div>
                  </div>
                  {/* Compare slice */}
                  <div className="flex-1 rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                    <div className="h-8 border-b border-border/50 bg-secondary/30 flex items-center px-3 text-[10px] font-medium text-muted-foreground gap-4">
                      <span className="w-16">Metric</span>
                      <span className="flex-1 text-primary">Paper A</span>
                      <span className="flex-1 text-accent">Paper B</span>
                    </div>
                    <div className="px-3 py-2 text-[10px] flex items-center gap-4 border-b border-border/20">
                      <span className="w-16 text-muted-foreground">Accuracy</span><span className="flex-1">94.2%</span><span className="flex-1">91.8%</span>
                    </div>
                    <div className="px-3 py-2 text-[10px] flex items-center gap-4 border-b border-border/20">
                      <span className="w-16 text-muted-foreground">F1 Score</span><span className="flex-1">0.93</span><span className="flex-1">0.89</span>
                    </div>
                    <div className="px-3 py-2 text-[10px] flex items-center gap-4">
                      <span className="w-16 text-muted-foreground">Latency</span><span className="flex-1">120ms</span><span className="flex-1">85ms</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-border/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">ResearchLens</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Contact</Link>
          </div>

          <div className="text-xs text-muted-foreground">
            Built with AI. Designed for researchers.
          </div>
        </div>
      </footer>
    </div>
  );
}
