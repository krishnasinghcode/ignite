import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Eye, Edit3, Code } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MD_GUIDE = `
# Markdown Guide
| Result | Markdown |
| :--- | :--- |
| **Heading 1** | # Title |
| **Heading 2** | ## Subtitle |
| **Bold** | **text** |
| **Bullet List** | - item |
| **Code Block** | \` \` \` code \` \` \` |
| **Link** | [text](url) |
`;

export default function MarkdownEditor({ value, onChange, placeholder, name }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Code className="h-4 w-4" /> Content (Markdown)
        </label>
        
        <div className="flex gap-2">
          {/* Guide Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                <Info className="h-3 w-3" /> Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Markdown Cheat Sheet</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{MD_GUIDE}</ReactMarkdown>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-[200px] grid-cols-2 h-8 p-1">
          <TabsTrigger value="edit" className="text-xs gap-1">
            <Edit3 className="h-3 w-3" /> Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs gap-1">
            <Eye className="h-3 w-3" /> Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-2">
          <Textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="min-h-[250px] font-mono text-sm leading-relaxed"
            required
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[250px] p-4 border rounded-md bg-card overflow-y-auto">
            {value ? (
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-muted-foreground text-sm italic">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}