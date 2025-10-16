import { Box, Page } from "zmp-ui";
import ArticleDetail from "./article/detail";
import React from "react";

function ArticlePage() {
  return (
    <Page className="bg-white">
      <ArticleDetail />
      <Box height={200}></Box>
    </Page>
  );
}

export default ArticlePage;
