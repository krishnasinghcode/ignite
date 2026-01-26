import { useEffect, useState } from "react";
import ArrayInput from "@/components/ArrayInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SolutionForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    repositoryUrl: "",
    liveDemoUrl: "",
    techStack: [],
    isPublic: true,
    content: "", // user writes free Markdown
  });

  // Optional template content
  const TEMPLATE = `
## Understanding
Describe your understanding of the problem...

## Approach
Explain your solution approach...

## Tradeoffs
List tradeoffs and decisions made...

## Limitations
List known limitations or edge cases...

## Outcome
Describe expected or actual outcome...
`;

  useEffect(() => {
    if (initialData) {
      setForm({
        repositoryUrl: initialData.repositoryUrl || "",
        liveDemoUrl: initialData.liveDemoUrl || "",
        techStack: initialData.techStack || [],
        isPublic: initialData.isPublic ?? true,
        content: initialData.content || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      repositoryUrl: form.repositoryUrl,
      liveDemoUrl: form.liveDemoUrl,
      techStack: form.techStack.filter(Boolean),
      isPublic: form.isPublic,
      content: form.content, // user-written Markdown
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        value={form.repositoryUrl}
        onChange={e => setForm(p => ({ ...p, repositoryUrl: e.target.value }))}
        placeholder="Repository URL"
        required
      />

      <Input
        value={form.liveDemoUrl}
        onChange={e => setForm(p => ({ ...p, liveDemoUrl: e.target.value }))}
        placeholder="Live demo URL (optional)"
      />

      <ArrayInput
        label="Tech Stack"
        values={form.techStack}
        onChange={v => setForm(p => ({ ...p, techStack: v }))}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
        />
        <span>Make solution public</span>
      </div>

      {/* Markdown content area */}
      <Textarea
        value={form.content}
        onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
        placeholder="Write your solution in Markdown..."
        className="min-h-[200px]"
        required
      />

      {/* Button to show template example */}
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            Show Markdown Template Example
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Example Markdown Structure</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap">{TEMPLATE}</pre>
        </DialogContent>
      </Dialog>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Solution"}
      </Button>
    </form>
  );
}
