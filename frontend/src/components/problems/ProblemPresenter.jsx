import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

export default function ProblemPresenter({ problem, showContent = true }) {
  if (!problem) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{problem.category}</Badge>
          <Badge variant="secondary">{problem.difficulty}</Badge>
          <Badge variant="outline">{problem.problemType}</Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{problem.title}</h1>
        <p className="text-lg text-muted-foreground italic">"{problem.summary}"</p>

        {problem.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] truncate">#{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {showContent && (
        <div className="prose prose-slate dark:prose-invert max-w-none border-t pt-6">
          <ReactMarkdown>{problem.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}