import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { Button } from "@/components/ui/button";
import ProblemCard from "@/components/problems/ProblemCard";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STATUS_ORDER = [
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
];

export default function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigate = useNavigate();

  // Fetch problems with optional status filters
  const fetchProblems = async (statuses) => {
    setLoading(true);
    try {
      const data = await ProblemAPI.getMyProblems(
        statuses?.length ? statuses.join(",") : undefined
      );

      // Sort by defined order
      const sorted = [...data].sort(
        (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
      );

      setProblems(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load + when filters change
  useEffect(() => {
    fetchProblems(selectedStatuses);
  }, [selectedStatuses]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">
        Loading your challenges...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Problems</h1>
        <Button asChild>
          <Link to="/problems/create">Create Problem</Link>
        </Button>
      </div>

      {/* FILTER DROPDOWN */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter status
              {selectedStatuses.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({selectedStatuses.length})
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            {STATUS_ORDER.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {status.replace("_", " ")}
              </DropdownMenuCheckboxItem>
            ))}

            {selectedStatuses.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedStatuses([])}
                >
                  Clear filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* PROBLEM LIST */}
      {problems.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <p className="text-muted-foreground">
            No problems found for selected status.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {problems.map((p) => (
            <ProblemCard
              key={p._id}
              problem={p}
              showEdit={true}
              onClick={() =>
                navigate(
                  p.status === "PUBLISHED"
                    ? `/problems/${p.slug}`
                    : `/problems/${p._id}/preview`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
