import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArrayInput from "./ArrayInput";

const EMPTY_FORM = {
  title: "",
  summary: "",
  description: "",
  context: "",
  objectives: [],
  constraints: [],
  assumptions: [],
  domain: "Web",
  difficulty: "Easy",
  tags: [],
  expectedDeliverables: [],
  evaluationCriteria: [],
};

export default function ProblemForm({ mode, initialData, onSubmit, disabled = false, showSubmitForReview = true }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create Problem" : "Edit Problem"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Problem title"
            disabled={disabled}
            required
          />

          <Textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Short summary (max 300 chars)"
            disabled={disabled}
            maxLength={300}
            required
          />

          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed problem description"
            disabled={disabled}
            minH="160px"
            required
          />

          <Textarea
            name="context"
            value={form.context}
            onChange={handleChange}
            placeholder="Context / background (optional)"
            disabled={disabled}
          />

          <ArrayInput
            label="Objectives"
            values={form.objectives}
            onChange={(v) => setForm((p) => ({ ...p, objectives: v }))}
            disabled={disabled}
          />

          <ArrayInput
            label="Constraints"
            values={form.constraints}
            onChange={(v) => setForm((p) => ({ ...p, constraints: v }))}
            disabled={disabled}
          />

          <ArrayInput
            label="Assumptions"
            values={form.assumptions}
            onChange={(v) => setForm((p) => ({ ...p, assumptions: v }))}
            disabled={disabled}
          />

          <div className="flex gap-4">
            <Select
              value={form.domain}
              onValueChange={(value) => setForm((p) => ({ ...p, domain: value }))}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Systems">Systems</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.difficulty}
              onValueChange={(value) => setForm((p) => ({ ...p, difficulty: value }))}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ArrayInput
            label="Tags"
            values={form.tags}
            onChange={(v) => setForm((p) => ({ ...p, tags: v }))}
            disabled={disabled}
          />

          <ArrayInput
            label="Expected Deliverables"
            values={form.expectedDeliverables}
            onChange={(v) => setForm((p) => ({ ...p, expectedDeliverables: v }))}
            disabled={disabled}
          />

          <ArrayInput
            label="Evaluation Criteria"
            values={form.evaluationCriteria}
            onChange={(v) => setForm((p) => ({ ...p, evaluationCriteria: v }))}
            disabled={disabled}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => onSubmit(form, "draft")}
              disabled={loading || disabled}
              className="flex-1"
            >
              Save Draft
            </Button>

            {showSubmitForReview && (
              <Button
                type="button"
                onClick={() => onSubmit(form, "review")}
                disabled={loading || disabled}
                className="flex-1"
              >
                Submit for Review
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
