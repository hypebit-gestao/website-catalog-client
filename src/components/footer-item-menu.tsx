import Link from "next/link";
import React from "react";

interface FooterMenuItemProps {
  href: string;
  name: string;
}

const FooterMenuItem = ({ href, name }: FooterMenuItemProps) => {
  return (
    <Link href={href}>
      <li className="text-white text-2xl mb-4 cursor-pointer">{name}</li>
    </Link>
  );
};

export default FooterMenuItem;
