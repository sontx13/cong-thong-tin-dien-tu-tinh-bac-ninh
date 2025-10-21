import React, { useEffect, useState } from "react";
import { Box, Text, Checkbox, Page, Icon, Button, useSnackbar, Modal, Sheet } from "zmp-ui";
import { BASE_URL, logo_app, web_url } from "../../configs";
import { openShareSheet, TextAlignType } from "zmp-sdk";
import { useRecoilValue } from "recoil";
import { userState } from "../../state";
import Header from "../header";
const { Title } = Text;
var check1 = false;
var check2 = false;
var check3 = false;
var check4 = false;
var check5 = false;
var check6 = false;
var link
const CongKhaiDetail = () => {

  const user = useRecoilValue(userState);
  const [idCK, setIdCK] = useState<any>(null);
  const [congKhai, setCongKhai] = useState<any>({});
  const { openSnackbar } = useSnackbar();

  const handleShare = (value) => {

    openShareSheet({
      type: "link",
      data: {
        link: `https://qcdc.vnptlab.com/view/webDetail?id=${idCK}`,
        chatOnly: false
      },
      success: (data) => { },
      fail: (err) => { }
    });

    fetch(`${BASE_URL}/zalo/ghiLaiTTCongKhai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        congkhai_id: idCK,
        user_id: user.id,
        is_xem_ck: '1',
        is_share_zalo: '1',
        role_id: '9'
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
      })
      .catch(error => {
      });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get('id');
    setIdCK(idFromUrl);
    const updateView = async () => {
      fetch(`${BASE_URL}/zalo/ghiLaiTTCongKhai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          congkhai_id: idFromUrl,
          user_id: user.id,
          is_xem_ck: '1',
          is_share_zalo: '0',
          role_id: '9'
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/zalo/ttCongKhaiById?id=${idFromUrl}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        check1 = data.hinhthuc_congkhai.includes('1');
        check2 = data.hinhthuc_congkhai.includes('2');
        check3 = data.hinhthuc_congkhai.includes('3');
        check4 = data.hinhthuc_congkhai.includes('4');
        check5 = data.hinhthuc_congkhai.includes('5');
        if (check1 == false && check2 == false && check3 == false && check4 == false && check5 == false) {
          check6 = true
        }

        link = await `https://docs.google.com/viewer?url=${web_url}${data.filecongkhai_path}&embedded=true`
        setCongKhai(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    updateView();
  }, []);

  const customStyle = {
    fontSize: '19px',
    display: 'flex',
    justifyContent: 'space-between'
  };
  const fontSize = {
    fontSize: '25px',
    color: 'grey'
  };
  const width = {
    width: '75%',
  };
  const colorWhite = {
    color: 'white',
    marginRight: '5px',
    marginBottom: '4px'
  }
  const displayFlex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  var tg_congkhai = '';
  if (congKhai.tg_congkhai == '90ngay') {
    tg_congkhai = '90 Ngày'
  } else if (congKhai.tg_congkhai == 'thuongxuyen') {
    tg_congkhai = 'Thường xuyên'
  }
  else if (congKhai.tg_congkhai == '30ngay') {
    tg_congkhai = '30 Ngày'
  } else {
    tg_congkhai = 'Khác'
  }
  console.log(link)
  const [popupVisible, setPopupVisible] = useState(false);
  return (
    <Page className="min-h-0 bg-white">
      <Header />
      <Box mx={4}>
        <Title className="mt-6 mb-3 font-semibold">Nội dung công khai</Title>
        <p>{congKhai.noidung_congkhai}</p>
        <Title className="mt-6 mb-3 font-semibold">Hình thức công khai</Title>
        <Box textAlign={'left'}>
          <div style={customStyle}><span style={fontSize}>01</span><span style={width}>Niêm yết 1 nơi {check2 == true ? '1' : '2'}</span>  <Checkbox value={""} checked={check1} /> </div>
          <br />
          <div style={customStyle}><span style={fontSize}>02</span><span style={width}>Niêm yết 2 nơi</span>  <Checkbox value={""} checked={check2} /> </div>
          <br />
          <div style={customStyle}><span style={fontSize}>03</span><span style={width}>Đăng tải trên cổng thông tin </span>  <Checkbox value={""} checked={check3} /> </div>
          <br />
          <div style={customStyle}><span style={fontSize}>04</span><span style={width}>Loa truyền thanh</span>    <Checkbox value={""} checked={check4} /> </div>
          <br />
          <div style={customStyle}><span style={fontSize}>05</span><span style={width}>Thông qua trưởng thôn, TDP </span> <Checkbox value={""} checked={check5} /> </div>
          <br />
          <div style={customStyle}><span style={fontSize}>06</span><span style={width}>Khác </span> <Checkbox value={""} checked={check6} /> </div>
        </Box>
        <br />
        <div style={displayFlex}><p>Thời gian công khai</p> <p>{
          tg_congkhai
        }</p> </div>
        <div style={displayFlex}><p>Thông tin công khai</p> {
          congKhai.filecongkhai_path == null ? <> </> : <> <a onClick={() => { setPopupVisible(true) }}><Icon icon="zi-unhide" size={28} /></a> </>
        }  </div>
        <br />
        <Button variant="primary" onClick={() => handleShare(congKhai)} fullWidth size="large">
          <Icon icon="zi-share" style={colorWhite} size={28} />
          Chia sẻ

        </Button>
        <Sheet
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          autoHeight
          mask
          handler
          swipeToClose
          height={700}
        >
          <iframe src={link} title="PDF Viewer" width="100%" height="100%"></iframe>
        </Sheet>
      </Box>
    </Page>

  );
};
export default CongKhaiDetail;
