import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { useDebounce } from "@/hooks/useDebounce";

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

// Function to get badge colors for difficulty
const getDifficultyColor = (level) => {
  switch (level?.toLowerCase()) {
    case "easy":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "hard":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Main params state
  const [params, setParams] = useState({});

  // Debounce the search query
  const debouncedSearch = useDebounce(params.q, 400);

  // Fetch problems when filters or debounced search changes
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await ProblemAPI.getAllProblems({
          q: debouncedSearch,
          domain: params.domain,
          difficulty: params.difficulty,
        });
        setProblems(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [debouncedSearch, params.domain, params.difficulty]); // depend on primitive values only

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground">Select a challenge to start coding.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-card border rounded-xl shadow-xs">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background"
            placeholder="Search problems..."
            value={params.q || ""}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, q: e.target.value || undefined }))
            }
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Domain Filter */}
          <Select
            value={params.domain || "all"}
            onValueChange={(v) =>
              setParams((prev) => ({ ...prev, domain: v === "all" ? undefined : v }))
            }
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

          {/* Difficulty Filter */}
          <Select
            value={params.difficulty || "all"}
            onValueChange={(v) =>
              setParams((prev) => ({ ...prev, difficulty: v === "all" ? undefined : v }))
            }
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

          {/* Reset Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setParams({})}
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Problem List */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-muted animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {problems.map((problem) => (
            <Link
              key={problem._id}
              to={`/problems/${problem.slug}`}
              className="group block"
            >
              <Card className="transition-all hover:ring-1 hover:ring-primary/50 hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg truncate group-hover:text-primary">
                          {problem.title}
                        </span>
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {problem.domain}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 italic">
                        {problem.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(problem.difficulty)} px-3 py-1 font-medium`}
                      >
                        {problem.difficulty}
                      </Badge>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground">
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
