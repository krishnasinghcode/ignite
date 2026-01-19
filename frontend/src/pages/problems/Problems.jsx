import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Search, RotateCcw, ChevronRight } from "lucide-react";

const getDifficultyColor = (level) => {
  switch (level.toLowerCase()) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'hard': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await ProblemAPI.getAllProblems(params);
        setProblems(res);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchProblems();
  }, [params]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      
      {/* Header Area */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground">Select a challenge to start coding.</p>
      </div>

      {/* 2. Filter Bar - Using Theme Variables instead of hardcoded Zinc */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-card border rounded-xl shadow-xs">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 bg-background"
            placeholder="Search tags..." 
            value={params.tags || ""}
            onChange={(e) => setParams({ ...params, tags: e.target.value })} 
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select 
            value={params.domain || "all"} 
            onValueChange={(v) => setParams({ ...params, domain: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={params.difficulty || "all"} 
            onValueChange={(v) => setParams({ ...params, difficulty: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setParams({})}
            title="Reset Filters"
            className="shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 3. Problem List */}
      {loading ? (
        <div className="grid gap-3">
            {[1,2,3].map(i => (
                <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-xl" />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {problems.map((problem) => (
            <Link key={problem._id} to={`/problems/${problem.slug}`} className="group block">
              <Card className="transition-all duration-200 hover:ring-1 hover:ring-primary/50 hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 sm:p-5 gap-4">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                          {problem.title}
                        </span>
                        <Badge variant="secondary" className="text-[10px] uppercase h-5">
                          {problem.domain}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 italic">
                        {problem.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)} border px-3 py-1 font-medium`}>
                        {problem.difficulty}
                      </Badge>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}