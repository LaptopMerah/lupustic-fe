"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, RefreshCw } from "lucide-react";

interface ResultActionCardProps {
  classification: string;
  confidence: number;
  sessionId: string;
  onRetry: () => void;
}

export function ResultActionCard({
  classification,
  confidence,
  sessionId,
  onRetry,
}: ResultActionCardProps) {
  const router = useRouter();
  const isLupus = classification === "Lupus";

  const handleProceedToChat = () => {
    sessionStorage.setItem(
      "lupustic_scan",
      JSON.stringify({ session_id: sessionId, classification, confidence })
    );
    router.push(`/chat/${sessionId}`);
  };

  if (isLupus) {
    return (
      <Card className="border border-border bg-accent/5">
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-sm text-muted-foreground">
            We recommend discussing your results with our AI assistant for
            further guidance on symptoms and next steps.
          </p>
          <Button
            className="rounded-lg"
            onClick={handleProceedToChat}
            aria-label="Proceed to AI consultation"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Proceed to Consultation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-green-50">
      <CardContent className="flex flex-col gap-3 p-4">
        <p className="text-sm text-muted-foreground">
          No indicators found. If you have concerns, please consult a physician.
          You can also try scanning a different image for comparison.
        </p>
        <Button
          variant="outline"
          className="rounded-lg"
          onClick={onRetry}
          aria-label="Scan another image"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Scan Another Image
        </Button>
      </CardContent>
    </Card>
  );
}
