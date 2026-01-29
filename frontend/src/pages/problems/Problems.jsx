import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { MetadataAPI } from "@/api/metadata"; // Using your provided API utility
import { useDebounce } from "@/hooks/useDebounce";
import ProblemCard from "@/components/problems/ProblemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw, FilterX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/authContext";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]); // Will store dynamic "CATEGORY" metadata
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  const debouncedSearch = useDebounce(params.q, 400);

  // 1. Fetch Dynamic Categories from Metadata API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Using your getByType method to fetch only CATEGORY entries
        const data = await MetadataAPI.getByType("CATEGORY");
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch metadata categories:", err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch Problems based on active filters
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await ProblemAPI.getAllProblems({
          q: debouncedSearch,
          category: params.category, // Aligns with your ProblemSchema.category
          difficulty: params.difficulty,
          ...(user && params.saved ? { saved: params.saved } : {}),
        });
        setProblems(res);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [debouncedSearch, params.category, params.difficulty, params.saved, user]);

  const toggleSaved = () => {
    setParams((prev) => ({
      ...prev,
      saved: prev.saved === "true" ? undefined : "true",
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground">
          Select a challenge to solve and improve your skills.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-card border rounded-2xl shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-muted/20 border-none ring-offset-background"
            placeholder="Search problems..."
            value={params.q || ""}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                q: e.target.value || undefined,
              }))
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* DYNAMIC CATEGORY FILTER */}
          <Select
            value={params.category || "all"}
            onValueChange={(v) =>
              setParams((prev) => ({
                ...prev,
                category: v === "all" ? undefined : v,
              }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.key}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DIFFICULTY FILTER */}
          <Select
            value={params.difficulty || "all"}
            onValueChange={(v) =>
              setParams((prev) => ({
                ...prev,
                difficulty: v === "all" ? undefined : v,
              }))
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          {user && (
            <Button
              variant={params.saved === "true" ? "default" : "outline"}
              size="sm"
              onClick={toggleSaved}
            >
              Saved
            </Button>
          )}

          <Button variant="outline" size="icon" onClick={() => setParams({})} title="Reset Filters">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* List Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full bg-muted/40 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-muted/5">
            <FilterX className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No results found for your filters.</p>
            <Button variant="link" onClick={() => setParams({})}>Clear all filters</Button>
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
    </div>
  );
}