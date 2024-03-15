import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isLanding?: boolean;
}

const Container = ({ children, isLanding = false }: ContainerProps) => {
  return <div className={`px-4 lg:px-24 w-full`}>{children}</div>;
};

export default Container;
