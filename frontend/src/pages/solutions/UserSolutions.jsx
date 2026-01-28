import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SolutionCard from "@/components/solutions/SolutionCard";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STATUS_ORDER = ["SUBMITTED", "APPROVED", "REJECTED", "UNDER_REVIEW"];

export default function UserSolutions() {
  const { userId: paramUserId } = useParams();
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  const userId = paramUserId || loggedInUser?._id;
  const isOwnProfile = loggedInUser?._id === userId;

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Fetch solutions with optional status filters
  const fetchSolutions = async (statuses) => {
    try {
      setLoading(true);
      const query = statuses?.length ? statuses.join(",") : undefined;
      const data = await SolutionAPI.getSolutionsByUser(userId, { status: query });
      setSolutions(data);
    } catch (err) {
      console.error("Failed to fetch solutions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchSolutions(selectedStatuses);
  }, [userId, selectedStatuses]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  // Upvote handler
  const handleUpvote = async (solutionId) => {
    try {
      const res = await SolutionAPI.toggleUpvote(solutionId);
      setSolutions((prev) =>
        prev.map((s) =>
          s._id === solutionId
            ? {
              ...s,
              hasLiked: res.upvoted,
              upvoteCount: res.upvoted
                ? (s.upvoteCount || 0) + 1
                : (s.upvoteCount || 0) - 1,
            }
            : s
        )
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {isOwnProfile ? "My Solutions" : "User Solutions"}
        </h1>
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter Status
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

      {/* Solutions List */}
      {solutions.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl">
          No solutions submitted yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {solutions.map((solution) => (
            <div key={solution._id} className="relative group">

              {/* Solution Card */}
              <SolutionCard
                sol={solution}
                onUpvote={() => handleUpvote(solution._id)}
                onView={() => navigate(`/solutions/${solution._id}`)}
                showEdit={isOwnProfile && !["APPROVED", "UNDER_REVIEW"].includes(solution.status)}
                showStatusTag={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
