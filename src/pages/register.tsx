import React, { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  configValue,
  phoneState,
  requestPhoneTriesState,
  userState,
} from "../state";
import { Box, Button, Icon, Text, useSnackbar } from "zmp-ui";
import { ListItem } from "../components/list-item";
import { ListRenderer } from "../components/list-renderer";
import { IDonvi, IUser } from "../models";
import {
  BASE_URL,
  deleteUserZmp,
  endpoint,
  getHuyen,
  getThon,
  getUserZmp,
  getXa,
  logo_register,
  mapUserZmp,
  saveUserZmp,
  secretKey,
} from "../configs";
import { Divider } from "../components/divider";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk";

export const RegisterListContent: FC = (sendDataToParent: any) => {
  const user = useRecoilValue(userState);
  //const phone = [];
  //const phone = useRecoilValue(phoneState);
  const [userPhone, setUserPhone] = useState("");

  const [userDB, setUserDB] = useState<IUser | null>();

  const [huyenList, setHuyenList] = useState<IDonvi[]>([]);
  const [xaList, setXaList] = useState<IDonvi[]>([]);
  const [thonList, setThonList] = useState<IDonvi[]>([]);

  const [selectedHuyen, setSelectedHuyen] = useState(null);
  const [selectedXa, setSelectedXa] = useState(null);
  const [selectedThon, setSelectedThon] = useState(null);

  const [selectedTenHuyen, setSelectedTenHuyen] = useState("");
  const [selectedTenXa, setSelectedTenXa] = useState("");
  const [selectedTenThon, setSelectedTenThon] = useState("");
  const { openSnackbar } = useSnackbar();
  const SHOW_THAYDOI_VAITRO = useRecoilValue(
    configValue("SHOW_THAYDOI_VAITRO"),
  );
 
  const requestPhone = async () => {
    const { number, token } = await getPhoneNumber({ fail: console.warn });
    if (number) {
      setUserDB(null);
      setUserPhone(number);
    }
    const access_token = await getAccessToken();

    const response = await fetch(`${endpoint}`, {
      method: "GET",
      headers: {
        access_token: access_token,
        code: JSON.stringify(token),
        secret_key: `${secretKey}`,
      },
    });
    const data = await response.json();

    const { userInfo } = await getUserInfo({});

    const postUserZmp = await fetch(`${BASE_URL}/${saveUserZmp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ZID: userInfo.id,
        NAME: userInfo.name,
        AVATAR: userInfo.avatar,
        PHONE_NUMBER: data?.data?.number,
      }),
    });
    const data_user = await postUserZmp.json();
 
    resetSelect(String(data?.data?.number || ""));
  };

  useEffect(() => {
    const fetchHuyenList = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${getHuyen}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setHuyenList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHuyenList();
  }, []);

  const handleHuyenSelect = async (huyenId, tenHuyen) => {
    setSelectedHuyen(huyenId);
    setSelectedTenHuyen(tenHuyen);
    try {
      const response = await fetch(`${BASE_URL}/${getXa}${huyenId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      const data = jsonData.data;
      setXaList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleXaSelect = async (xaId, tenXa) => {
    setSelectedXa(xaId);
    setSelectedTenXa(tenXa);
    try {
      const response = await fetch(`${BASE_URL}/${getThon}${xaId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      const data = jsonData.data;
      setThonList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleThonSelect = async (thonId, tenThon) => {
    try {
      const postMapUserZmp = await fetch(`${BASE_URL}/${mapUserZmp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ZID: user.id,
          ID_THON: thonId,
          ID_XA: selectedXa,
          ID_HUYEN: selectedHuyen,
          TEN_THON: tenThon,
          TEN_XA: selectedTenXa,
          TEN_HUYEN: selectedTenHuyen,
        }),
      });
      const data_map = await postMapUserZmp.json();
      //console.log(data_map);
      if (data_map) {
        openSnackbar({
          text: "Bạn đã xác thực thành công",
          type: "success",
        });
      }else{
        openSnackbar({
          text: "Bạn đã chưa xác thực thành công",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setSelectedThon(thonId);
    setSelectedTenThon(tenThon);
  };

  const resetSelect = (PHONE_NUMBER) => {
    setSelectedHuyen(null);
    setSelectedTenHuyen("");
    setSelectedXa(null);
    setSelectedTenXa("");
    setSelectedThon(null);
    setSelectedTenThon("");

    setUserDB(null);
    setUserPhone(PHONE_NUMBER);
  };

  const deleteSelect = async () => {
    
    try {
      const userZmp = await fetch(`${BASE_URL}/${deleteUserZmp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ZID: user.id,
        }),
      });
      const data_user = await userZmp.json();
      
      if (data_user.error_code === 0) {
       
        resetSelect("");

        openSnackbar({
          text: "Bạn đã huỷ vai trò cán bộ thôn",
          type: "success"
        });
        
      }else{
        openSnackbar({
          text: "Huỷ vai trò Không thành công",
          type: "warning"
        });
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  
  };

  //checkUser selectedThon change
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${getUserZmp}${user.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setUserDB(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkUser();
  }, [selectedThon]);

  //checkUser first
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${getUserZmp}${user.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setUserDB(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkUser();
  }, []);

  

  if (userDB === null) {
    if(userPhone !== ""){
      return (
      <Box >
          <Box
            style={{
              display: selectedHuyen === null ? "block" : "none",
            }}
          >
            <Text.Title
              className="space-y-3 px-4 title-chon"
            >
              Chọn huyện
            </Text.Title>
            <Box className="space-y-3 px-4 ">
              {huyenList.map((huyen) => (
                <Box flex className="space-x-3" key={huyen.id}>
                  <Button className="btn-chon" onClick={() => handleHuyenSelect(huyen.id, huyen.ten_donvi)}>
                    {huyen.ten_donvi}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            style={{
              display:
                selectedHuyen !== null &&
                selectedXa === null &&
                selectedThon === null
                  ? "block"
                  : "none",
            }}
          >
            <Text.Title
              className="space-y-3 px-4 title-chon"
            >
              Chọn xã
            </Text.Title>
            <Box className="space-y-3 px-4">
              {xaList.map((xa) => (
                <Box flex className="space-x-3" key={xa.id}>
                  <Button className="btn-chon"  onClick={() => handleXaSelect(xa.id, xa.ten_donvi)}>
                    {xa.ten_donvi}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            style={{
              display:
                selectedHuyen !== null &&
                selectedXa !== null &&
                selectedThon === null
                  ? "block"
                  : "none",
            }}
          >
            <Text.Title
              className="space-y-3 px-4 title-chon"
              style={{
                display: thonList.length > 0 ? "block" : "none",
              }}
            >
              Chọn thôn
            </Text.Title>
            <Text.Title
              className="space-y-3 px-4 title-chon"
              onClick={() => resetSelect(true)}
              style={{
                display: thonList.length === 0 ? "block" : "none",
              }}
            >
              Chưa có thôn nào trong {selectedTenXa} - Vui lòng liên hệ quản trị
            </Text.Title>
            <Box className="space-y-3 px-4">
              {thonList.map((thon) => (
                <Box flex className="space-x-3" key={thon.id}>
                <Button className="btn-chon"  onClick={() => handleThonSelect(thon.id, thon.ten_donvi)}>
                  {thon.ten_donvi}
                </Button>
              </Box>
              ))}
            </Box>
          </Box>
  
        </Box>
        );
    }else{
      return (
        <Box flex className="space-x-3" >
          <img src={`${logo_register}`} className="img-register" />
          <Box className="flex-1 space-y-[2px]">
            <Text.Title className="font-bold title-vaitro">
              Xác thực vai trò cán bộ thôn
            </Text.Title>
            
            <Button onClick={() => requestPhone()}>
              Bắt đầu xác thực
            </Button>
          </Box>
        </Box>
      );
     
    }
    
  }else{
    if (userDB?.donvi === null) {
      return (
        <Box
          flex className="space-x-3"
        >
          <img src={`${logo_register}`} className="img-register" />
          <Box className="flex-1 space-y-[2px]">
            <Text.Title className="font-bold title-vaitro">
              Xác thực vai trò cán bộ thôn
            </Text.Title>
            <Text size="small" className="title-sdt">
              Số điện thoại: {userDB.PHONE_NUMBER}
            </Text>
            <Button size="small" className="text-gray" onClick={() => resetSelect(`${userDB.PHONE_NUMBER}`)}>
              Bắt đầu xác thực
            </Button>
          </Box>
        </Box>
      );
    }else{
      return (
        <>
          {SHOW_THAYDOI_VAITRO === "1" ? (
            <Box>
              <Box className="flex-1 space-y-[2px]">
                <Text.Title className="font-bold title-vaitro">
                  {userDB?.donvi.TEN_HUYEN} - {userDB?.donvi.TEN_XA} -{" "}
                  {userDB?.donvi.TEN_THON}
                </Text.Title>
                <Text.Title className="title-sdt">
                  Số điện thoại: {userDB?.PHONE_NUMBER}
                </Text.Title>
              </Box>
              <Box flex className="space-x-5" >
                    <Button className="btn-chon-full" prefixIcon={<Icon icon="zi-switch-users-solid" />} onClick={() => resetSelect(`${userDB?.PHONE_NUMBER}`)}>
                      Thay đổi vai trò
                    </Button>
                  
                    <Button className="" type="danger" prefixIcon={<Icon icon="zi-stranger-solid" />} onClick={() => deleteSelect()}>
                      Huỷ bỏ
                    </Button>
                </Box>
            </Box>
          ) : (
            <Box
              className="flex-1 space-x-2"
            >
              <Box className="flex-1 space-y-[2px]">
                <Text.Title className="font-bold title-vaitro">
                  {userDB?.donvi.TEN_HUYEN} - {userDB?.donvi.TEN_XA} - {userDB?.donvi.TEN_THON}
                </Text.Title>
                <Text.Title className="title-sdt">
                  Số điện thoại: {userDB?.PHONE_NUMBER}
                </Text.Title>
              </Box>
            </Box>
          )}
        </>
      );
    } 
  }
  
 
};

export const RegisterPage: FC = () => {
  return <RegisterListContent />;
};
