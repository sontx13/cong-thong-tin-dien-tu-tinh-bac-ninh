import React, { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import { Box } from "zmp-ui";
import { BASE_API,urlImage,getBanners } from "../../configs";
import { openWebview } from "zmp-sdk";


interface IBanner {
  id: number;
  image: string;
  url: string;
}

export const Banner: FC = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${BASE_API}/${getBanners}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      //console.log("📦 Banners API response:", JSON.stringify(jsonData));
      setBanners(jsonData.data?.result || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const openUrlInWebview = async (url: string) => {
    if (!url) return;
    try {
      console.log("🧭 Try openWebview:", url);
      await openWebview({
        url,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      console.warn("⚠️ openWebview failed, fallback to window.open", error);
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <Box className="bg-white" pb={4}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        cssMode
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="px-4">
            <Box
              onClick={() => openUrlInWebview(banner.url)}
              className="w-full rounded-lg aspect-[2/1] bg-cover bg-center bg-skeleton block cursor-pointer"
              style={{
                backgroundImage: `url(${urlImage + "banner/" + banner.image})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
