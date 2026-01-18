import { useState, useEffect } from "react";
import ArrayInput from "@/components/ArrayInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_WRITEUP = {
  understanding: "",
  approach: "",
  architecture: "",
  tradeoffs: "",
  limitations: "",
  outcome: "",
};

export default function SolutionForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    repositoryUrl: "",
    liveDemoUrl: "",
    techStack: [],
    isPublic: true,
    writeup: EMPTY_WRITEUP,
  });

  // Sync initialData if provided (for Edit Mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        repositoryUrl: initialData.repositoryUrl || "",
        liveDemoUrl: initialData.liveDemoUrl || "",
        techStack: initialData.techStack || [],
        isPublic: initialData.isPublic ?? true,
        writeup: { ...EMPTY_WRITEUP, ...initialData.writeup },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested writeup fields
    if (name.startsWith("writeup.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        writeup: { ...prev.writeup, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cleanup arrays and whitespace
    const cleanedData = {
      ...form,
      techStack: form.techStack.filter((t) => t && t.trim() !== ""),
    };
    
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION: LINKS & TECH */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Technical Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Repository URL *</label>
            <Input
              name="repositoryUrl"
              value={form.repositoryUrl}
              onChange={handleChange}
              placeholder="https://github.com/user/repo"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live Demo URL</label>
            <Input
              name="liveDemoUrl"
              value={form.liveDemoUrl}
              onChange={handleChange}
              placeholder="https://your-app.vercel.app"
            />
          </div>
        </div>

        <ArrayInput
          label="Tech Stack (e.g., React, Node.js, MongoDB)"
          values={form.techStack}
          onChange={(val) => setForm(p => ({ ...p, techStack: val }))}
          disabled={loading}
        />
      </section>

      {/* SECTION: THE WRITEUP */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Project Writeup</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">1. Understanding & Interpretation</label>
            <Textarea
              name="writeup.understanding"
              value={form.writeup.understanding}
              onChange={handleChange}
              placeholder="What were the core challenges of this problem?"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">2. Implementation Approach</label>
            <Textarea
              name="writeup.approach"
              value={form.writeup.approach}
              onChange={handleChange}
              placeholder="How did you structure your solution?"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">3. Architecture & Tradeoffs</label>
            <Textarea
              name="writeup.tradeoffs"
              value={form.writeup.tradeoffs}
              onChange={handleChange}
              placeholder="What tech choices did you make and why?"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </section>

      {/* VISIBILITY SETTINGS */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <input
          type="checkbox"
          id="isPublic"
          checked={form.isPublic}
          onChange={(e) => setForm(p => ({ ...p, isPublic: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
          Make this solution public for the community
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : initialData ? "Update Submission" : "Submit Solution"}
      </Button>
    </form>
  );
}