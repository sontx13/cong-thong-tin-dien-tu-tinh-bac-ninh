import React, { FC, MouseEventHandler, ReactNode } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { logo_app, logo_register } from "../configs";

export interface ListItemProps {
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const ListItem: FC<ListItemProps> = ({ title, subtitle, onClick }) => {
  return (
    <Box flex className="space-x-3" >
      <img src={`${logo_register}`} className="img-register" />
      <Box className="flex-1 space-y-[2px]">
        <Text.Title className="font-bold title-vaitro">
          {title}
        </Text.Title>
        
        <Button onClick={onClick}>
          {subtitle}
        </Button>
      </Box>
    </Box>
  );
};
