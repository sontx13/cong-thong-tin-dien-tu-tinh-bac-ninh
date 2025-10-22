import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useNavigate } from "react-router";
import { BASE_API, getConfigs, urlImage } from "../../configs";
import { openWebview } from "zmp-sdk/apis";

interface IConfig {
  id: number;
  name: string;
  icon: string;
  url: string;
}

export const Configs: FC = () => {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState<IConfig[]>([]);

  const fetchConfigs = async () => {
    try {
      const response = await fetch(`${BASE_API}/${getConfigs}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      console.log("📦 configs API response:", JSON.stringify(jsonData));
      setConfigs(jsonData.data?.result || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  


  return (
    <Box className="bg-white grid grid-cols-4 gap-4 p-4">
      {configs.map((config, i) => (
        
        <div
          key={i}
          onClick={() => navigate("/category")}
          className="flex flex-col space-y-2 items-center"
        >
          <img className="w-12 h-12" src={urlImage + 'config/' + config.icon} />
          <Text size="xxSmall" className="text-gray my-text-center">
            {config.name}
          </Text>
        </div>
      ))}
    </Box>
  );
};
