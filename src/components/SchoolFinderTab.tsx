import React, { useState, useMemo } from "react";
import { 
  Compass, 
  Search, 
  Filter, 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Award, 
  Sparkles, 
  Heart, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Building2, 
  Users, 
  BookOpen, 
  BarChart3, 
  RotateCcw,
  Star,
  Check,
  X,
  Zap
} from "lucide-react";

export interface School {
  id: string;
  name: string;
  location: string;
  type: "Public University" | "Private University" | "Liberal Arts" | "Technical Institute";
  ranking: number;
  acceptanceRate: number; // percentage
  avgGpa: number;
  avgSat: number;
  tuitionInState: number;
  tuitionOutState: number;
  avgNetPrice: number; // after financial aid
  topMajors: string[];
  setting: "Urban" | "Suburban" | "College Town";
  studentCount: string;
  gradRate: number;
  image: string;
  description: string;
  highlights: string[];
}

const mockSchools: School[] = [
  {
    id: "sch-1",
    name: "Stanford University",
    location: "Stanford, CA",
    type: "Private University",
    ranking: 3,
    acceptanceRate: 3.9,
    avgGpa: 3.96,
    avgSat: 1540,
    tuitionInState: 62484,
    tuitionOutState: 62484,
    avgNetPrice: 18200,
    topMajors: ["Computer Science", "Engineering", "Data Science", "Economics", "Human Biology"],
    setting: "Suburban",
    studentCount: "17,200",
    gradRate: 95,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    description: "World-class research university in Silicon Valley, renowned for innovation, entrepreneurship, and top-tier STEM programs.",
    highlights: ["#1 CS & Engineering Placement", "Generous Need-Based Aid", "Silicon Valley Tech Network"]
  },
  {
    id: "sch-2",
    name: "Massachusetts Institute of Technology (MIT)",
    location: "Cambridge, MA",
    type: "Technical Institute",
    ranking: 1,
    acceptanceRate: 4.1,
    avgGpa: 3.98,
    avgSat: 1560,
    tuitionInState: 60156,
    tuitionOutState: 60156,
    avgNetPrice: 20100,
    topMajors: ["Computer Science", "Mechanical Engineering", "Mathematics", "Physics", "Bioengineering"],
    setting: "Urban",
    studentCount: "11,800",
    gradRate: 96,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    description: "Global leader in scientific research, technological innovation, and quantitative problem solving.",
    highlights: ["Global Top STEM Hub", "100% Need-Blind Admissions", "Undergraduate Research Opportunities (UROP)"]
  },
  {
    id: "sch-3",
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    type: "Public University",
    ranking: 15,
    acceptanceRate: 11.4,
    avgGpa: 3.89,
    avgSat: 1480,
    tuitionInState: 14838,
    tuitionOutState: 44800,
    avgNetPrice: 19400,
    topMajors: ["Computer Science", "Electrical Engineering", "Economics", "Data Science", "Business"],
    setting: "Urban",
    studentCount: "45,300",
    gradRate: 93,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    description: "Premier public research university renowned for academic rigor, vibrant campus culture, and pioneering discoveries.",
    highlights: ["Top-Tier Public University", "Pioneering AI & EECS Faculty", "Vibrant Bay Area Campus"]
  },
  {
    id: "sch-4",
    name: "Carnegie Mellon University",
    location: "Pittsburgh, PA",
    type: "Private University",
    ranking: 22,
    acceptanceRate: 11.0,
    avgGpa: 3.91,
    avgSat: 1510,
    tuitionInState: 63100,
    tuitionOutState: 63100,
    avgNetPrice: 33500,
    topMajors: ["Computer Science", "Artificial Intelligence", "Robotics", "Design", "Information Systems"],
    setting: "Urban",
    studentCount: "15,800",
    gradRate: 92,
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=80",
    description: "Global powerhouse in Computer Science, Artificial Intelligence, Robotics, and Interdisciplinary Arts.",
    highlights: ["Dedicated School of Computer Science", "Pioneering Robotics Institute", "Top Tech Recruiting"]
  },
  {
    id: "sch-5",
    name: "University of Washington",
    location: "Seattle, WA",
    type: "Public University",
    ranking: 40,
    acceptanceRate: 48.0,
    avgGpa: 3.82,
    avgSat: 1380,
    tuitionInState: 12242,
    tuitionOutState: 40740,
    avgNetPrice: 14500,
    topMajors: ["Computer Science", "Bioengineering", "Nursing", "Business", "Psychology"],
    setting: "Urban",
    studentCount: "49,000",
    gradRate: 84,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&auto=format&fit=crop&q=80",
    description: "Major Pacific Northwest research institution with direct industry ties to Amazon, Microsoft, and biotech giants.",
    highlights: ["Paul G. Allen School of CS", "Strong Tech Industry Pipeline", "Incredible Pacific Northwest Location"]
  },
  {
    id: "sch-6",
    name: "Williams College",
    location: "Williamstown, MA",
    type: "Liberal Arts",
    ranking: 1, // Liberal Arts ranking
    acceptanceRate: 8.5,
    avgGpa: 3.94,
    avgSat: 1520,
    tuitionInState: 64540,
    tuitionOutState: 64540,
    avgNetPrice: 21000,
    topMajors: ["Mathematics", "Economics", "Biology", "Political Science", "Computer Science"],
    setting: "College Town",
    studentCount: "2,200",
    gradRate: 95,
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80",
    description: "Elite liberal arts college offering intimate Oxford-style tutorial learning and exceptional faculty mentorship.",
    highlights: ["#1 Liberal Arts College", "7:1 Student-Faculty Ratio", "Oxford-style Tutorial System"]
  }
];

