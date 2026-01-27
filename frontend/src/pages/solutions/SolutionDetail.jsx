import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Github, ExternalLink, User, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground -ml-2 hover:bg-transparent hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Problem
        </Button>
        <div className="flex gap-2">
          {solution.repositoryUrl && (
            <Button variant="ghost" size="icon" asChild title="View Code">
              <a href={solution.repositoryUrl} target="_blank" rel="noreferrer"><Github className="h-5 w-5" /></a>
            </Button>
          )}
          {solution.liveDemoUrl && (
            <Button variant="ghost" size="icon" asChild title="Live Demo">
              <a href={solution.liveDemoUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-5 w-5" /></a>
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Area */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/15 px-3">
            {solution.problemId?.category || "Solution"}
          </Badge>
          {/* PROBLEM TITLE - NOW BIGGER */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {solution.problemId?.title}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-border/50">
          <div className="flex items-center gap-6">
            {/* AUTHOR - SMALLER & SUBTLE */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">Author</p>
                <p className="text-sm font-medium">{solution.userId?.name}</p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-border hidden md:block" />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {new Date(solution.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* UPVOTE - SMALLER & SLEEKER */}
          <Button 
            variant={upvoted ? "default" : "outline"} 
            size="sm"
            className={`rounded-full px-4 h-9 gap-2 transition-all duration-300 ${upvoted ? 'bg-rose-500 hover:bg-rose-600 border-rose-500' : 'hover:border-rose-500 hover:text-rose-500'}`}
            onClick={handleUpvote}
            disabled={isLiking}
          >
            <Heart className={`h-4 w-4 ${upvoted ? 'fill-current' : ''}`} />
            <span className="font-bold text-xs">{count}</span>
          </Button>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {solution.techStack?.map(tech => (
          <Badge key={tech} variant="secondary" className="bg-secondary/50 text-secondary-foreground border-none">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Markdown Content */}
      <div className="pt-4">
        <article className="prose prose-slate dark:prose-invert max-w-none 
          prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-code:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {solution.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}