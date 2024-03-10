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
import { Category, UserCategory } from "@/models/category";
import { Button } from "@/components/ui/button";
import { useUserService } from "@/services/user.service";
import { User } from "@/models/user";

const Catalog = () => {
  const params = useParams();
  const { loja } = params;
  const userService = useUserService();
  const productService = useProductService();
  const categoryService = useCategoryService();
  const [user, setUser] = useState<User>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { addItem, items, totalItems } = useCart();
  const search = useSearch();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const fetchedUser = await userService.GETUSER(loja as string);
      if (fetchedUser) {
        if (fetchedUser?.status !== "INACTIVE") {
          setLoading(false);
          setUser(fetchedUser);
        } else {
          router.push("/");
          setLoading(true);
        }
      } else {
        setLoading(false);
        router.push("/");
      }
    };
    getUser();
  }, [loja]);

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

    if (loja) {
      if (user) {
        getCategories();
        getProducts();
      }
    }
  }, [user, loja, search.text, categoryFilter]);

  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 8);
  };

  const loadLessProducts = () => {
    setVisibleProducts((prev) => prev - 8);
  };

  const removeFilters = () => {
    setCategoryFilter("");
  };

  return (
    <div className=" min-h-screen ">
      {categories?.length > 0 && (
        <div className="flex flex-row justify-center h-full items-center border-b shadow-sm border-gray-200 py-5">
          <Container>
            {loading ? (
              <Loader />
            ) : (
              <div
                id="categories"
                className="w-full flex flex-row items-center"
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
                {categories?.length > 1 && (
                  <div
                    onClick={() => removeFilters()}
                    className="ml-auto cursor-pointer"
                  >
                    <h3 className="text-red-600">Remover filtros</h3>
                  </div>
                )}
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
              {products?.some(
                (product) => product.featured && product.active
              ) && (
                <>
                  <h1 className="text-green-secondary text-3xl mb-6">
                    Produtos em destaque
                  </h1>
                  <div className="w-full gap-x-16 gap-y-16 grid grid-cols grid-cols-1 lg:grid-cols-4">
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
                              price={product.price}
                              promotionPrice={product.promotion_price}
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
            {products?.some(
              (product) => !product.featured && product.active
            ) && (
              <>
                <h1 className="text-green-secondary text-3xl mb-6">Produtos</h1>
                <div className="w-full gap-x-16 gap-y-16 grid grid-cols grid-cols-1 lg:grid-cols-4">
                  {products
                    ?.filter((product) => !product.featured)
                    .slice(0, visibleProducts)
                    .map(
                      (product, index) =>
                        !product.featured && (
                          <div key={index} className="w-full">
                            <ProductCard
                              key={index}
                              onClick={() =>
                                router.push(`/${loja}/${product.id}`)
                              }
                              name={product.name}
                              price={product.price}
                              promotionPrice={product.promotion_price}
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
                {visibleProducts <
                  products?.filter((product) => !product.featured).length && ( // Verificar se há mais produtos para carregar
                  <div className="w-full flex justify-center mt-32">
                    <Button
                      onClick={loadMoreProducts}
                      size="xl"
                      className=" w-[50%] md:w-[30%] text-lg"
                      type="submit"
                      variant={"default"}
                    >
                      Ver Mais
                    </Button>
                    {visibleProducts > 6 && (
                      <Button
                        onClick={loadLessProducts}
                        size="xl"
                        className="w-[50%] md:w-[30%] text-lg ml-6"
                        type="submit"
                        variant={"outline"}
                      >
                        Ver menos
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </Container>
        )}
      </div>
    </div>
  );
};

export default Catalog;
