import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/features/chat/ChatWindow";
import { useState } from "react";
import FAQAccordion from "@/components/FAQAccordion";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>

        {!openChat ? (
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Frequently Asked Questions</p>
              <FAQAccordion />
            </div>

            <Button onClick={() => setOpenChat(true)} className="w-full">
              Contact Staff
            </Button>
          </div>
        ) : (
          <div className="h-[450px] w-full flex flex-col">
  <ChatWindow
    chatId={enrollmentNo}
    userId={enrollmentNo}
    role="STUDENT"
    variant="modal"
  />
</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
