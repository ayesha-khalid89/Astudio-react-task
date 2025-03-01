import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/DataTable";
import { RootState } from "../redux/store";
import {
  setProducts,
  setTotalProducts,
  setProductPageSize,
} from "../redux/slices/productSlice";
import { IProduct } from "../utils/interface";
import { IFilterKeys } from "../utils/interface";
import { API_URLS, DATA_TYPES } from "../constants/global";

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const { products, totalProducts, productPageSize } = useSelector(
    (state: RootState) => state.products
  );

  const columns: { header: string; accessor: keyof IProduct }[] = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Brand", accessor: "brand" },
    { header: "Category", accessor: "category" },
    { header: "Price", accessor: "price" },
    { header: "Discount Percentage", accessor: "discountPercentage" },
    { header: "Rating", accessor: "rating" },
    { header: "Stock", accessor: "stock" },
    { header: "Weight", accessor: "weight" },
    { header: "Warranty Information", accessor: "warrantyInformation" },
    { header: "Availability Status", accessor: "availabilityStatus" },
    { header: "Shipping Information", accessor: "shippingInformation" },
  ];

  const filterKeys: IFilterKeys[] = [
    { title: "Title", key: "title", type: "text" },
    { title: "Brand", key: "brand", type: "text" },
    {
      title: "Category",
      key: "category",
      type: "select",
      dropdownValues: ["All", "Laptops"],
    },
  ];

  return (
    <div>
      <DataTable<IProduct>
        columns={columns}
        fetchUrl={API_URLS.PRODUCTS}
        dataType={DATA_TYPES.PRODUCTS}
        setData={(data) => dispatch(setProducts(data))}
        data={products}
        setTotalData={(total) => dispatch(setTotalProducts(total))}
        totalData={totalProducts}
        filterKeys={filterKeys}
        pageSize={productPageSize}
        setPageSize={(size) => dispatch(setProductPageSize(size))}
      />
    </div>
  );
};

export default Products;
