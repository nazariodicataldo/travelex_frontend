"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSessionExpiredDialogStore } from "@/lib/store";
import Link from "next/link";

export function SessionExpiredDialog() {
  const { open, setOpen } = useSessionExpiredDialogStore();

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={"h6 text-primary"}>
            Unauthenticated
          </DialogTitle>
          <DialogDescription>
            You must be authenticated to do this action
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              nativeButton={false}
              onClick={() => setOpen(false)}
              render={<Link href={"/login"} />}
            >
              Log in
            </Button>
            <Button
              nativeButton={false}
              onClick={() => setOpen(false)}
              render={<Link href={"/register"} />}
            >
              Sign in
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
