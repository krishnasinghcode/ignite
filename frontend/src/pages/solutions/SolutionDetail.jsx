import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Github, ExternalLink } from "lucide-react";

export default function SolutionDetail() {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const res = await SolutionAPI.getSolutionById(solutionId);
        setSolution(res);
        setUpvoted(res.hasLiked); 
        setCount(res.upvoteCount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [solutionId]);

  const handleUpvote = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await SolutionAPI.toggleUpvote(solutionId);
      setUpvoted(res.upvoted);
      setCount(prev => res.upvoted ? prev + 1 : prev - 1);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please login to upvote!");
      }
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!solution) return <p className="text-center py-20 text-muted-foreground">Solution not found</p>;

  const sections = [
    { title: "Understanding of Problem", content: solution.writeup?.understanding },
    { title: "Technical Approach", content: solution.writeup?.approach },
    { title: "System Architecture", content: solution.writeup?.architecture },
    { title: "Trade-offs Made", content: solution.writeup?.tradeoffs },
    { title: "Current Limitations", content: solution.writeup?.limitations },
    { title: "Project Outcome", content: solution.writeup?.outcome }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Problem
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-8">
        <div className="space-y-3">
          <Badge variant="secondary">Solution for Challenge</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{solution.problemId.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">Submitted by {solution.userId.name}</span>
            <span>•</span>
            <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <Button 
            variant={upvoted ? "default" : "outline"} 
            size="lg"
            className={`w-full md:w-auto gap-2 ${upvoted ? 'bg-rose-600 hover:bg-rose-700' : ''}`}
            onClick={handleUpvote}
            disabled={isLiking}
          >
            <Heart className={`h-5 w-5 ${upvoted ? 'fill-current' : ''}`} />
            {count} {upvoted ? 'Upvoted' : 'Upvote'}
          </Button>
          
          <div className="flex gap-2 w-full">
            {solution.repositoryUrl && (
              <Button asChild variant="secondary" className="flex-1 gap-2">
                <a href={solution.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" /> Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-10">
        {sections.map(({ title, content }) => content && (
          <section key={title} className="space-y-3">
            <h2 className="text-xl font-bold text-primary/90 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {title}
            </h2>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{content}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
