"use client";

import CategoryItem from "@/components/category-item";
import Container from "@/components/container";
import ProductCard from "@/components/product-card";
import { useProductService } from "@/services/product.service";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import useStore from "@/utils/hooks/use-store";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Catalog = () => {
  const params = useParams();
  const { loja } = params;
  const store = useStore();
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
  const featuredScrollRef = useRef<HTMLDivElement>(null);

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

  const filteredCategories = categories?.filter((category) => {
    const filteredProducts = products?.filter(
      (product) => product.category_id === category.id
    );

    if (filteredProducts?.length) return category;
  });

  const scrollLeft = () => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({
        left: 350,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* {filteredCategories?.length > 0 && (
        <div className="flex flex-row justify-center w-full h-full items-center py-5 overflow-auto xl:overflow-hidden">
          <Container>
            {loading ? (
              <Loader />
            ) : (
              <div
                id="categories"
                className="w-full flex flex-col xl:flex-row items-center"
              >
                <div className="w-full flex flex-row items-center xl:justify-normal">
                  {filteredCategories?.map(
                    (category: Category, index: number) => (
                      <CategoryItem
                        onClick={() => setCategoryFilter(category?.id)}
                        key={index}
                        image={category?.image_url}
                        name={category?.name}
                        color={
                          store?.store?.background_color !== null
                            ? `${store?.store?.background_color}`
                            : "#1e3222"
                        }
                      />
                    )
                  )}
                </div>

                {filteredCategories?.length > 0 && (
                  <Button
                    onClick={() => removeFilters()}
                    size="lg"
                    className={`mt-5 lg:mt-0 w-[40%] lg:w-[15%]`}
                    variant={"default"}
                  >
                    <div className="flex items-center">Remover Filtros</div>
                  </Button>
                )}
              </div>
            )}
          </Container>
        </div>
      )} */}

      <div className="mt-4">
        {loading ? (
          <Loader />
        ) : (
          <div id="featured">
            <Container>
              {products?.some(
                (product) => product.featured && product.active
              ) && (
                <>
                  <div className="w-full flex justify-between items-center">
                    <h1
                      style={{
                        color:
                          store?.store?.background_color !== null
                            ? `${store?.store?.background_color}`
                            : "#1e3222",
                      }}
                      className="text-green-secondary text-3xl mb-6"
                    >
                      Produtos em destaque
                    </h1>
                    <div className="flex items-center gap-x-5">
                      <button
                        onClick={scrollLeft}
                        className=" p-3  border border-gray-200 rounded-full shadow-md "
                      >
                        <FaArrowLeft color="#2c6e49" />
                      </button>
                      <button
                        onClick={scrollRight}
                        className=" p-3  rounded-full shadow-md "
                      >
                        <FaArrowRight color="#2c6e49" />
                      </button>
                    </div>
                  </div>
                  <div className="relative flex items-center">
                    <div
                      className="w-full overflow-x-auto whitespace-nowrap scroll-smooth"
                      ref={featuredScrollRef}
                    >
                      {products?.map(
                        (product, index) =>
                          product.featured && (
                            <div
                              key={index}
                              className="inline-block w-1/2 lg:w-1/4 pr-6 last:pr-0"
                            >
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
                  </div>
                </>
              )}
            </Container>
          </div>
        )}
      </div>
      <div className="mt-4">
        {loading ? (
          <Loader />
        ) : (
          <Container>
            {products?.some(
              (product) => !product.featured && product.active
            ) && (
              <>
                <h1
                  style={{
                    color:
                      store?.store?.background_color !== null
                        ? `${store?.store?.background_color}`
                        : "#1e3222",
                  }}
                  className="text-green-secondary text-3xl mb-6"
                >
                  Produtos
                </h1>
                <div className="w-full gap-y-16 grid grid-cols grid-cols-2 gap-x-4 lg:gap-x-16 lg:grid-cols-3 xl:grid-cols-4">
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
                  products?.filter((product) => !product.featured).length && (
                  <div className="w-full flex justify-center mt-32">
                    <Button
                      onClick={loadMoreProducts}
                      size="xl"
                      className="w-[50%] md:w-[30%] text-lg"
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
