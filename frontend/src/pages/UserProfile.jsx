import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";

export default function UserProfile() {
  const { userId } = useParams();
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    SolutionAPI.getSolutionsByUser(userId).then(setSolutions);
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Public Solutions</h1>

      {solutions.length === 0 ? (
        <p>No public solutions.</p>
      ) : (
        <ul className="space-y-3">
          {solutions.map(sol => (
            <li key={sol._id} className="border p-3 rounded">
              <p className="font-semibold">{sol.problemId.title}</p>
              <Link
                to={`/solutions/${sol._id}`}
                className="text-blue-600 underline"
              >
                View Solution
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
