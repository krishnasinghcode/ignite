import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, ShieldAlert, Lightbulb, CheckCircle2, 
  Users, ArrowLeft, Layout, Heart 
} from "lucide-react";

export default function ProblemDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemAndSolutions = async () => {
      setLoading(true);
      try {
        const resProblem = id
          ? await ProblemAPI.getProblemById(id)
          : await ProblemAPI.getProblemBySlug(slug);

        setProblem(resProblem);

        if (resProblem.status === "PUBLISHED") {
          const resSolutions = await SolutionAPI.getSolutionsByProblem(resProblem._id);
          setSolutions(resSolutions);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemAndSolutions();
  }, [slug, id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!problem) return <p className="text-center py-20 text-muted-foreground">Problem not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit -ml-2 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{problem.domain}</Badge>
              <Badge variant="secondary">{problem.difficulty}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{problem.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl italic">"{problem.summary}"</p>
          </div>
          <Button size="lg" onClick={() => navigate(`/problems/${problem.slug}/submit`)}>
            Submit Solution
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6 gap-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Brief</TabsTrigger>
          <TabsTrigger value="solutions">Solutions ({solutions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SectionList icon={<Lightbulb className="text-amber-500" />} title="Context" items={[problem.context]} />
          <SectionList icon={<CheckCircle2 className="text-emerald-500" />} title="Objectives" items={problem.objectives} />
        </TabsContent>

        <TabsContent value="solutions">
          {solutions.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No community solutions yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {solutions.map((sol) => (
                <SolutionCard key={sol._id} sol={sol} navigate={navigate} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SolutionCard({ sol, navigate }) {
  // 1. Initialize from props
  const [upvoted, setUpvoted] = useState(sol.hasLiked);
  const [count, setCount] = useState(sol.upvoteCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  // 2. Sync state when solutions list reloads or props change
  useEffect(() => {
    setUpvoted(sol.hasLiked);
    setCount(sol.upvoteCount || 0);
  }, [sol.hasLiked, sol.upvoteCount]);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await SolutionAPI.toggleUpvote(sol._id);
      setUpvoted(res.upvoted);
      setCount(prev => res.upvoted ? prev + 1 : prev - 1);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please login to upvote solutions!");
      }
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-colors group">
      <CardContent className="p-5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1 bg-secondary/30 p-2 rounded-lg min-w-[48px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 hover:bg-rose-500/10 ${upvoted ? 'text-rose-500' : 'text-muted-foreground'}`}
              onClick={handleUpvote}
              disabled={isLiking}
            >
              <Heart className={`h-5 w-5 ${upvoted ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-xs font-bold">{count}</span>
          </div>
          <div>
            <h4 className="font-bold text-lg leading-none">{sol.userId?.name || "Anonymous User"}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {sol.techStack?.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/solutions/${sol._id}`)}>
          View Detailed Writeup
        </Button>
      </CardContent>
    </Card>
  );
}

function SectionList({ icon, title, items }) {
  if (!items || items.length === 0 || !items[0]) return null;
  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="py-4 flex flex-row items-center gap-3 space-y-0">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-primary">•</span> {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
