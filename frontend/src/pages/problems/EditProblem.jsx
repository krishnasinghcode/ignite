import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemForm from "@/components/problems/ProblemForm";
import { ProblemAPI } from "@/api/problems";
import { Button } from "@/components/ui/button";

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    ProblemAPI.getProblemById(id).then(setProblem);
  }, [id]);

  if (!problem) return null;

  const editable = ["DRAFT", "REJECTED"].includes(problem.status);

  const handleUpdate = async (payload) => {
    await ProblemAPI.updateProblem(id, payload);
    alert("Problem updated");
    navigate("/my-problems");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this problem?")) return;
    await ProblemAPI.deleteProblem(id);
    navigate("/my-problems");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <ProblemForm
        mode="edit"
        initialData={problem}
        onSubmit={handleUpdate}
        disabled={!editable}
        showSubmitForReview={editable}
      />

      {editable && (
        <Button variant="destructive" onClick={handleDelete}>
          Delete Problem
        </Button>
      )}
    </div>
  );
}
