import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { useDebounce } from "@/hooks/useDebounce";
import ProblemCard from "@/components/problems/ProblemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(params.q, 400);

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
  }, [debouncedSearch, params.domain, params.difficulty]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground">Select a challenge to start coding.</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search problems..."
            value={params.q || ""}
            onChange={(e) => setParams(prev => ({ ...prev, q: e.target.value || undefined }))}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={params.domain || "all"} onValueChange={(v) => setParams(prev => ({ ...prev, domain: v === "all" ? undefined : v }))}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Domain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
            </SelectContent>
          </Select>

          <Select value={params.difficulty || "all"} onValueChange={(v) => setParams(prev => ({ ...prev, difficulty: v === "all" ? undefined : v }))}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => setParams({})}><RotateCcw className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Problem List Section */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {problems.map((problem) => (
            <ProblemCard 
              key={problem._id} 
              problem={problem} 
              onClick={() => navigate(`/problems/${problem.slug}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}