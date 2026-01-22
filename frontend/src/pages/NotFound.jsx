import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <Flame className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold">Page Not Found</h2>

          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or may have been moved.
            Please verify the URL or return to the homepage.
          </p>

          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/problems">Explore Projects</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
