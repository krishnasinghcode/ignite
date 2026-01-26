import { useNavigate } from "react-router-dom";
import ProblemForm from "@/components/problems/ProblemForm";
import { ProblemAPI } from "@/api/problems";

export default function CreateProblem() {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const problem = await ProblemAPI.createProblem(payload);

    if (payload.status === "PENDING_REVIEW") {
      alert("Problem submitted for review");
      navigate(`/problems/${problem.slug}`);
    } else {
      alert("Draft saved");
      navigate("/my-problems");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProblemForm
        mode="create"
        onSubmit={handleCreate}
        showSubmitForReview
      />
    </div>
  );
}
