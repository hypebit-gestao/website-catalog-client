"use client";

import React, { useEffect, useState } from "react";
import Modal from "./modal";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
}

const RegisterModal = ({ isOpen, onClose, body }: RegisterModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      personWidth="xl:w-[70%]"
      personHeight="max-h-[90vh]
      h-auto
        lg:h-auto
        md:h-auto"
      header={
        <>
          <h1 className="text-[#2c6e49] font-bold text-xl">Cadastro de loja</h1>
        </>
      }
      body={<>{body}</>}
    />
  );
};

export default RegisterModal;
