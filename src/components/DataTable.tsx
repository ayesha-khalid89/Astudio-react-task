import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IFilterKeys } from "../utils/interface";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

interface DataTableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  fetchUrl: string;
  dataType: string;
  setData: (data: T[]) => void;
  data: T[];
  setTotalData: (total: number) => void;
  totalData: number;
  filterKeys: IFilterKeys[];
  pageSize: number;
  setPageSize: (size: number) => void;
}

function DataTable<T extends { [key: string]: any }>({
  columns,
  fetchUrl,
  dataType,
  data,
  setData,
  totalData,
  setTotalData,
  filterKeys,
  pageSize,
  setPageSize,
}: DataTableProps<T>) {
  const [selectedFilter, setSelectedFilter] = useState<IFilterKeys>();
  const [inputEnabled, setInputEnabled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredLength, setFilteredLength] = useState<number>(0);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const generateUrl = () => {
    let url = fetchUrl;
    const searchValue = searchRef.current?.value;
    const selectedKey = selectedFilter?.key;
    const selectedType = selectedFilter?.type;

    if (searchValue && !searchValue.includes("Select ")) {
      let value = "";

      if (selectedType === "date" && searchValue) {
        const date = new Date(searchValue);
        value = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
      } else {
        value = searchValue;
      }

      if (value === `Select ${selectedKey}`) {
        value = "";
      }

      if (dataType === "users") {
        url = `${fetchUrl}/filter?key=${selectedKey}&value=${value}`;
      } else {
        if (selectedKey === "category") {
          url = value === "All" ? fetchUrl : `${fetchUrl}/category/laptops`;
        } else {
          url = `${fetchUrl}/search?q=${value}`;
        }
      }
    }
    return url;
  };

  useEffect(() => {
    const url = generateUrl();
    axios
      .get(url, {
        params: {
          limit: pageSize,
          skip: (currentPage - 1) * pageSize,
        },
      })
      .then((response) => {
        if (
          selectedFilter?.key &&
          searchRef?.current?.value &&
          dataType === "products" &&
          selectedFilter?.key !== "category"
        ) {
          console.log("response", response.data[dataType]);
          const filteredProducts = response.data[dataType]
            .map((item: Record<string, any>) => {
              if (
                selectedFilter?.key &&
                item[selectedFilter?.key] &&
                item[selectedFilter?.key].includes(searchRef.current?.value)
              ) {
                return item;
              }
            })
            .filter(
              (
                item: Record<string, any> | undefined
              ): item is Record<string, any> => item !== undefined
            );
          setData(filteredProducts);
          setTotalData(filteredProducts.length);
        } else {
          setData(response.data[dataType]);
          setTotalData(response.data["total"]);
        }
        setSearchClicked(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, [currentPage, pageSize, dataType, searchClicked, selectedFilter]);

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor]).toLowerCase().includes(searchQuery)
    )
  );

  const handleDeleteSearch = () => {
    setInputEnabled(false);
    setSearchQuery("");
  };

  const handleDeleteFilter = () => {
    setActiveFilter(null);
    setSelectedFilter(undefined);
    setFilteredLength(0);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const handleFilterClick = (item: IFilterKeys) => {
    setActiveFilter(item.title);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setFilteredLength(0);
    setSelectedFilter(item);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    setSearchClicked(true);
  };

  // Calculate total pages
  const totalPages = filteredLength > 0 ? 1 : Math.ceil(totalData / pageSize);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const getPageNumbers = () => {
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;
    if (pageNumbers.length > totalBlocks) {
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(pageNumbers.length - 1, currentPage + 2);
      let pages: any[] = pageNumbers.slice(startPage - 1, endPage);
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = pageNumbers.length - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, i) => startPage - spillOffset + i
          );
          pages = ["...", ...extraPages, ...pages];
          break;
        }
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, i) => endPage + i + 1
          );
          pages = [...pages, ...extraPages, "..."];
          break;
        }
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = ["...", ...pages, "..."];
          break;
        }
      }
      return [1, ...pages, pageNumbers.length];
    }
    return pageNumbers;
  };

  const renderField = () => {
    if (selectedFilter?.type === "text") {
      return (
        <input
          className="p-2 rounded-[8px] border-[0.5px] font-neutra"
          placeholder={`Enter ${selectedFilter.title}...`}
          ref={searchRef as React.RefObject<HTMLInputElement>}
        />
      );
    } else if (selectedFilter?.type === "select") {
      return (
        <select
          className="p-2 rounded-[8px] border-[0.5px] font-neutra "
          ref={searchRef as React.RefObject<HTMLSelectElement>}
          defaultValue={`Select ${selectedFilter.key}`}
        >
          <option value={`Select ${selectedFilter.key}`}>
            Select {selectedFilter.title}
          </option>
          {selectedFilter?.dropdownValues?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      );
    } else if (selectedFilter?.type === "date") {
      return (
        <input
          className="p-2 rounded-[8px] border-[0.5px] font-neutra"
          ref={searchRef as React.RefObject<HTMLInputElement>}
          type="date"
        />
      );
    }
  };

  // Header section
  const renderHeader = () => {
    return (
      <div className="flex justify-around bg-secondary m-3">
        <Link to="/users">
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedFilter(undefined);
              setActiveFilter(null);
            }}
            className="py-[10px] px-[20px] text-[16px] cursor-pointer border-0 bg-secondary text-black rounded-[4px] transition-colors duration-300 font-neutra hover:bg-primary hover:text-white hover:rounded-[16px] m-3"
          >
            Users
          </button>
        </Link>
        <Link to="/products">
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedFilter(undefined);
            }}
            className="py-[10px] px-[20px] text-[16px] cursor-pointer border-0 bg-secondary text-black rounded-[4px] transition-colors duration-300 font-neutra hover:bg-primary hover:text-white hover:rounded-[16px] m-3"
          >
            Products
          </button>
        </Link>
      </div>
    );
  };

  // Filter, Search, and Page Size (All on One Line)
  const renderFilterSection = () => {
    return (
      <>
        <div className="flex flex-wrap items-center gap-4 mt-4 p-8">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <select
              className=" p-2 rounded-[16px] font-neutra hover:bg-light border border-gray-300"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>Entries</span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            {inputEnabled ? (
              <>
                <input
                  className="p-2 rounded-[16px] font-neutra border border-gray-300"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <MdCancel
                  onClick={handleDeleteSearch}
                  className="cursor-pointer"
                />
              </>
            ) : (
              <CiSearch
                className="rounded-[16px] p-[3px] hover:bg-light cursor-pointer"
                size={24}
                onClick={() => {
                  setInputEnabled(true);
                }}
              />
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {filterKeys.map((item) => (
              <button
                key={item.title}
                onClick={() => handleFilterClick(item)}
                className={`px-3 py-1 rounded-[16px] font-neutra cursor-pointer transition-colors duration-300 
                ${
                  activeFilter === item.title
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {item.title}
                <MdKeyboardArrowDown className="ml-2 inline-block" />
              </button>
            ))}
          </div>
        </div>
        {selectedFilter && (
          <div className="flex items-center gap-2 justify-center">
            {renderField()}
            <button
              onClick={handleSearchClick}
              className="rounded-[16px] bg-primary border-0 px-4 py-2 cursor-pointer font-neutra hover:bg-light hover:scale-[1.01]"
            >
              Search
            </button>
            <MdCancel onClick={handleDeleteFilter} className="cursor-pointer" />
          </div>
        )}
      </>
    );
  };

  // Datatable
  const renderDatatable = () => {
    return (
      <div className="px-8">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.header)}
                  className="border border-[#ebebeb] p-2 text-left bg-secondary"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[rgb(243,239,239)]">
                {columns.map((column) => (
                  <td
                    key={String(column.header)}
                    className="border border-[#ebebeb] p-2 text-left"
                  >
                    {String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Pagination
  const renderPagination = () => {
    return (
      <div className="text-center mt-5 font-neutra">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="text-[18px] py-[5px] px-[10px] bg-transparent rounded-[16px] hover:bg-light disabled:cursor-not-allowed"
        >
          &larr;
        </button>
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(number)}
            disabled={number === "..."}
            className={`mx-[5px] py-[5px] px-[10px] border-0 cursor-pointer rounded-[16px] transition-colors duration-300 transition-transform
              ${
                number === currentPage
                  ? "bg-primary text-white"
                  : "bg-secondary"
              } 
              hover:bg-light hover:scale-110 disabled:cursor-not-allowed
            `}
          >
            {number}
          </button>
        ))}
        <button
          disabled={currentPage * pageSize >= totalData}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="text-[18px] py-[5px] px-[10px] bg-transparent rounded-[16px] hover:bg-light disabled:cursor-not-allowed"
        >
          &rarr;
        </button>
      </div>
    );
  };

  return (
    <div className="font-neutra">
      {renderHeader()}
      <h2 className="text-xl font-bold mt-4">{dataType.toUpperCase()}</h2>
      {renderFilterSection()}
      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : error ? (
        <p className="text-center mt-4">{error}</p>
      ) : (
        <>
          {renderDatatable()}
          {renderPagination()}
        </>
      )}
    </div>
  );
}

export default DataTable;
