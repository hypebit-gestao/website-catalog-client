import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div className="px-4 lg:px-64 w-full">{children}</div>;
};

export default Container;
