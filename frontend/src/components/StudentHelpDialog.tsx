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
      <DialogContent
        className="
          max-w-md sm:max-w-lg md:max-w-xl
          p-0 overflow-hidden
          bg-white
          border border-slate-200
          rounded-lg
          shadow-none
        "
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-200">
          <DialogTitle className="text-base font-semibold text-black">
            Help & Support
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        {!openChat ? (
          <div className="px-6 py-5 space-y-6">
            {/* FAQ */}
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3">
                Frequently Asked Questions
              </p>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <FAQAccordion />
              </div>
            </div>

            {/* Button */}
            <Button
              onClick={() => setOpenChat(true)}
              className="
                w-full h-11
                bg-black text-white
                hover:bg-slate-900
                rounded-lg
                font-medium
              "
            >
              Contact Staff
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col max-h-[70vh]">
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