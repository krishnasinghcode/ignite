import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";

export default function SubmitSolution() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [form, setForm] = useState({
    repositoryUrl: "",
    techStack: "",
    writeup: ""
  });

  useEffect(() => {
    ProblemAPI.getProblemBySlug(slug).then(setProblem);
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await SolutionAPI.submitSolution({
      problemId: problem._id,
      repositoryUrl: form.repositoryUrl,
      techStack: form.techStack.split(",").map(t => t.trim()),
      writeup: { understanding: form.writeup }
    });

    navigate(`/problems/${slug}`);
  };

  if (!problem) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Submit Solution — {problem.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Repository URL"
          className="input input-bordered w-full"
          onChange={e => setForm({ ...form, repositoryUrl: e.target.value })}
        />

        <input
          placeholder="Tech Stack (comma separated)"
          className="input input-bordered w-full"
          onChange={e => setForm({ ...form, techStack: e.target.value })}
        />

        <textarea
          placeholder="Writeup (basic)"
          className="textarea textarea-bordered w-full"
          onChange={e => setForm({ ...form, writeup: e.target.value })}
        />

        <button className="btn btn-primary w-full">Submit</button>
      </form>
    </div>
  );
}
