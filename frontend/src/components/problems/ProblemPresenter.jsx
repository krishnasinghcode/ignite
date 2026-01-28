import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";

export default function ProblemPresenter({ problem }) {
  if (!problem) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-3">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          {problem.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{problem.category}</Badge>
          <Badge variant="secondary">{problem.difficulty}</Badge>
          <Badge>{problem.problemType}</Badge>
          {problem.status && (
            <Badge variant="success">{problem.status}</Badge>
          )}
        </div>

        {/* Summary */}
        {problem.summary && (
          <p className="text-muted-foreground text-sm">
            {problem.summary}
          </p>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="prose prose-neutral dark:prose-invert max-w-none pt-6">
        {/* Markdown Content */}
        {problem.content ? (
          <ReactMarkdown>{problem.content}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground">No content available.</p>
        )}

        {/* Tags */}
        {problem.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
