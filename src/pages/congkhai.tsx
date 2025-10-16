import React from "react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { getAppInfo, openShareSheet } from "zmp-sdk";
import { Box, Button, Input, Page, Select, Spinner, Text } from "zmp-ui";
import BookingItem from "../components/cong_khai/cong-khai";
import { checkUser, listCongKhai, userState } from "../state";
import { BASE_URL, getHuyen, getXa } from "../configs";
import Huyen from "../components/cong_khai/huyen";
import CongKhaiItem from "../components/cong_khai/cong-khai";
import Header from "../components/header";

const labels = {
  upcoming: "Sắp đến",
  finished: "Hoàn thành",
};
const { Title } = Text;

let idXa;
let check;
function CongkhaiPage() {
  const [huyen, setHuyen] = useState<any>([]);
  const [xa, setXa] = useState<any>([]);
  const [congKhai, setCongKhai] = useState<any>([]);
  const user = useRecoilValue(userState);


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
  const fetchHuyen = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${getHuyen}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      const data = jsonData.data;
      setHuyen(data); // Set fetched data to the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        check = await fetchCheck();
        fetchHuyen();
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

      {check == null ? <>
        {huyen.length === 0 ? (
          <div
            style={center}
          >
            <Header />
            <Spinner visible={true} />
          </div>
        ) : (
          <>
            <Header />
            {huyen.map((huyen) => (
              <Box key={huyen.id} my={4}>
                <Huyen booking={huyen} />
              </Box>
            ))}
          </>
        )}
      </> : <>
        <CongKhaiItem id={idXa} />
      </>}
    </Page>
  );
}

export default CongkhaiPage;
