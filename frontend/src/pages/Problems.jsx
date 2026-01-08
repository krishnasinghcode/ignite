import { useState, useEffect } from "react";
import { ProblemAPI } from "@/api/problems";
import { Link } from "react-router-dom";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="filters flex gap-2 mb-4">
        <select onChange={(e) => setParams({ ...params, domain: e.target.value })}>
          <option value="">All Domains</option>
          <option value="Web">Web</option>
          <option value="Backend">Backend</option>
          <option value="AI">AI</option>
          <option value="Systems">Systems</option>
        </select>

        <select onChange={(e) => setParams({ ...params, difficulty: e.target.value })}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="text"
          placeholder="Tags comma-separated"
          onChange={(e) => setParams({ ...params, tags: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : problems.length === 0 ? (
        <p>No problems found</p>
      ) : (
        <ul>
          {problems.map((problem) => (
            <li key={problem._id} className="border p-3 mb-2 rounded">
              <h3 className="font-bold">
                <Link to={`/problems/${problem.slug}`} className="hover:underline">
                  {problem.title}
                </Link>
              </h3>
              <p>{problem.summary}</p>
              <div className="flex gap-2 mt-1">
                <span className="badge">{problem.domain}</span>
                <span className="badge">{problem.difficulty}</span>
                {problem.tags.map((tag) => (
                  <span key={tag} className="badge badge-secondary">{tag}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
