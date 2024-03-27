"use client";

import { Poppins } from "next/font/google";
import React from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
const poppinsFont = Poppins({ subsets: ["latin"], weight: ["400"] });
import { motion } from "framer-motion";

interface FaqItemProps {
  name: string;
  description: string;
}

const FaqItem = ({ name, description }: FaqItemProps) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full mb-6 md:mb-8 "
    >
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`w-full md:w-[90%] 2xl:w-[70%] relative h-auto py-4 m-auto flex flex-row bg-green-primary  items-center z-10 ${
                open ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              <div className="p-1 bg-white rounded-full ml-4">
                <HiChevronDown
                  className={`w-6 h-6 ${
                    open ? "transform rotate-180" : ""
                  } text-black`}
                />
              </div>
              <span className="text-xl  px-6 text-justify font-bold text-white">
                {name}
              </span>
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="m-auto relative flex flex-col  bg-gray-200  z-0 -top-6 w-full md:w-[90%] 2xl:w-[70%] rounded-lg">
                <div
                  className={`px-6 pt-10 pb-6 font-semibold ${poppinsFont.className}`}
                >
                  {description}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
};

export default FaqItem;
