import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, useNavigate } from "zmp-ui";
import { QuickFilter } from "../components/inquiry";
import ArticleItem from "../components/article";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryNewsState, selectedCategoryState, pageInfor } from "../state";
import { Divider } from "../components/divider";
import { linK_web, logo_app, BASE_URL, getbycategory, img_loading } from "../configs";
import { openWebview } from "zmp-sdk";
import { Article } from "../models";

const { Title, Header } = Text;

function Popular({news, articleList, setArticleList, activeCategory}) {
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [chunk, setChunk] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading);
    }, 3000);
  }, [isLoadMore]);

  useEffect(() => {
    setArticleList(news.slice(0, chunk));
    if (!isLoadMore) return;
    setArticleList(articleList?.concat(news.slice(chunk, chunk + 50)));
    setChunk(chunk + 15);
    setIsLoadMore(false);
  }, [isLoading]);

  useEffect(() => {
    setArticleList(news.slice(0, chunk));
  }, [activeCategory, news]);

  function handleScroll(event) {
    const target = event.target;
    if (target.scrollHeight - target.scrollTop !== target.clientHeight) return;
    console.log("Fetch more list items!");
    setIsLoadMore(true);
  }

  return (
    <Page restoreScrollOnBack className="bg-white">
      {articleList?.length ? (
        <div className="overflow-auto snap-x snap-mandatory scroll-p-4 no-scrollbar">
          <Box onScroll={handleScroll} className=" overflow-y-auto h-screen">
            {articleList?.map((item) => (
              <Box key={item.id} m={3} className="snap-start">
                <ArticleItem layout="cover" article={item} activeCate={activeCategory} />
              </Box>
            ))}
          </Box>
          <div className="div-loading">
            {isLoading && <img src={`${img_loading}`} className="img-register" />}
          </div>
        </div>
      ) : (
        <Box mx={4}>Không có tin tức mới hiển thị</Box>
      )}
    </Page>
  );
}
const getFormattedDate = (date) => {
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const monthsOfYear = [
    "tháng 1",
    "tháng 2",
    "tháng 3",
    "tháng 4",
    "tháng 5",
    "tháng 6",
    "tháng 7",
    "tháng 8",
    "tháng 9",
    "tháng 10",
    "tháng 11",
    "tháng 12",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${day} ${month}, ${year}`;
};

const openUrlInWebview = async () => {
  try {
    await openWebview({
      url: `${linK_web}`,
      config: {
        style: "bottomSheet",
        leftButton: "back",
      },
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

const PostPage = () => {
  const [news, setNews] = useRecoilState<any>(categoryNewsState);
  const [articleList, setArticleList] = useState<any>();
  const [activeCategory, setActiveCategory] = useRecoilState(selectedCategoryState);
  const [page, setPageInfor] = useRecoilState(pageInfor);
  const [showText, setShowText] = useState(true);

  const onChangeActiveCategory = (id) => {
    setActiveCategory(id)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prevShowText) => !prevShowText);
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const currentDate = new Date();
  const formattedDate = getFormattedDate(currentDate);
  const navigate = useNavigate();
  return (
    <Page restoreScrollOnBack className="bg-white bg-image">
      <Header />
      <Divider size={35} />
      <Box
        className="cursor-pointer flex items-center"
        onClick={() => navigate("/")}
      >
        <Icon icon="zi-chevron-left" className="img-logo object-cover" />
      </Box>
     
      <Box
        mx={3}
        mb={2}
        mt={0}
        style={{
          marginLeft: "40px",
          width: "65%",
        }}
        //showBackIcon={location.pathname !== "/"}
      >
       
        <QuickFilter activeCategory={activeCategory}  onChangeActiveCategory={onChangeActiveCategory}/>
      </Box>
      <Divider size={10} />

      {showText ? (
        <Text className="sub_header" onClick={() => openUrlInWebview()}>
          Cổng TTĐT tỉnh Bắc Ninh
        </Text>
      ) : (
        <Text className="sub_header" onClick={() => openUrlInWebview()}>
          {formattedDate}
        </Text>
      )}

      <Divider size={15} />

      <Popular news={news} articleList={articleList} setArticleList={setArticleList} activeCategory={activeCategory}/>
    </Page>
  );
};

export default PostPage;
