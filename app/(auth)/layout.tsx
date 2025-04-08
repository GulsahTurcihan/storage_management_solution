import Image from "next/image";
import logoFull from "@/public/assets/icons/logo-full.svg";
import files from "@/public/assets/images/files.png";
import logoFullBrand from "@/public/assets/icons/logo-full-brand.svg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 bg-brand justify-center items-center p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image src={logoFull} width={224} height={82} alt="logoFull" />
          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              Awesome, we have created the perfect place for you to store all
              your documents.
            </p>
          </div>
          <Image
            src={files}
            width={342}
            height={342}
            alt="files"
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:p-10 lg:justify-center lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src={logoFullBrand}
            width={224}
            height={82}
            alt="logoFullBrand"
            className="h-auto w-[200p] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};
export default Layout;
