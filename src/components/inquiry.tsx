import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Input } from "zmp-ui";
import {
  keywordState,
  listCategoryState,
  selectedCategoryState,
  pageInfor,
} from "../state";

function Inquiry() {
  const [keyword, setKeyword] = useRecoilState(keywordState);

  return (
    <Input.Search
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="inquiry my-4 h-8 border-none bg-white"
      placeholder="Tìm kiếm"
    />
  );
}

export function QuickFilter({activeCategory, onChangeActiveCategory}) {
  
  const [page, setPage] = useRecoilState(pageInfor);

  const categories = useRecoilValue(listCategoryState);

  return (
    <div className="overflow-auto no-scrollbar snap-x snap-mandatory mt-4 bg-transparent">
      <div className="flex w-max ds-chuyenmuc">
        {categories.map((categorie) => (
          <Button
            key={categorie.id}
            size="small"
            type="highlight"
            variant={
              activeCategory === categorie.id ? "primary" : "secondary"
            }
            className=""
            onClick={() => {
              onChangeActiveCategory(categorie.id);
              console.log(categorie.id, "id new");
              console.log(activeCategory, "activecategory-=-=-");
              
              
            }}
          >
            {categorie.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Inquiry;
