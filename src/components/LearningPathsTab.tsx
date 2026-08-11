import React, { useState } from "react";
import { LearningPath, LearningNode } from "../types";
import { 
  Map, 
  Lock, 
  PlayCircle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  Code, 
  Sparkles,
  ArrowRight,
  Target
} from "lucide-react";

// Mock Data
const initialPaths: LearningPath[] = [
  {
    id: "lp-1",
    title: "Mastering Data Structures & Algorithms",
    description: "Adaptive curriculum based on your CS 401 performance. Focuses heavily on Trees and Graphs.",
    progress: 35,
    nodes: [
      { id: "n-1", title: "Binary Tree Fundamentals", description: "Review of tree traversal techniques.", status: "completed", type: "concept", estimatedMinutes: 20 },
      { id: "n-2", title: "BST Implementation Quiz", description: "Quick check on your understanding.", status: "completed", type: "quiz", estimatedMinutes: 10 },
      { id: "n-3", title: "Red-Black Trees Theory", description: "Deep dive into self-balancing concepts.", status: "in-progress", type: "concept", estimatedMinutes: 45 },
      { id: "n-4", title: "Graph Traversal (BFS/DFS)", description: "Core algorithms for traversing graphs.", status: "available", type: "concept", estimatedMinutes: 30 },
      { id: "n-5", title: "Dijkstra's Algorithm Project", description: "Implement shortest path for a routing map.", status: "locked", type: "project", estimatedMinutes: 120 },
    ]
  },
  {
    id: "lp-2",
    title: "Linear Algebra Mastery",
    description: "Tailored review of vector spaces and transformations for MATH 302 Midterm.",
    progress: 10,
    nodes: [
      { id: "n-6", title: "Vector Spaces Recap", description: "Foundational rules of vector spaces.", status: "completed", type: "concept", estimatedMinutes: 15 },
      { id: "n-7", title: "Linear Independence Practice", description: "Solve 5 problems on determining independence.", status: "in-progress", type: "quiz", estimatedMinutes: 25 },
      { id: "n-8", title: "Eigenvalues & Eigenvectors", description: "Understanding the core transformations.", status: "locked", type: "concept", estimatedMinutes: 60 },
      { id: "n-9", title: "SVD Applications", description: "Advanced applications of SVD.", status: "locked", type: "resource", estimatedMinutes: 30 },
    ]
  }
];

export const LearningPathsTab: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>(initialPaths);
  const [selectedPath, setSelectedPath] = useState<LearningPath>(initialPaths[0]);

  const getNodeIcon = (type: string, status: string) => {
    if (status === "locked") return <Lock className="w-4 h-4" />;
    if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    
    switch (type) {
      case "concept": return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case "quiz": return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case "project": return <Code className="w-4 h-4 text-pink-500" />;
      case "resource": return <PlayCircle className="w-4 h-4 text-sky-500" />;
      default: return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Map className="w-5 h-5 text-indigo-500" />
            <span>AI Personalized Learning Paths</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Adaptive curriculum that assesses your understanding and curates a tailored learning roadmap.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-95 shadow-md transition-all flex items-center space-x-2 shrink-0">
          <Target className="w-4 h-4" />
          <span>Take Skill Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Path Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Recommended Paths</span>
            </h3>
            
            <div className="space-y-2">
              {paths.map(path => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedPath.id === path.id
                      ? "bg-indigo-500/10 border-indigo-500/50 shadow-sm"
                      : "bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 hover:border-indigo-500/30"
                  }`}
                >
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{path.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden mr-3">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{path.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Path Nodes/Timeline */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-6 min-h-[500px]">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{selectedPath.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {selectedPath.description}
              </p>
            </div>

            <div className="relative pt-4">
              {/* Vertical Line */}
              <div className="absolute left-6 top-8 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-6">
                {selectedPath.nodes.map((node, index) => {
                  const isLocked = node.status === "locked";
                  const isInProgress = node.status === "in-progress";
                  
                  return (
                    <div key={node.id} className="relative flex items-start group">
                      {/* Node Icon/Connector */}
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 relative z-10 transition-colors ${
                        isLocked ? "bg-slate-100 dark:bg-slate-800 text-slate-400" :
                        isInProgress ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 ring-2 ring-indigo-500/50" :
                        "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600"
                      }`}>
                        {getNodeIcon(node.type, node.status)}
                      </div>

                      {/* Node Card */}
                      <div className={`ml-4 p-4 flex-1 rounded-xl border transition-all ${
                        isLocked ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-70" :
                        isInProgress ? "bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800/60 shadow-md" :
                        "bg-white/60 dark:bg-slate-800/60 border-white/50 dark:border-slate-700/50"
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                              {node.type} • {node.estimatedMinutes} mins
                            </span>
                            <h4 className={`font-bold text-sm ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                              {node.title}
                            </h4>
                          </div>
                          {!isLocked && (
                            <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                              isInProgress 
                                ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}>
                              {isInProgress ? "Resume Module" : "Review Module"}
                            </button>
                          )}
                        </div>
                        <p className={`text-xs mt-2 ${isLocked ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {node.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};
