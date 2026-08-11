import React, { useState } from "react";
import { Course, Quiz, QuizQuestion } from "../types";
import { 
  CheckSquare, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft,
  Trophy,
  AlertCircle
} from "lucide-react";

const initialQuizzes: Quiz[] = [
  {
    id: "q-1",
    courseCode: "CS 401",
    title: "Midterm Review: Data Structures",
    description: "A quick review of Binary Search Trees, Heaps, and Graph Traversal algorithms.",
    timeLimit: 15,
    questions: [
      {
        id: "qq-1",
        type: "multiple-choice",
        question: "What is the time complexity of searching for an element in a balanced Binary Search Tree?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        explanation: "In a balanced BST, each comparison reduces the search space by half, leading to logarithmic time complexity."
      },
      {
        id: "qq-2",
        type: "short-answer",
        question: "What data structure is typically used to implement a Breadth-First Search (BFS)?",
        correctAnswer: "queue",
        explanation: "BFS uses a Queue (FIFO) to explore nodes level by level."
      },
      {
        id: "qq-3",
        type: "multiple-choice",
        question: "Which of the following is NOT a stable sorting algorithm?",
        options: ["Merge Sort", "Insertion Sort", "Bubble Sort", "Quick Sort"],
        correctAnswer: "Quick Sort",
        explanation: "Quick Sort is generally unstable because it swaps non-adjacent elements."
      }
    ]
  },
  {
    id: "q-2",
    courseCode: "MATH 302",
    title: "Linear Algebra Fundamentals",
    description: "Test your knowledge on vectors, matrices, and linear independence.",
    timeLimit: 10,
    questions: [
      {
        id: "qq-4",
        type: "multiple-choice",
        question: "What is the determinant of a matrix with two identical rows?",
        options: ["1", "0", "-1", "Depends on the matrix size"],
        correctAnswer: "0",
        explanation: "If a matrix has two identical rows (or columns), its determinant is always 0, indicating it is not invertible."
      }
    ]
  }
];

interface QuizTabProps {
  courses: Course[];
}

export const QuizTab: React.FC<QuizTabProps> = ({ courses }) => {
  const [quizzes] = useState<Quiz[]>(initialQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [score, setScore] = useState(0);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    
    let currentScore = 0;
    activeQuiz.questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });
    
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

  if (activeQuiz) {
    if (isSubmitted) {
      // Performance Report View
      const percentage = Math.round((score / activeQuiz.questions.length) * 100);
      
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <button 
            onClick={closeQuiz}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quizzes</span>
          </button>
          
          <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm text-center space-y-4">
            <Trophy className={`w-12 h-12 mx-auto ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quiz Completed!</h2>
            <p className="text-slate-600 dark:text-slate-400">
              You scored <span className="font-bold text-slate-900 dark:text-white">{score}</span> out of <span className="font-bold text-slate-900 dark:text-white">{activeQuiz.questions.length}</span> ({percentage}%)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              <span>Detailed Review</span>
            </h3>
            
            {activeQuiz.questions.map((q, idx) => {
              const userAnswer = answers[q.id]?.trim().toLowerCase();
              const correctAnswer = q.correctAnswer.trim().toLowerCase();
              const isCorrect = userAnswer === correctAnswer;

              return (
                <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50' : 'bg-pink-50/50 border-pink-200 dark:bg-pink-950/20 dark:border-pink-900/50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="text-xs space-y-1">
                        <p className="text-slate-500">Your Answer: <span className={`font-semibold ${isCorrect ? 'text-emerald-600' : 'text-pink-600'}`}>{answers[q.id] || "No Answer"}</span></p>
                        {!isCorrect && (
                          <p className="text-slate-500">Correct Answer: <span className="font-semibold text-emerald-600">{q.correctAnswer}</span></p>
                        )}
                      </div>
                      <div className="mt-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-pink-500 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Active Quiz View
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={closeQuiz}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>
          {activeQuiz.timeLimit && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4" />
              <span>{activeQuiz.timeLimit} mins target</span>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{activeQuiz.title}</h2>
            </div>
          </div>

          {currentQuestion && (
            <div className="space-y-6 min-h-[200px]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h3>
              
              {currentQuestion.type === "multiple-choice" && currentQuestion.options ? (
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        answers[currentQuestion.id] === opt
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-sm"
                          : "bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={currentQuestion.id} 
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={() => handleAnswerChange(currentQuestion.id, opt)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-30 transition-opacity"
            >
              Previous
            </button>
            
            {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-500 transition-colors"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-500" />
            <span>Quizzes & Assessments</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your knowledge, get instant feedback, and track your learning progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => {
          const course = courses.find(c => c.code === quiz.courseCode);
          return (
            <div key={quiz.id} className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${course ? course.bgGradient : 'bg-slate-100'} text-white shadow-sm`}>
                    {quiz.courseCode}
                  </span>
                  {quiz.timeLimit && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{quiz.timeLimit}m</span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{quiz.description}</p>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{quiz.questions.length} Questions</span>
                </div>
              </div>
              
              <button 
                onClick={() => startQuiz(quiz)}
                className="mt-6 w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Assessment</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
