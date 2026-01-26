import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ArrayInput from "../ArrayInput";
import { MetadataAPI } from "@/api/metadata";

const EMPTY_FORM = {
  title: "",
  summary: "",
  content: "",
  category: "",
  problemType: "",
  difficulty: "EASY",
  tags: [],
};

export default function ProblemForm({
  mode,
  initialData,
  onSubmit,
  disabled = false,
  showSubmitForReview = true,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [meta, setMeta] = useState({
    categories: [],
    problemTypes: [],
  });
  const [loading, setLoading] = useState(false);

  /* -------------------- Load Metadata -------------------- */
  useEffect(() => {
    const loadMetadata = async () => {
      const data = await MetadataAPI.getAll();

      setMeta({
        categories: data.filter(m => m.type === "CATEGORY"),
        problemTypes: data.filter(m => m.type === "PROBLEM_TYPE"),
      });
    };

    loadMetadata();
  }, []);

  /* -------------------- Edit Mode Sync -------------------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({ ...EMPTY_FORM, ...initialData });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const submit = async (action) => {
    setLoading(true);

    await onSubmit({
      ...form,
      category: form.category.toUpperCase(),
      problemType: form.problemType.toUpperCase(),
      difficulty: form.difficulty.toUpperCase(),
      status: action === "review" ? "PENDING_REVIEW" : "DRAFT",
    });

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create Problem" : "Edit Problem"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
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
            placeholder="Short summary (max 300 characters)"
            maxLength={300}
            required
          />

          <Textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write the full problem statement in Markdown..."
            className="min-h-[220px]"
            required
          />

          {/* Category + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={form.category}
              onValueChange={(v) => setForm(p => ({ ...p, category: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {meta.categories.map(c => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={form.problemType}
              onValueChange={(v) => setForm(p => ({ ...p, problemType: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Problem Type" />
              </SelectTrigger>
              <SelectContent>
                {meta.problemTypes.map(p => (
                  <SelectItem key={p.key} value={p.key}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <Select
            value={form.difficulty}
            onValueChange={(v) => setForm(p => ({ ...p, difficulty: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <ArrayInput
            label="Tags"
            values={form.tags}
            onChange={(v) => setForm(p => ({ ...p, tags: v }))}
          />

          <div className="flex gap-2">
            <Button type="button" onClick={() => submit("draft")} className="flex-1">
              Save Draft
            </Button>

            {showSubmitForReview && (
              <Button type="button" onClick={() => submit("review")} className="flex-1">
                Submit for Review
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
