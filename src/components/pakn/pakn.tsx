import React, { useEffect } from "react";
import { FunctionComponent, useState } from "react";
import { Box, Button, Text, Grid, Icon } from "zmp-ui";
import { IDonvi } from "../../models";
import { useNavigate } from 'react-router-dom';

interface PaknItemProps {
  pakn: any;
}

const { Title, Header } = Text;
let ngayNhap = '';
const PAKN: FunctionComponent<PaknItemProps> = ({ pakn }) => {

  const navigate = useNavigate();
  const viewDetail = (id) => {
    navigate(`/pakn-detail?id=${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const customStyle = {
    padding: '10px',
    borderRadius: '10px',
    width: '100%',
  };
  const titleColor = {
    color: '#1a6ab9',
    fontWeight: 'bold'
  };
  const fontWeight = {
    fontWeight: 'bold'
  };
  const checkflex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const success = {
    color: 'green',
    marginRight: '3px'
  };
  const primary = {
    marginRight: '3px'
  };
  const danger = {
    color: 'red',
    marginRight: '3px'
  };
  const lineHeight = {
    lineHeight: '2.0'
  }




  return (
    <Box
      flex
      justifyContent="space-between"
      alignItems="center"
      className="bg-white"
      onClick={() => viewDetail(pakn.id)}
      style={lineHeight}
    >
      <div style={customStyle}>
        <div >
          <Icon icon="zi-user" size={20} /> {pakn.ten} - <Icon icon="zi-reminder" size={20} />{formatDate(pakn.created_at)}
        </div>
        <div>
          {pakn.status == 2 ? <>
            <Icon icon="zi-bookmark" size={20} />   Đã xử lý
          </> : pakn.status == 0 ? <> <Icon icon="zi-bookmark" size={20} />   Chưa xử lý </> : <> <Icon icon="zi-bookmark" size={20} />   Đang xử lý </>}
        </div>

        <div>
          <span style={fontWeight}><Icon icon="zi-help-circle" size={20} /> {pakn.tieu_de}</span>
        </div>
        <div>
          <Icon icon="zi-chat" size={20} />  Nội dung kiến nghị:  <span
            dangerouslySetInnerHTML={{
              __html: pakn.noi_dung,
            }}
          />
        </div>

      </div>

    </Box>
  );
};

export default PAKN;
