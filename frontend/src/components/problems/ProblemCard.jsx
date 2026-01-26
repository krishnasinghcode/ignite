import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProblemCard({ problem, onClick }) {
  return (
    <Card 
      className="group hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
              {problem.category}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {problem.difficulty}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {problem.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-1">
            {problem.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-none pt-3 md:pt-0">
          <div className="text-xs text-muted-foreground">
            {new Date(problem.createdAt).toLocaleDateString()}
          </div>
          <Button size="sm" variant="ghost" className="group-hover:translate-x-1 transition-transform">
            View <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}