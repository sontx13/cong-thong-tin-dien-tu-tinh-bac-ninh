import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { Article } from "../models";
import { convertDay } from "./format/day";

const { Title } = Text;

interface ArticleProps {
  layout: "cover" | "list-item";
  article: Article;
  activeCate:number;
  before?: React.ReactNode;
  after?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ArticleItem: FunctionComponent<ArticleProps> = ({
  layout,
  article,
  activeCate,
  before,
  after,
  onClick,
}) => {
  const navigate = useNavigate();
  // const [imgSrc, setImgSrc] = useState<string | null>(article.image);
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    if(activeCate === 1 || activeCate === 2) {
      setIsShow(true)
    }
  }, [])

  const onError = () => {
    setIsShow(!isShow)
  }


  const viewDetail = () => {
    navigate("/article", { state: { data: article.id } });
  };

  if (layout === "cover") {
    const date = new Date(article.published_at);
    const time = convertDay(date);
    return (
      <Page
        restoreScrollOnBack
        onClick={onClick ?? viewDetail}
        className="relative bg-gray-200 rounded-xl overflow-hidden p-0 restaurant-with-cover"
      >
        {isShow ? (
          <div className="aspect-cinema relative h-44 hover:w-full hover:m-0 m-2 ">
            <img
              src={article.image}
              className="absolute w-full h-full rounded-md"
              onError={onError}
            />
          </div>
        ) : (
          <div className="mb-2"></div>
        )}
        <Title size="normal" className="ml-2 mr-0 overflow-x-auto">
          {article?.title}
        </Title>
        <div className="m-2">
          <span className="italic text-base">
            {`Ngày đăng: ${time} ${article.published_at}`}
          </span>
        </div>
        {article.excerpt ? (
          <div className="m-2 h-20">
            <span className="min-h-18 text-lg">{article?.excerpt}</span>
          </div>
        ) : (
          <div></div>
        )}
      </Page>
    );
  }
  
  // 🔧 Thêm dòng này để tránh lỗi TS
  return null;
};

export default ArticleItem;
