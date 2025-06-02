"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import loader from "@/public/assets/icons/loader.svg";
import { createAccount, signInUser } from "@/lib/action/user.actions";
import OTPModal from "./OTPModal";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, { message: "Full name must be at least 2 characters" })
            .max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });
      console.log(user);

      setAccountId(user.accountId);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center max-w-[580px] w-full max-h-[800px] lg:h-full lg:space-y-8 space-y-6 transition-all"
        >
          <h1 className="h1 text-light-100 text-center md:text-left">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex h-[78px] flex-col justify-center border border-light-300 rounded-xl shadow-drop-1 px-4">
                  <FormLabel className="text-light-100 font-normal text-[14px] leading-[20px] pt-2 w-full">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="placeholder:text-light-200 shadow-none border-none outline-none p-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col h-[78px] justify-center border border-light-300 rounded-xl shadow-drop-1 px-4">
                  <FormLabel className="text-light-100 font-normal text-[14px] leading-[20px] pt-2 w-full">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="placeholder:text-light-200 shadow-none border-none outline-none p-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-[66px] rounded-full bg-brand hover:bg-brand-100  hover:cursor-pointer body-2 transition-all button"
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src={loader}
                width={24}
                height={24}
                alt="loader"
                className="animate-spin ml-2"
              />
            )}
          </Button>
          {errorMessage && (
            <p className="body-2 mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error">
              *{errorMessage}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2">
            {type === "sign-in" ? (
              <p className="text-light-100 text-sm">
                Do not you have an account?
              </p>
            ) : (
              <p className="text-light-100 text-sm">Already have an account?</p>
            )}
            <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
              {type === "sign-in" ? (
                <span className="text-brand text-sm">Sign Up</span>
              ) : (
                <span className="text-brand text-sm">Sign In</span>
              )}
            </Link>
          </div>
        </form>
      </Form>

      {/* OTP verification*/}

      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};
export default AuthForm;
