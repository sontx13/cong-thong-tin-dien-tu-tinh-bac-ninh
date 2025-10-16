import React, { useEffect } from "react";
import { FunctionComponent } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { CongKhai } from "../../models";
import { useNavigate } from 'react-router-dom';
import { userState } from "../../state";
import { useRecoilValue } from "recoil";
import { BASE_URL } from "../../configs";

interface BookingItemProps {
  booking: CongKhai;
}

const { Title, Header } = Text;


const CKItem: FunctionComponent<BookingItemProps> = ({ booking }) => {
  const navigate = useNavigate();
  const viewDetail = (id) => {
    navigate(`/congkhai-detail?id=${id}`);
  };
  const user = useRecoilValue(userState);



  const customStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0efff',
    padding: '10px',
    borderRadius: '10px',
    width: '100%',
    opacity: booking.view === 0 ? '1' : '0.6',

  };
  const marginRight = {
    marginRight: '15px'
  };
  const textLeft = {
    fontWeight: booking.view === 0 ? '600' : ''
  };
  const icon = booking.view === 0 ? 'zi-inbox' : 'zi-file';
  const shareIcon = {
    marginLeft: booking.share === 1 ? '5px' : ''
  };
  const checkColor = {
    color: booking.share === 0 ? 'rgb(0, 0, 0)' : 'green',
    fontWeight: 'bold'
  };
  return (

    <Box mx={5}
      flex
      justifyContent="space-between"
      alignItems="center"
      onClick={() => viewDetail(booking.id)}
    >
      <div style={customStyle}>
        <div style={marginRight}>
          <Icon icon={icon} size={20} />
        </div>
        <div style={textLeft}>
          {booking.noidung_congkhai}
        </div>
        {
          booking.share === 1 ? <>   <Icon style={shareIcon} icon="zi-share" size={20} /></> : <>  </>
        }
      </div>

    </Box>
  );
};

export default CKItem;
