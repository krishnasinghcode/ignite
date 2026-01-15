import { useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { useNavigate } from "react-router-dom";

export default function CreateProblem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    context: "",
    objectives: "",
    constraints: "",
    assumptions: "",
    expectedDeliverables: "",
    evaluationCriteria: "",
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

  const handleSubmit = async (e, status = "DRAFT") => {
    e.preventDefault();

    if (!form.title || !form.summary || !form.description) {
      alert("Title, summary, and description are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        description: form.description,
        context: form.context,
        objectives: form.objectives
          ? form.objectives.split(",").map(o => o.trim()).filter(Boolean)
          : [],
        constraints: form.constraints
          ? form.constraints.split(",").map(c => c.trim()).filter(Boolean)
          : [],
        assumptions: form.assumptions
          ? form.assumptions.split(",").map(a => a.trim()).filter(Boolean)
          : [],
        expectedDeliverables: form.expectedDeliverables
          ? form.expectedDeliverables.split(",").map(d => d.trim()).filter(Boolean)
          : [],
        evaluationCriteria: form.evaluationCriteria
          ? form.evaluationCriteria.split(",").map(c => c.trim()).filter(Boolean)
          : [],
        domain: form.domain,
        difficulty: form.difficulty,
        tags: form.tags
          ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
          : [],
        status
      };

      const problem = await ProblemAPI.createProblem(payload);

      if (status === "PENDING_REVIEW") {
        alert("Problem submitted for review!");
        navigate(`/problems/${problem.slug}`);
      } else {
        alert("Draft saved!");
        navigate("/drafts"); // you'll need a Drafts page
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Problem</h1>

      <form className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="summary"
          placeholder="Short summary (max 300 chars)"
          className="textarea textarea-bordered w-full"
          value={form.summary}
          onChange={handleChange}
          maxLength={300}
          required
        />

        <textarea
          name="description"
          placeholder="Full problem description"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
          required
        />

        <textarea
          name="context"
          placeholder="Context (optional)"
          className="textarea textarea-bordered w-full"
          value={form.context}
          onChange={handleChange}
        />

        <input
          name="objectives"
          placeholder="Objectives (comma separated)"
          className="input input-bordered w-full"
          value={form.objectives}
          onChange={handleChange}
        />

        <input
          name="constraints"
          placeholder="Constraints (comma separated)"
          className="input input-bordered w-full"
          value={form.constraints}
          onChange={handleChange}
        />

        <input
          name="assumptions"
          placeholder="Assumptions (comma separated)"
          className="input input-bordered w-full"
          value={form.assumptions}
          onChange={handleChange}
        />

        <input
          name="expectedDeliverables"
          placeholder="Expected Deliverables (comma separated)"
          className="input input-bordered w-full"
          value={form.expectedDeliverables}
          onChange={handleChange}
        />

        <input
          name="evaluationCriteria"
          placeholder="Evaluation Criteria (comma separated)"
          className="input input-bordered w-full"
          value={form.evaluationCriteria}
          onChange={handleChange}
        />

        <select
          name="domain"
          className="select select-bordered w-full"
          value={form.domain}
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
          value={form.difficulty}
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
          value={form.tags}
          onChange={handleChange}
        />

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "DRAFT")}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            className="btn btn-primary flex-1"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "PENDING_REVIEW")}
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
