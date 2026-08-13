import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TeamInviteModal = ({ isOpen, onOpenChange, onAccept, loading, isAlreadyLoggedIn = false }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-2xl bg-[#1f1f1f] text-white border-none max-w-[400px]"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Team Invitation
          </DialogTitle>

          <DialogDescription className="text-gray-400 mt-2">
            You have been invited to join{" "}
            <span className="text-accent font-medium">Facile Teams</span>.
            {isAlreadyLoggedIn 
              ? " You can accept this invitation now to join the team."
              : " Your invitation will be automatically accepted after a successful login or signup."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button
            onClick={isAlreadyLoggedIn ? onAccept : () => onOpenChange(false)}
            disabled={loading}
            className="w-full font-semibold bg-accent hover:opacity-90 text-white py-6 rounded-xl"
          >
            {loading ? "Processing..." : isAlreadyLoggedIn ? "Accept Invitation" : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInviteModal;
