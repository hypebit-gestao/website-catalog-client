import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isLanding?: boolean;
}

const Container = ({ children, isLanding = false }: ContainerProps) => {
  return (
    <div className={`px-4 lg:px-64 w-full ${isLanding && "lg:px-0"}`}>
      {children}
    </div>
  );
};

export default Container;
