import React, { useEffect } from "react";
import { useState } from "react";
import { Box, Text, Page, Input, Spinner } from "zmp-ui";
import { CongKhai } from "../../models";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { checkUser, listCongKhai, userState } from "../../state";
import { BASE_URL } from "../../configs";
import CKItem from "./cong-khai-item";
import Header from "../header";
interface BookingItemProps {
  booking: CongKhai;
}

const { Title } = Text;
let idXa;
const CongKhaiItem = () => {
  const [loading, setLoading] = useState(false);

  const [congKhai, setCongKhai] = useState<any>([]);
  const user = useRecoilValue(userState);

  const handleInput = (value) => {
    setLoading(true)
    const fetchCongKhai = async () => {
      try {
        const response = await fetch(`${BASE_URL}/zalo/ttCongKhaiByKey?key=${value.target.value}&id_xa=${idXa}&user_id=${user.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setCongKhai(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching data:', error);
      }
    };
    fetchCongKhai();
  };
  const searchParams = new URLSearchParams(window.location.search);
  const idFromUrl = searchParams.get('id');
  const fetchCheck = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user_zmp/getUserZmp?zid=${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return jsonData.data.donvi
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchTTCK = async () => {
    try {
      const response = await fetch(`${BASE_URL}/zalo/ttCongKhaiByXa?id=${idXa}&user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return jsonData.data

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const check = await fetchCheck();
        if (check != null) {
          idXa = check.ID_XA
        } else {
          idXa = idFromUrl

        }
        const congKhai = await fetchTTCK();
        setCongKhai(congKhai);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const center = {
    display: 'flex',
    justifyContent: 'center'
  }

  return (

    <Page className="min-h-0 bg-white">
      <Header />
      <Box mx={4}>
        <Input.Search onChange={handleInput} />
      </Box>
      <Box mx={4} mt={6}>
        <Title className="mt-6 mb-3 font-semibold">Danh sách thông tin công khai</Title>
      </Box>
      {loading == true ? <>
        <div
          style={center}
        >
          <Spinner visible={true} />
        </div> </> : <>

        <Box
          justifyContent="space-between"
          alignItems="center"
        >
          {congKhai.length === 0 ? (
            <div
              style={center}
            >
              <Spinner visible={true} />
            </div>
          ) : (
            <>
              {congKhai.map((congKhai) => (
                <Box key={congKhai.id} my={4}>
                  <CKItem booking={congKhai} />
                </Box>
              ))}
            </>
          )}
        </Box>
      </>}
    </Page>
  );
};

export default CongKhaiItem;
