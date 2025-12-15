import Header from "@/components/header";

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        navigationData={[
          {
            title: "Articles",
            href: "/",
          },
          // {
          //   title: "Products",
          //   href: "#",
          // },
          // {
          //   title: "About Us",
          //   href: "#",
          // },
          // {
          //   title: "Contacts",
          //   href: "#",
          // },
        ]}
      />
      {children}
    </>
  );
}
