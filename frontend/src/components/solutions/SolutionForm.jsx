import { useEffect, useState } from "react";
import ArrayInput from "@/components/ArrayInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText } from "lucide-react";

export default function SolutionForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    repositoryUrl: "",
    liveDemoUrl: "",
    techStack: [],
    isPublic: true,
    content: "",
  });

  const TEMPLATE = `## Understanding\nDescribe your understanding of the problem...\n\n## Approach\nExplain your solution approach...\n\n## Tradeoffs\nList tradeoffs and decisions made...\n\n## Limitations\nList known limitations or edge cases...\n\n## Outcome\nDescribe expected or actual outcome...`;

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

  const applyTemplate = () => {
    if (!form.content || confirm("Overwrite current content with template?")) {
      setForm(p => ({ ...p, content: TEMPLATE }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      techStack: form.techStack.filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={form.repositoryUrl}
          onChange={e => setForm(p => ({ ...p, repositoryUrl: e.target.value }))}
          placeholder="GitHub Repository URL"
          required
        />
        <Input
          value={form.liveDemoUrl}
          onChange={e => setForm(p => ({ ...p, liveDemoUrl: e.target.value }))}
          placeholder="Live demo URL (optional)"
        />
      </div>

      <ArrayInput
        label="Tech Stack"
        values={form.techStack}
        onChange={v => setForm(p => ({ ...p, techStack: v }))}
      />

      <div className="flex items-center gap-2 px-1">
        <input
          type="checkbox"
          id="isPublic"
          className="rounded border-gray-300 text-primary focus:ring-primary"
          checked={form.isPublic}
          onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
        />
        <label htmlFor="isPublic" className="text-sm font-medium leading-none">
          Make solution public
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            onClick={applyTemplate}
            className="text-xs text-muted-foreground gap-1"
          >
            <FileText className="h-3 w-3" /> Use Template
          </Button>
        </div>
        
        {/* INTEGRATED MARKDOWN EDITOR */}
        <MarkdownEditor
          value={form.content}
          onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
          placeholder="Write your solution implementation, architecture, and logic here..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting implementation..." : "Submit Solution"}
      </Button>
    </form>
  );
}