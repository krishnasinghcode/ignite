import { useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { useNavigate } from "react-router-dom";

export default function CreateProblem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    domain: "Web",
    difficulty: "Easy",
    tags: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.summary || !form.description) {
      alert("Title, summary and description are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        description: form.description,
        domain: form.domain,
        difficulty: form.difficulty,
        tags: form.tags
          ? form.tags.split(",").map(t => t.trim())
          : []
      };

      const problem = await ProblemAPI.createProblem(payload);

      // backend returns generated slug
      navigate(`/problems/${problem.slug}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Problem</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          onChange={handleChange}
        />

        <textarea
          name="summary"
          placeholder="Short summary (max 300 chars)"
          className="textarea textarea-bordered w-full"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Full problem description"
          className="textarea textarea-bordered w-full"
          onChange={handleChange}
        />

        <select
          name="domain"
          className="select select-bordered w-full"
          onChange={handleChange}
        >
          <option value="Web">Web</option>
          <option value="Backend">Backend</option>
          <option value="AI">AI</option>
          <option value="Systems">Systems</option>
        </select>

        <select
          name="difficulty"
          className="select select-bordered w-full"
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="input input-bordered w-full"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Create Problem"}
        </button>
      </form>
    </div>
  );
}
