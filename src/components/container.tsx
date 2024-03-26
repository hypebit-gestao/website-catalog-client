import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isLanding?: boolean;
}

const Container = ({ children, isLanding = false }: ContainerProps) => {
  return (
    <div className={`${isLanding && "px-0"} px-8  w-full`}>{children}</div>
  );
};

export default Container;
