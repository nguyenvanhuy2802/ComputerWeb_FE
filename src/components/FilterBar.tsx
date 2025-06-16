// FilterBar.tsx
import React from "react";

interface FilterProps {
    priceRange: string;
    setPriceRange: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
}

const FilterBar: React.FC<FilterProps> = ({ priceRange, setPriceRange, sortBy, setSortBy }) => {
    return (
        <div className="filter-bar">
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">Khoảng giá</option>
                <option value="0-1000000">Dưới 1 triệu</option>
                <option value="1000000-5000000">1-5 triệu</option>
                <option value="5000000-10000000">5-10 triệu</option>
                <option value="10000000-999999999">Trên 10 triệu</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
            </select>
        </div>
    );
};

export default FilterBar;
