import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isLanding?: boolean;
}

const Container = ({ children, isLanding = false }: ContainerProps) => {
  return (
    <div
      className={`2xl:px-4 ${!isLanding && "lg:px-24"} w-full ${
        isLanding && "lg:px-0"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
