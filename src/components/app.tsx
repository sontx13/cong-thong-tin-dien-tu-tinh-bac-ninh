import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import Header from "./header";
import NavigationBar from "./navigation-bar";
import CongKhaiDetail from "../components/cong_khai/cong-khai-detail"
import ArticlePage from "../pages/article";
import CongKhaiPage from "../pages/congkhai";
import InforPage from "../pages/infor";
import { ConfigProvider, getConfig } from "./config-provider";
import PAKNPage from "../pages/pakn";
import Xa from "./cong_khai/xa";
import CongKhaiItem from "./cong_khai/cong-khai";
import CreatePAKN from "./pakn/create";
import PAKNDetail from "./pakn/pakn-detail";
import ArticleDetail from "../pages/article/detail";
import HomePage from "../pages";
import PostPage from "../pages/post";

const MyApp = () => {
  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-secondary-color": getConfig((c) => c.template.secondaryColor),
        }}
      >
        <App>
          <SnackbarProvider>
            <ZMPRouter >
    =
              {/* <Header /> */}
              <Suspense fallback={<div className="flex h-full justify-center items-center ">Loading...</div>}>
                <AnimationRoutes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/post" element={<PostPage />} />
                  <Route path="/article" element={<ArticlePage />}></Route>
                  <Route path="/article-detail" element={<ArticleDetail />}></Route>      
                  <Route path="/congkhai" element={<CongKhaiPage />}></Route>
                  <Route path="/infor" element={<InforPage />}></Route>
                  <Route path="/pakn" element={<PAKNPage />}></Route>
                  <Route path="/congkhai-detail" element={<CongKhaiDetail />}></Route>
                  <Route path="/congkhaiItem" element={<CongKhaiItem />}></Route>
                  <Route path="/xa" element={<Xa />}></Route>
                  <Route path="/pakn-create" element={<CreatePAKN />}></Route>
                  <Route path="/pakn-detail" element={<PAKNDetail />}></Route>
                </AnimationRoutes>
              </Suspense>
              <NavigationBar />
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
