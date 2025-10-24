import React, { FC } from "react";
import { getConfig } from "../../utils/config";


export const DisplayPrice: FC<{ children: number }> = ({ children }) => {
  const symbol = getConfig((config) => 'đ');
  if (getConfig((config) => false)) {
    return (
      <>
        {symbol}
        {children.toLocaleString()}
      </>
    );
  } else {
    return (
      <>
        {children.toLocaleString()}
        {symbol}
      </>
    );
  }
};
