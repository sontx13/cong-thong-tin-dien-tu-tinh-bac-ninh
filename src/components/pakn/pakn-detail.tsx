import React, { useEffect, useState } from "react";
import { Box, Text, Checkbox, Page, Icon, Button, useSnackbar, useNavigate, Modal, Sheet } from "zmp-ui";
import { BASE_URL, web_url } from "../../configs";
import { openShareSheet, TextAlignType } from "zmp-sdk";
import { useRecoilValue } from "recoil";
import { userState } from "../../state";
import Header from "../header";
const { Title } = Text;

const PAKNDetail = () => {
  const user = useRecoilValue(userState);
  const [idCK, setIdCK] = useState<any>(null);
  const [pakn, setPAKN] = useState<any>({});
  const [popupVisible, setPopupVisible] = useState(false);


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get('id');
    setIdCK(idFromUrl);
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/zalo/getPAKNbyID?id=${idFromUrl}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setPAKN(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const boxTitle = {
    fontSize: '18px',
    textAlign: 'center',
    lineHeight: '1.1',
    fontWeight: 'bold',
  }
  const boxTit = {
    backgroundColor: 'rgb(248 251 234)',
    borderRadius: '10px',
    border: '1px solid grey'
  }
  const boxContent = {
    borderRadius: '10px',
    padding: '5px 15px'
  }
  if (pakn.url_tai_lieu) {
    var link = `${web_url}/${pakn.url_tai_lieu}`
  }
  const colorBlue = {
    color: '#1c6cb3',
    fontWeight: 'bold'
  }
  const fontWeight = {
    fontWeight: 'bold'
  }
  const line = {
    width: '100%',
    height: '1px',
    background: '#dfdfdf'
  }
  const navigate = useNavigate();
  const viewDetail = () => {
    navigate(`/pakn-create`);
  };
  return (
    <Page className="min-h-0 bg-white">
      <Header />
      <Box mx={4} my={4}>
        <div style={boxContent}>
          <p>  <Icon icon="zi-help-circle" size={20} />  Vấn đề PAKN: <span style={colorBlue}>{pakn.tieu_de}</span></p>
          <p> <Icon icon="zi-user" size={20} />   Người gửi: <span style={fontWeight}>{pakn.ten}</span></p>
          <p> <Icon icon="zi-filter" size={20} />  {pakn.dia_chi}</p>
          <p>  <Icon icon="zi-chat" size={20} />  Nội dung chi tiết: <span
            dangerouslySetInnerHTML={{
              __html: pakn.noi_dung,
            }}
          /></p>
          {pakn.url_tai_lieu != null ? <> <p>Danh sách file đính kèm: <span><a style={colorBlue} onClick={() => {
            setPopupVisible(true)
          }}>Xem</a></span></p></> : <> </>}
        </div>
        {pakn.tra_loi == null || pakn.tra_loi == "" ? <></> : <>
          <p style={line}></p>
          <div style={boxContent}>
            <p>  <Icon icon="zi-check" size={20} />  Trả lời: <span style={colorBlue}>   <span
              dangerouslySetInnerHTML={{
                __html: pakn.tra_loi,
              }}
            /> </span></p>
          </div></>}




        <Sheet
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          autoHeight
          mask
          handler
          swipeToClose
        >
          <div>
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              role='presentation'
              src={link}
              alt={link}
            />
          </div>
        </Sheet>
      </Box>
    </Page>

  );
};
export default PAKNDetail;
