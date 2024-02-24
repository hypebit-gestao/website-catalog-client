import React from "react";
import { AiOutlineCheck } from "react-icons/ai";

interface StepByStepProps {
  numSteps: number;
  actualStep: number;
  onStepChange?: (step: number) => void;
}

const StepByStep: React.FC<StepByStepProps> = ({
  numSteps,
  actualStep,
  onStepChange,
}) => {
  const stepsArray = Array.from({ length: numSteps }, (_, index) => index + 1);
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-row ">
        {stepsArray.map((stepNumber, index) => (
          <div className="flex" key={index}>
            <button
              onClick={() => onStepChange && onStepChange(stepNumber)}
              className={`mx-4 z-20 ${
                stepNumber <= actualStep ? "bg-green-secondary" : "bg-gray-300 "
              } rounded-full py-2  min-w-[45px]`}
            >
              {stepNumber >= actualStep && (
                <h1 className="text-white text-xl">{stepNumber.toString()}</h1>
              )}
              {stepNumber < actualStep && (
                <h1 className="text-white text-xl flex justify-center">
                  <AiOutlineCheck
                    size={24}
                    className="text-white flex justify-center"
                  />
                </h1>
              )}
            </button>
            <div
              className={`w-full p-1 rotate-90 ${
                stepNumber < actualStep ? "bg-green-secondary" : "bg-gray-300"
              } ${stepNumber === numSteps ? "hidden" : "block"}`}
            >
              <hr />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepByStep;
