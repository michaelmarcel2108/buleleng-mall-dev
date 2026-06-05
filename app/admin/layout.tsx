import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default AdminLayout;
