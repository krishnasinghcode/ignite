import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Github, ArrowRight, User } from "lucide-react";
import ProblemPresenter from "@/components/problems/ProblemPresenter";

export default function ProblemPreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblemAndSolutions = async () => {
            setLoading(true);
            try {
                const resProblem = await ProblemAPI.getProblemById(id);
                setProblem(resProblem);
                // Make sure to fetch solutions using the ID from the response
                const resSolutions = await SolutionAPI.getSolutionsByProblem(resProblem._id);
                setSolutions(resSolutions);
            } catch (err) {
                console.error("Error fetching preview data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblemAndSolutions();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
    
    if (!problem) return (
        <div className="text-center py-20">
            <p className="text-muted-foreground">Problem not found</p>
            <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-12">
            {/* PROBLEM SECTION */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProblemPresenter problem={problem} showContent={true} />
            </section>

            <hr className="border-border/50" />

            {/* SOLUTIONS SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Community Solutions
                    </h2>
                    <Badge variant="secondary">{solutions.length} Submissions</Badge>
                </div>

                {solutions.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/30">
                        <p className="text-muted-foreground">No one has solved this yet. Be the first!</p>
                        <Button className="mt-4" onClick={() => navigate(`/problems/${problem._id}/submit`)}>
                            Submit a Solution
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {solutions.map(sol => (
                            <Card key={sol._id} className="group hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="font-semibold text-sm">{sol.userId?.name}</span>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(sol.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {/* Preview of the solution content (truncated) */}
                                            <p className="text-sm text-muted-foreground line-clamp-2 italic">
                                                {sol.content ? `${sol.content.substring(0, 150)}...` : "View implementation details..."}
                                            </p>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {sol.techStack?.slice(0, 3).map(tech => (
                                                    <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {sol.repositoryUrl && (
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={sol.repositoryUrl} target="_blank" rel="noreferrer">
                                                        <Github className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => navigate(`/solutions/${sol._id}`)}
                                                className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                            >
                                                View Solution <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}