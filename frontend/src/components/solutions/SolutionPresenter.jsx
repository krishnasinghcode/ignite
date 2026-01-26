import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

export default function SolutionPresenter({ solution }) {
  if (!solution) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Solution by {solution.userId?.name}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {solution.techStack?.map(tech => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {solution.repositoryUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={solution.repositoryUrl} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code
              </a>
            </Button>
          )}
          {solution.liveDemoUrl && (
            <Button size="sm" asChild>
              <a href={solution.liveDemoUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Demo
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none p-6 border rounded-xl bg-card">
        <ReactMarkdown>{solution.content}</ReactMarkdown>
      </div>
    </div>
  );
}