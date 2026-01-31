"use client";
import toast, { Toaster } from "react-hot-toast";
import Container from "@/components/container";
import ViewCartModal from "@/components/view-cart";
import { Product } from "@/models/product";
import { useProductService } from "@/services/product.service";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import { useCart } from "react-use-cart";
import Loader from "@/components/loader";
import useStore from "@/utils/hooks/use-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductPage = () => {
  const productService = useProductService();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [currentImg, setCurrentImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectSize, setSelectSize] = useState<any>();
  const [attributesSelected, setAttributesSelected] = useState<any>([]);
  const viewCartModal = useViewCartModal();
  const router = useRouter();
  const { addItem, items, removeItem } = useCart();
  const store = useStore();

  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Installment display logic
  const installmentInfo = React.useMemo(() => {
    const available = product?.installment_available ?? false;
    if (!available) return null;

    const maxRaw = product?.max_installments ?? 1;
    const max = Math.max(1, Math.min(Number(maxRaw), 36));

    // If only 1 installment is allowed, don't display installment info
    if (max <= 1) return null;

    const withInterest = product?.installment_with_interest ?? false;

    const unitPrice = product?.promotion_price && product?.promotion_price > 0
      ? Number(product.promotion_price)
      : Number(product?.price ?? 0);

    if (!withInterest) {
      return `ou até ${max}x sem juros no cartão`;
    }

    const interestPercent = Number(product?.installment_interest_value ?? 0);
    const r = interestPercent / 100;

    // If interest percent is 0, fallback to simple division
    let parcela = unitPrice / max;
    if (r > 0) {
      const denom = 1 - Math.pow(1 + r, -max);
      if (denom > 0) {
        parcela = (unitPrice * r) / denom;
      }
    }

    return `ou ${max}x de ${formater.format(parcela)} no cartão`;
  }, [product, formater]);

  const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = (quantity: number) => {
    if (
      product?.product_size &&
      product.product_size.length > 0 &&
      !selectSize
    ) {
      toast.error("Selecione um tamanho");
      return;
    }
    const unitPrice = product?.promotion_price && product?.promotion_price > 0
      ? Number(product.promotion_price)
      : Number(product?.price ?? 0);

    addItem(
      {
        id: product?.id as string,
        name: product?.name as string,
        price: unitPrice,
        promotionPrice: product?.promotion_price ? Number(product.promotion_price) : undefined,
        image: product?.images && product?.images[0],
        sizeId: selectSize?.id || null,
        sizeName: selectSize?.size || null,
        attributesOptions: attributesSelected,
        itemTotal: unitPrice * quantity,
        // Installment fields (forward to cart item)
        installment_available: product?.installment_available,
        installment_with_interest: product?.installment_with_interest,
        installment_interest_value: product?.installment_interest_value,
        max_installments: product?.max_installments,
      },
      quantity
    );

    toast.success("Produto adicionado ao carrinho", {
      style: {
        marginTop: "90px",
      },
    });

    router.push(`/${params.loja}/cart`);
  };

  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const fetchedProduct = await productService.GETBYID(
        params.productId as string
      );
      if (fetchedProduct) {
        setLoading(false);
        setProduct(fetchedProduct);
      }
    };
    getProduct();
  }, []);

  return (
    <>
      {loading ? (
        <Loader color="text-green-primary" />
      ) : (
        <Container>
          <div className="mt-12">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-row lg:flex-col  overflow-hidden  max-h-[450px]">
                {product?.images?.map((img) => (
                  <>
                    <Image
                      onClick={() => setCurrentImg(img as string)}
                      className={`border border-solid border-gray-200 rounded-md cursor-pointer mr-5 lg:mr-0 mb-3 w-[100px] h-[100px] lg:h-[100px] lg:w-[100px] object-cover object-center ${
                        currentImg === img && "border-2 border-green-secondary"
                      }`}
                      alt="Imagem do produto"
                      src={img as string}
                      width={150}
                      height={150}
                    />
                  </>
                ))}
              </div>
              <div className="ml-0 lg:ml-12 border border-solid border-gray-200 rounded-md w-full lg:w-[450px] h-[450px] ">
                <Image
                  className=" rounded-md cursor-pointer w-full h-full object-cover object-center lg:w-[450px]"
                  alt="Imagem do produto"
                  src={
                    currentImg ||
                    (product?.images && product?.images.length > 0
                      ? product?.images[0]
                      : "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png")
                  }
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-6 lg:ml-12 w-auto lg:w-1/2 ">
                <h1 className="text-4xl truncate text-gray-500 w-full ">
                  {product?.name}
                </h1>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6">
                  <div className="flex ">
                    <div
                      style={{
                        backgroundColor:
                          store?.store?.background_color !== null
                            ? `${store?.store?.background_color}`
                            : "#1e3222",
                      }}
                      onClick={() => handleRemove()}
                      className="rounded-full bg-green-primary p-3 mr-5 cursor-pointer"
                    >
                      <IoRemove className="text-white" />
                    </div>
                    <input
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      value={quantity}
                      className="w-[100px] border border-gray-200 rounded-xl text-center"
                      type="number"
                    />
                    <div
                      style={{
                        backgroundColor:
                          store?.store?.background_color !== null
                            ? `${store?.store?.background_color}`
                            : "#1e3222",
                      }}
                      onClick={() => handleAdd()}
                      className="rounded-full bg-green-primary p-3 ml-5 cursor-pointer"
                    >
                      <IoAdd className="text-white" />
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0 lg:ml-12">
                    <h1 className="text-black font-bold text-3xl">
                      {formater.format(
                        Number(product?.promotion_price && product?.promotion_price > 0 ? product?.promotion_price && product?.promotion_price * quantity : product?.price && product?.price * quantity)
                      )}
                    </h1>
                    {installmentInfo && (
                      <div className="text-gray-600 mt-2">{installmentInfo}</div>
                    )}
                  </div>
                </div>
                {product?.product_attribute &&
                  product.product_attribute.length > 0 && (
                    <div className="mt-5 lg:mt-8">
                      {product?.product_attribute?.map(
                        (prodAttr, indexProdAttr) => (
                          <div key={indexProdAttr} className="mb-4">
                            <h3 className="text-gray-600 text-xl mb-3">
                              {prodAttr.attribute.name}
                            </h3>
                            <Select
                              onValueChange={(value: any) => {
                                setAttributesSelected((prev: any) => [
                                  ...prev,
                                  {
                                    attributeId: prodAttr.attribute.id,
                                    attributeName: prodAttr.attribute.name,
                                    attributeOptionId: value,
                                    attributeOptionName:
                                      prodAttr.attribute.attributeOption?.find(
                                        (attrOpt) => attrOpt.id === value
                                      )?.option_name,
                                  },
                                ]);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={prodAttr.attribute.name}
                                />
                              </SelectTrigger>
                              <SelectContent className="z-[300]">
                                {/* product?.product_size?.map((prodSize) => prodSize?.size) */}
                                {prodAttr.attribute?.attributeOption?.map(
                                  (prodAttrOpt, index) => (
                                    <SelectItem
                                      key={index}
                                      value={prodAttrOpt?.id as string}
                                    >
                                      {prodAttrOpt?.option_name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      )}
                    </div>
                  )}
                {product?.product_size && product.product_size.length > 0 && (
                  <div className="mt-5 lg:mt-8">
                    <h3 className="text-gray-600 text-xl mb-4">
                      Tamanho do produto
                    </h3>
                    <Select
                      onValueChange={(value) => {
                        setSelectSize(value as any);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tamanho" />
                      </SelectTrigger>
                      <SelectContent className="z-[300]">
                        {/* product?.product_size?.map((prodSize) => prodSize?.size) */}
                        {product?.product_size?.map((prodSize, index) => (
                          <SelectItem key={index} value={prodSize?.size as any}>
                            {prodSize?.size?.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="my-5 ">
                  <h3 className="text-gray-600 text-xl mb-4">
                    Descrição do produto
                  </h3>
                  <div className="">{product?.description}</div>
                </div>
                <div>
                  <button
                    style={{
                      backgroundColor:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                    }}
                    onClick={() => addToCart(quantity)}
                    className="bg-green-primary w-full py-2 rounded-lg text-white text-xl"
                  >
                    Adicionar ao carrinho
                  </button>
                  <button
                    style={{
                      borderColor:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                      color:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                    }}
                    onClick={() => router.back()}
                    className="mt-5 border border-solid border-green-primary w-full py-2 rounded-lg text-green-primary text-xl"
                  >
                    Voltar para a loja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default ProductPage;
