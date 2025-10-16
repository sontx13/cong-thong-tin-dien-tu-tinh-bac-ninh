import React from "react";
import { FunctionComponent, useState } from "react";
import { Box, Button, Text, Grid, Icon } from "zmp-ui";
import { IDonvi } from "../../models";
import { useNavigate } from 'react-router-dom';

interface BookingItemProps {
  xa: IDonvi;
}

const { Title, Header } = Text;

const XaDetail: FunctionComponent<BookingItemProps> = ({ xa }) => {
  const navigate = useNavigate();
  const viewDetail = (id) => {
    navigate(`/congkhaiItem?id=${id}`);
  };
  const customStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0efff',
    padding: '10px',
    borderRadius: '10px',
    width: '100%'
  };
  const marginRight = {
    marginRight: '15px'
  };


  return (
    <Box mx={5}
      flex
      justifyContent="space-between"
      alignItems="center"
      onClick={() => viewDetail(xa.id)}
    >
      <div style={customStyle}>
        <div style={marginRight}>
          <Icon icon="zi-note" size={28} />
        </div>
        <div >
          {xa.ten_donvi}
        </div>
        <Icon icon="zi-check-circle" size={28} />
      </div>

    </Box>
  );
};

export default XaDetail;
