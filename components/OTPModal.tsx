"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifySecret } from "@/lib/action/user.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import closeDark from "@/public/assets/icons/close-dark.svg";
import { Button } from "./ui/button";
import loader from "@/public/assets/icons/loader.svg";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });

    try {
      const sessionId = await verifySecret({ accountId, password });
      console.log(sessionId);

      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="space-y-4 max-w-[95%] rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src={closeDark}
              alt="close-dark"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-brand btn hover:bg-brand-100 transition-all rounded-full h-12 cursor-pointer"
              type="button"
            >
              Submit{" "}
              {isLoading && (
                <Image
                  className="ml-2 animate-spin"
                  src={loader}
                  alt="loader"
                  width={24}
                  height={24}
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&apos;t get a code?
              <Button
                className="pl-1 text-brand"
                type="button"
                variant="link"
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default OTPModal;
