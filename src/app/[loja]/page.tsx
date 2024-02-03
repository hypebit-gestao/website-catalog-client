"use client";

import CategoryItem from "@/components/category-item";
import Container from "@/components/container";
import ProductCard from "@/components/product-card";
import { useProductService } from "@/services/product.service";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/models/product";
import Loader from "@/components/loader";
import { useCart } from "react-use-cart";
import useSearch from "@/utils/hooks/use-search";
import { useCategoryService } from "@/services/category.service";
import { Category } from "@/models/category";

const Catalog = () => {
  const params = useParams();
  const { loja } = params;
  const productService = useProductService();
  const categoryService = useCategoryService();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { addItem, items, totalItems } = useCart();
  const search = useSearch();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      const fetchedProduct = await productService.GETPRODUCTS(
        loja as string,
        search.text,
        categoryFilter
      );
      if (fetchedProduct) {
        setLoading(false);
        setProducts(fetchedProduct);
      }
    };

    const getCategories = async () => {
      setLoading(true);
      const fetchedCategories = await categoryService.GETCATEGORIES(
        loja as string
      );
      if (fetchedCategories) {
        setLoading(false);
        setCategories(fetchedCategories);
      }
    };

    getCategories();
    getProducts();
  }, [loja, search.text, categoryFilter]);

  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const removeFilters = () => {
    setCategoryFilter("");
  };

  console.log("imgs: ", products);

  return (
    <div className="mt-24 min-h-screen">
      {categories?.length > 0 && (
        <div className="flex flex-row justify-center h-full items-center border-b shadow-sm border-gray-200 py-2">
          <Container>
            {loading ? (
              <Loader />
            ) : (
              <div
                id="categories"
                className="h-full  w-full flex flex-row items-center"
              >
                <div className="w-full flex flex-row items-center">
                  {categories?.map((category: Category, index: number) => (
                    <CategoryItem
                      onClick={() => setCategoryFilter(category?.id)}
                      key={index}
                      image={category?.image_url}
                      name={category?.name}
                    />
                  ))}
                </div>
                <div
                  onClick={() => removeFilters()}
                  className="ml-auto cursor-pointer"
                >
                  <h3 className="text-red-600">Remover filtros</h3>
                </div>
              </div>
            )}
          </Container>
        </div>
      )}
      <div className="mt-12">
        {loading ? (
          <Loader />
        ) : (
          <div id="featured">
            <Container>
              {products?.some((product) => product.featured) && (
                <>
                  <h1 className="text-green-secondary text-3xl mb-6">
                    Produtos em destaque
                  </h1>
                  <div className="w-full gap-x-6 gap-y-16 grid grid-cols grid-cols-1 lg:grid-cols-4 ">
                    {products?.map(
                      (product, index) =>
                        product.featured && (
                          <div key={index} className="">
                            <ProductCard
                              key={index}
                              onClick={() =>
                                router.push(`/${loja}/${product.id}`)
                              }
                              name={product.name}
                              price={formater.format(product.price)}
                              images={
                                product.images && product.images.length > 0
                                  ? product.images
                                  : [
                                      "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png",
                                    ]
                              }
                            />
                          </div>
                        )
                    )}
                  </div>
                </>
              )}
            </Container>
          </div>
        )}
      </div>
      <div className="mt-12">
        {loading ? (
          <Loader />
        ) : (
          <Container>
            {products?.some((product) => !product.featured) && (
              <>
                <h1 className="text-green-secondary text-3xl mb-6">Produtos</h1>
                <div className="w-full gap-x-16 gap-y-16 grid grid-cols grid-cols-1 lg:grid-cols-3">
                  {products?.map(
                    (product, index) =>
                      !product.featured && (
                        <div key={index} className="w-full">
                          <ProductCard
                            key={index}
                            onClick={() =>
                              router.push(`/${loja}/${product.id}`)
                            }
                            name={product.name}
                            price={formater.format(product.price)}
                            images={
                              product.images && product.images.length > 0
                                ? product.images
                                : [
                                    "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png",
                                  ]
                            }
                          />
                        </div>
                      )
                  )}
                </div>
              </>
            )}
          </Container>
        )}
      </div>
    </div>
  );
};

export default Catalog;
