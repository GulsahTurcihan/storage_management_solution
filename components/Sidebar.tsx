"use client";

import Image from "next/image";
import Link from "next/link";
import logoBrandFull from "@/public/assets/icons/logo-full-brand.svg";
import logoBrand from "@/public/assets/icons/logo-brand.svg";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import files2 from "@/public/assets/images/files-2.png";

interface SidebarProps {
  fullName: string;
  email: string;
  avatar: string;
}

const Sidebar = ({ email, fullName, avatar }: SidebarProps) => {
  const pathName = usePathname();

  return (
    <aside className="remove-scrollbar hidden h-screen sm:flex lg:w-[280px] xl:w-[325px] w-[90px] flex-col px-5 py-7">
      <Link href="/">
        <Image
          src={logoBrandFull}
          alt="logo-brand-full"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src={logoBrand}
          alt="logo-brand"
          width={52}
          height={52}
          className="lg:hidden "
        />
      </Link>
      <nav className="h5 mt-9 flex-1 gap-1 text-brand">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <li key={name}>
              <Link href={url} className="lg:w-full">
                <div
                  className={cn(
                    "flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full",
                    pathName === url && "bg-brand text-white shadow-drop-1"
                  )}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn(
                      "w-6 filter invert opacity-25",
                      pathName === url && "invert-0 opacity-25"
                    )}
                  />
                  <p className="hidden lg:block">{name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Image
        src={files2}
        alt="files-2"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/10 p-1 text-light-100 lg:justify-start lg:p-3">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="aspect-square w-10 rounded-full object-cover"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="text-[12px] leading-[16px] font-normal">{email}</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
