import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await ProblemAPI.getAllProblems(params);
        setProblems(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [params]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select onValueChange={(value) => setParams({ ...params, domain: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Systems">Systems</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setParams({ ...params, difficulty: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Tags (comma separated)"
              onChange={(e) => setParams({ ...params, tags: e.target.value })}
            />

            <Button variant="secondary" onClick={() => setParams({})}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="text-center text-sm text-muted-foreground">Loading problems…</div>
      ) : problems.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground">No problems found</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => (
            <Card key={problem._id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="hover:underline"
                  >
                    {problem.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {problem.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{problem.domain}</Badge>
                  <Badge variant="secondary">{problem.difficulty}</Badge>
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button asChild size="sm" className="w-full">
                  <Link to={`/problems/${problem.slug}`}>View Problem</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
