import React, { Suspense } from "react";
import { Box, Page } from "zmp-ui";
import { Divider } from "../components/divider";
import { Banner  } from "./index/banner";
import { Categories } from "./index/categories";
import { SearchHome } from "./index/search_home";
import { Welcome } from "./welcome";


const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
      <SearchHome />
      <Banner />
      <Suspense>
          <Categories />
        </Suspense>
      </Box>
    </Page>
  );
};

export default HomePage;