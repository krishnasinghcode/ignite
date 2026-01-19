import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  Users, 
  ArrowLeft,
  Layout
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
        console.error(err);
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
      
      {/* 1. Navigation & Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit -ml-2 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{problem.domain}</Badge>
              <Badge variant="secondary">{problem.difficulty}</Badge>
              {problem.status !== "PUBLISHED" && (
                <Badge variant="destructive">Preview: {problem.status}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{problem.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl italic">"{problem.summary}"</p>
          </div>
          
          {problem.status === "PUBLISHED" && (
            <Button size="lg" onClick={() => navigate(`/problems/${problem.slug}/submit`)} className="shadow-lg shadow-primary/20">
              Submit Solution
            </Button>
          )}
        </div>
      </div>

      {/* 2. Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6 gap-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 pb-3 bg-transparent font-semibold transition-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 pb-3 bg-transparent font-semibold transition-none">
            Technical Brief
          </TabsTrigger>
          <TabsTrigger value="solutions" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 pb-3 bg-transparent font-semibold transition-none">
            Solutions ({solutions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-6">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" /> Description
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {problem.description || "No detailed description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionList icon={<Lightbulb className="text-amber-500" />} title="Context" items={[problem.context]} />
                <SectionList icon={<CheckCircle2 className="text-emerald-500" />} title="Objectives" items={problem.objectives} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionList icon={<ShieldAlert className="text-rose-500" />} title="Constraints" items={problem.constraints} color="bg-rose-500/5 border-rose-500/10" />
            <SectionList icon={<ClipboardList className="text-blue-500" />} title="Assumptions" items={problem.assumptions} color="bg-blue-500/5 border-blue-500/10" />
            <SectionList icon={<Users className="text-indigo-500" />} title="Evaluation Criteria" items={problem.evaluationCriteria} />
            <SectionList icon={<CheckCircle2 className="text-primary" />} title="Expected Deliverables" items={problem.expectedDeliverables} />
          </div>
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

// --- Reusable Small Components for UI Cleanliness ---

function SectionList({ icon, title, items, color = "bg-card border" }) {
  if (!items || items.length === 0 || !items[0]) return null;
  return (
    <Card className={`${color} shadow-sm`}>
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

function SolutionCard({ sol, navigate }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-5 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">{sol.userId?.name || "Anonymous User"}</h4>
          <div className="flex gap-2 mt-1">
            {sol.techStack?.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/solutions/${sol._id}`)}>
          View Full Solution
        </Button>
      </CardContent>
    </Card>
  );
}