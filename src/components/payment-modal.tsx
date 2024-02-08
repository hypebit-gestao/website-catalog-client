"use client";

import React, { useEffect, useState } from "react";
import Modal from "./modal";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import { Item, useCart } from "react-use-cart";
import { MdDelete, MdEdit } from "react-icons/md";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/utils/hooks/use-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
}

const PaymentModal = ({ isOpen, onClose, body }: PaymentModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      personWidth="xl:w-[70%]"
      personHeight="max-h-[90vh]"
      header={
        <>
          <h1 className="text-[#2c6e49] font-bold text-xl">Pagamento</h1>
        </>
      }
      body={<>{body}</>}
    />
  );
};

export default PaymentModal;
