"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import logoBrandFull from "@/public/assets/icons/logo-full-brand.svg";
import { useState } from "react";
import { usePathname } from "next/navigation";
import menuIcon from "@/public/assets/icons/menu.svg";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import logOutIcon from "@/public/assets/icons/logout.svg";
import { signOutUser } from "@/lib/action/user.actions";

interface MobileNavProps {
  avatar: string;
  fullName: string;
  email: string;
  $id: string;
  accountId: string;
}

const MobileNavigation = ({
  avatar,
  fullName,
  email,
  $id: ownerId,
  accountId,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-[60px] justify-between px-5 sm:hidden">
      <Image
        src={logoBrandFull}
        width={120}
        height={52}
        alt="logo-brand-full"
        className="h-auto"
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image src={menuIcon} alt="menu-icon" width={30} height={30} />
        </SheetTrigger>
        <SheetContent className="pt-0 h-screen px-3">
          <SheetTitle>
            <div className="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="aspect-square w-10 rounded-full object-cover"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="text-[12px] leading-[14px] font-normal">
                  {email}
                </p>
              </div>
            </div>

            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          <nav className="h5 flex-1 gap-1 text-brand">
            <ul className="flex flex-1 flex-col gap-4">
              {navItems.map(({ url, name, icon }) => (
                <li key={name}>
                  <Link href={url} className="lg:w-full">
                    <div
                      className={cn(
                        "flex text-light-100 gap-4 w-full justify-start items-center h5 px-6 h-[52px] rounded-full",
                        pathname === url && "bg-brand text-white shadow-drop-1"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "w-6 filter invert opacity-25",
                          pathname === url && "invert-0 opacity-25"
                        )}
                      />
                      <p>{name}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/10" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader
              ownerId={ownerId}
              accountId={accountId}
              className="w-full"
            />
            <Button
              type="submit"
              className="h5 flex h-[52px] w-full items-center gap-4 rounded-full bg-brand/10 shadow-none text-brand transition-all hover:bg-brand/20 cursor-pointer"
              onClick={async () => await signOutUser()}
            >
              <Image src={logOutIcon} alt="log-out" width={24} height={24} />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
export default MobileNavigation;
