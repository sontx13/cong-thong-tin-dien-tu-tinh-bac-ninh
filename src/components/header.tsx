import React from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "zmp-ui";
import { useRestaurant } from "../hooks";
import { getConfig } from "./config-provider";

function AppHeader() {
  const location = useLocation();

  const restaurant = useRestaurant(
    Number(new URLSearchParams(location.search).get("id")),
  );

  const title = useMemo(() => {
    if (location.pathname === "/") {
      return "Cổng TTĐT tỉnh Bắc Ninh";
    }
    if (location.pathname === "/infor") {
      return "Cá nhân";
    }
    if (location.pathname === "/congkhai") {
      return "Công khai";
    }
    if (location.pathname === "/congkhai-detail") {
      return "Chi tiết công khai";
    }
    if (location.pathname === "/congkhaiItem") {
      return "Danh sách công khai";
    }
    if (location.pathname === "/xa") {
      return "Danh sách Xã";
    }
    if (location.pathname === "/pakn") {
      return "Phản ánh kiến nghị";
    }
    if (location.pathname === "/pakn-create") {
      return "Gửi phản ánh kiến nghị";
    }
    if (location.pathname === "/pakn-detail") {
      return "Xem phản ánh kiến nghị";
    }
    if (location.pathname === "/article-detail") {
      return "Chi tiết tin tức";
    }
    if (location.pathname === "/restaurant") {
      if (restaurant) {
        return restaurant.name;
      }
    }
    return getConfig((c) => c.app.title);
  }, [location.pathname]);

  return (
    <>
      <Header
        className="sticky top-0 bg-image"
        title={title}
        style={{ 
          color: "#fff"
        }}
        showBackIcon={location.pathname !== "/"}
      />
    </>
  );
}

export default AppHeader;
