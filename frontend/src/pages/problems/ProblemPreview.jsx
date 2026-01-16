import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
                const resSolutions = await SolutionAPI.getSolutionsByProblem(resProblem._id);
                setSolutions(resSolutions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblemAndSolutions();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!problem) return <p>Problem not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{problem.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p>{problem.summary}</p>
                    <p className="whitespace-pre-line">{problem.description}</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{problem.domain}</Badge>
                        <Badge variant="secondary">{problem.difficulty}</Badge>
                        {problem.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Optional: show solutions if any */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Community Solutions</h2>
                {solutions.length === 0 ? (
                    <p>No solutions yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {solutions.map(sol => (
                            <Card key={sol._id}>
                                <CardHeader>
                                    <CardTitle>{sol.userId.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{sol.writeup}</p>
                                    {sol.repositoryUrl && (
                                        <a href={sol.repositoryUrl} target="_blank" rel="noopener noreferrer">
                                            View Repository
                                        </a>
                                    )}
                                    <Button variant="link" onClick={() => navigate(`/solutions/${sol._id}`)}>
                                        View Full Solution →
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
