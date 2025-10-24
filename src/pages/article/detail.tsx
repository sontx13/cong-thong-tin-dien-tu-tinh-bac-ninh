import { createElement, ReactNode, useEffect, useState } from "react";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import React from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, getArticleDetail } from "../../configs";
import { Article } from "../../models";
import { convertDay } from "../../components/format/day";
import Header from "../../components/header";
import "../../css/custom.css";

const { Title } = Text;

function ArticleDetail() {
  const location = useLocation();
  const id = location.state.data;
  const [data, setData] = useState<Article>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${getArticleDetail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        const data = await response.json();
        const result = data.data;
        setData(result);
      } catch (error) {
        console.log(error, "error load article detail");
      }
    };
    getData();
  }, [id]);

  if (data) {
    const date = new Date(data[0].published_at);
    const time = convertDay(date);
    const body = data[0].body;
    return (
      <Page className="min-h-0">
        <Header />
        {/* <Header className="header-detail" title="Chi tiết tin tức" />  */}
        <Box>
          <div className="aspect-cinema relative h-44">
            <img
              src={data[0].image}
              className="absolute w-full h-full rounded-md "
            />
            <div className="text-justify text-white bn-teal bg-opacity-50 absolute top-0 w-full h-full">
              <Title className="m-2 mt-5 text-xl">{data[0].title}</Title>
              <Text className="text-right italic m-2 mt-5">
                {time}
                {data[0].published_at}
              </Text>
            </div>
          </div>
        </Box>
        <Box>
          <Text className="m-2 mb-5 font-semibold text-lg">
            {data[0].excerpt}
          </Text>
          <div
            className="body-convert"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          />
        </Box>
      </Page>
    );
  }
  return <></>;
}

export default ArticleDetail;
