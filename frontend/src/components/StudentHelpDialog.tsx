import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/features/chat/ChatWindow";
import { useState } from "react";

export default function StudentHelpDialog({
  open,
  onOpenChange,
  enrollmentNo,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  enrollmentNo: string;
}) {
  const [openChat, setOpenChat] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>

        {!openChat ? (
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Frequently Asked Questions</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• How long does approval take?</li>
                <li>• Why was my application rejected?</li>
                <li>• When will my concession expire?</li>
                <li>• How to reapply for concession?</li>
              </ul>
            </div>

            <Button onClick={() => setOpenChat(true)} className="w-full">
              Contact Staff
            </Button>
          </div>
        ) : (
          <ChatWindow
            chatId={enrollmentNo}
            userId={enrollmentNo}
            role="STUDENT"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