export const SchoolFinderTab: React.FC = () => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedMajor, setSelectedMajor] = useState<string>("All");
  const [selectedSetting, setSelectedSetting] = useState<string>("All");
  const [maxBudget, setMaxBudget] = useState<number>(65000);
  const [maxAcceptance, setMaxAcceptance] = useState<number>(100);

  // Student Profile Inputs for Match Calculation
  const [userGpa, setUserGpa] = useState<number>(3.92);
  const [userSat, setUserSat] = useState<number>(1490);
  const [preferredMajor, setPreferredMajor] = useState<string>("Computer Science");

  // Saved / Bookmarked Schools
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["sch-1", "sch-3"]);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Active view: "all" or "bookmarked"
  const [viewTab, setViewTab] = useState<"all" | "bookmarked">("all");

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle comparison
  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 schools at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Calculate AI Match Score for a given school
  const calculateMatchScore = (school: School) => {
    let score = 70; // baseline

    // GPA delta
    const gpaDiff = userGpa - school.avgGpa;
    if (gpaDiff >= 0) score += 15;
    else if (gpaDiff >= -0.15) score += 8;
    else score -= 15;

    // SAT delta
    const satDiff = userSat - school.avgSat;
    if (satDiff >= 0) score += 15;
    else if (satDiff >= -50) score += 8;
    else score -= 10;

    // Major match
    if (school.topMajors.includes(preferredMajor)) {
      score += 10;
    }

    // Budget match
    if (school.avgNetPrice <= maxBudget) {
      score += 5;
    }

    // Cap between 40% and 99%
    return Math.min(99, Math.max(40, score));
  };

  const getMatchCategory = (school: School, matchScore: number) => {
    if (school.acceptanceRate < 10 && userGpa < school.avgGpa) {
      return { label: "Reach", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30" };
    }
    if (matchScore >= 88) {
      return { label: "Dream Fit", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    }
    if (matchScore >= 75) {
      return { label: "Target", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
    }
    return { label: "Safety", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
  };

  // Filtered Schools List
  const filteredSchools = useMemo(() => {
    return mockSchools.filter(school => {
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = school.name.toLowerCase().includes(query);
        const matchesLoc = school.location.toLowerCase().includes(query);
        const matchesMajor = school.topMajors.some(m => m.toLowerCase().includes(query));
        if (!matchesName && !matchesLoc && !matchesMajor) return false;
      }

      // View Tab filter
      if (viewTab === "bookmarked" && !bookmarkedIds.includes(school.id)) {
        return false;
      }

      // Type
      if (selectedType !== "All" && school.type !== selectedType) return false;

      // Setting
      if (selectedSetting !== "All" && school.setting !== selectedSetting) return false;

      // Major
      if (selectedMajor !== "All" && !school.topMajors.includes(selectedMajor)) return false;

      // Budget (Net price)
      if (school.avgNetPrice > maxBudget) return false;

      // Acceptance Rate
      if (school.acceptanceRate > maxAcceptance) return false;

      return true;
    });
  }, [searchQuery, viewTab, bookmarkedIds, selectedType, selectedSetting, selectedMajor, maxBudget, maxAcceptance]);

  const allMajors = Array.from(new Set(mockSchools.flatMap(s => s.topMajors)));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Aura Discovery
            </span>
            <span className="text-xs font-semibold text-slate-400">• Updated 2026 Admissions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2 mt-1">
            <Compass className="w-6 h-6 text-amber-500" />
            <span>Dynamic School Finder</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Match your GPA, test scores, target majors, and budget to find ideal universities, colleges, and institutes. AI calculates real-time match compatibility and admission odds.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setViewTab(viewTab === "all" ? "bookmarked" : "all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              viewTab === "bookmarked"
                ? "bg-pink-500 text-white border-pink-500 shadow-md"
                : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-500/50"
            }`}
          >
            <Heart className={`w-4 h-4 ${viewTab === "bookmarked" ? "fill-current" : "text-pink-500"}`} />
            <span>Saved Schools ({bookmarkedIds.length})</span>
          </button>

          {compareIds.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md flex items-center space-x-2"
            >
              <Layers className="w-4 h-4" />
              <span>Compare ({compareIds.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Profile Match Simulator Strip */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900 text-white rounded-2xl border border-indigo-500/30 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                <span>Personalized AI Match Calculator</span>
              </h3>
              <p className="text-[11px] text-indigo-200">
                Adjust your stats to dynamically calculate school admission compatibility across all profiles.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* GPA input */}
            <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-indigo-200 font-medium">Your GPA:</span>
              <input
                type="number"
                step="0.01"
                min="2.0"
                max="4.0"
                value={userGpa}
                onChange={(e) => setUserGpa(parseFloat(e.target.value) || 3.0)}
                className="w-14 bg-transparent font-black text-amber-300 outline-none text-center"
              />
            </div>

            {/* SAT input */}
            <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-indigo-200 font-medium">SAT Score:</span>
              <input
                type="number"
                step="10"
                min="400"
                max="1600"
                value={userSat}
                onChange={(e) => setUserSat(parseInt(e.target.value) || 1200)}
                className="w-16 bg-transparent font-black text-amber-300 outline-none text-center"
              />
            </div>

            {/* Preferred Major */}
            <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-indigo-200 font-medium">Focus Major:</span>
              <select
                value={preferredMajor}
                onChange={(e) => setPreferredMajor(e.target.value)}
                className="bg-slate-800 text-white font-bold text-xs rounded-md outline-none px-1.5 py-0.5 border border-indigo-400/40"
              >
                {allMajors.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + School Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filter Controls Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Filter className="w-4 h-4 text-amber-500" />
                <span>Filters & Criteria</span>
              </h3>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedMajor("All");
                  setSelectedSetting("All");
                  setMaxBudget(65000);
                  setMaxAcceptance(100);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-indigo-500 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search school name, city, major..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Institution Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Institution Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All">All Types</option>
                <option value="Public University">Public University</option>
                <option value="Private University">Private University</option>
                <option value="Liberal Arts">Liberal Arts College</option>
                <option value="Technical Institute">Technical Institute</option>
              </select>
            </div>

            {/* Major Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Specific Major Program</label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All">All Majors</option>
                {allMajors.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Campus Setting */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Campus Vibe / Setting</label>
              <select
                value={selectedSetting}
                onChange={(e) => setSelectedSetting(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All">All Settings</option>
                <option value="Urban">Urban City Campus</option>
                <option value="Suburban">Suburban Campus</option>
                <option value="College Town">Classic College Town</option>
              </select>
            </div>

            {/* Max Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Max Net Annual Price</label>
                <span className="font-bold text-amber-600 dark:text-amber-400">${maxBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="65000"
                step="2500"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Max Acceptance Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Max Acceptance Rate</label>
                <span className="font-bold text-amber-600 dark:text-amber-400">{maxAcceptance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxAcceptance}
                onChange={(e) => setMaxAcceptance(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* School Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-900 dark:text-white font-black">{filteredSchools.length}</span> matching institutions
            </span>
            {viewTab === "bookmarked" && (
              <span className="text-xs font-bold text-pink-500 flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Viewing Shortlisted Schools</span>
              </span>
            )}
          </div>

          {filteredSchools.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">No schools match your current criteria</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your budget filter or selecting "All Types" to discover more programs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchools.map((school) => {
                const matchScore = calculateMatchScore(school);
                const category = getMatchCategory(school, matchScore);
                const isBookmarked = bookmarkedIds.includes(school.id);
                const isComparing = compareIds.includes(school.id);

                return (
                  <div
                    key={school.id}
                    className="group rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Image Banner & Badges */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={school.image}
                          alt={school.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Top Action Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm ${category.color}`}>
                            {category.label} Match ({matchScore}%)
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBookmark(school.id)}
                              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                                isBookmarked
                                  ? "bg-pink-500 border-pink-400 text-white shadow-md"
                                  : "bg-slate-900/50 border-white/20 text-white hover:bg-slate-900/80"
                              }`}
                              title={isBookmarked ? "Remove from Shortlist" : "Save to Shortlist"}
                            >
                              <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>

                            <button
                              onClick={() => toggleCompare(school.id)}
                              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                                isComparing
                                  ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                                  : "bg-slate-900/50 border-white/20 text-white hover:bg-slate-900/80"
                              }`}
                              title={isComparing ? "Remove from Compare" : "Compare School"}
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* School Title over Banner */}
                        <div className="absolute bottom-3 left-4 right-4">
                          <div className="flex items-center space-x-1.5 text-indigo-300 text-[11px] font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{school.location}</span>
                            <span>•</span>
                            <span>{school.setting}</span>
                          </div>
                          <h3 className="text-lg font-black text-white truncate leading-tight mt-0.5">
                            {school.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {school.description}
                        </p>

                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Acceptance</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{school.acceptanceRate}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Net Price</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${school.avgNetPrice.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Grad Rate</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{school.gradRate}%</span>
                          </div>
                        </div>

                        {/* Top Programs / Majors Tags */}
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Top Academic Majors</span>
                          <div className="flex flex-wrap gap-1.5">
                            {school.topMajors.slice(0, 4).map((m) => (
                              <span
                                key={m}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                  m === preferredMajor
                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                            {school.topMajors.length > 4 && (
                              <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-bold">
                                +{school.topMajors.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Highlights List */}
                        <div className="space-y-1 pt-1">
                          {school.highlights.map((h, i) => (
                            <div key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                              <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => toggleCompare(school.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
                          isComparing
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                            : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-700"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isComparing ? "Selected for Compare" : "Compare Specs"}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Side-by-Side School Comparison</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Comparison Body Table */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-4 gap-4 divide-x divide-slate-200 dark:divide-slate-800">
                {/* Metric Labels Column */}
                <div className="space-y-6 text-xs font-bold text-slate-500 pt-16">
                  <div className="h-10 flex items-center">Institution Type</div>
                  <div className="h-10 flex items-center">Location & Setting</div>
                  <div className="h-10 flex items-center">Acceptance Rate</div>
                  <div className="h-10 flex items-center">Avg GPA Requirement</div>
                  <div className="h-10 flex items-center">Avg SAT Benchmark</div>
                  <div className="h-10 flex items-center">Net Annual Price</div>
                  <div className="h-10 flex items-center">Graduation Rate</div>
                  <div className="h-10 flex items-center">Top Majors</div>
                </div>

                {/* Compared School Columns */}
                {compareIds.map((id) => {
                  const school = mockSchools.find(s => s.id === id);
                  if (!school) return null;

                  return (
                    <div key={school.id} className="pl-4 space-y-6">
                      <div className="h-16 flex flex-col justify-center">
                        <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">{school.name}</h4>
                        <span className="text-[10px] text-indigo-500 font-bold">{school.type}</span>
                      </div>

                      <div className="h-10 flex items-center text-xs font-semibold text-slate-800 dark:text-slate-200">{school.type}</div>
                      <div className="h-10 flex items-center text-xs font-semibold text-slate-800 dark:text-slate-200">{school.location} ({school.setting})</div>
                      <div className="h-10 flex items-center text-xs font-black text-pink-600 dark:text-pink-400">{school.acceptanceRate}%</div>
                      <div className="h-10 flex items-center text-xs font-bold text-slate-800 dark:text-slate-200">{school.avgGpa}</div>
                      <div className="h-10 flex items-center text-xs font-bold text-slate-800 dark:text-slate-200">{school.avgSat}</div>
                      <div className="h-10 flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400">${school.avgNetPrice.toLocaleString()}</div>
                      <div className="h-10 flex items-center text-xs font-bold text-slate-800 dark:text-slate-200">{school.gradRate}%</div>
                      <div className="min-h-10 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        {school.topMajors.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors"
              >
                Done Comparing
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
