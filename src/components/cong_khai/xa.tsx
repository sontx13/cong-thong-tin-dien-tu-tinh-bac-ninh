import React, { useEffect } from "react";
import { FunctionComponent, useState } from "react";
import { Box, Button, Text, Grid, Icon, Page, Spinner } from "zmp-ui";
import { useBookingTotal } from "../../hooks";
import { IDonvi } from "../../models";
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from "recoil";
import { bookingsState } from "../../state";
import { BASE_URL, getXa } from "../../configs";
import Huyen from "./huyen";
import XaDetail from "./xa-detail";
import Header from "../header";

interface BookingItemProps {
  booking: IDonvi;
}

const { Title } = Text;

const Xa = () => {
  const [xa, setXa] = useState<any>([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get('id');
    const fetchXa = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${getXa}${idFromUrl}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setXa(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchXa();
  }, []);

  const center = {
    display: 'flex',
    justifyContent: 'center'
  }
  return (
    <Page className="min-h-0">
      <Header />
      <Box
        justifyContent="space-between"
        alignItems="center"
      >
        {xa.length === 0 ? (
          <div
            style={center}
          >
            <Spinner visible={true} />
          </div>
        ) : (
          <>
            {xa.map((huyen) => (
              <Box key={huyen.id} my={4}>
                <XaDetail xa={huyen} />
              </Box>
            ))}
          </>
        )}
      </Box>
    </Page>
  );
};

export default Xa;
