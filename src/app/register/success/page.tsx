import Link from "next/link";
import React from "react";

const RegisterSuccess = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl text-green-secondary font-bold mb-4">
          Parabéns, sua loja foi cadastrada com sucesso!!
        </h1>
        <p className="text-2xl font-light">
          Para acessar sua loja, faça login com suas credenciais criada nesse
          link
        </p>
        <Link href={"https://catalogoplaceadmin.vercel.app"}>
          <p className="mt-4 font-bold text-2xl cursor-pointer">
            https://catalogoplaceadmin.vercel.app
          </p>
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
