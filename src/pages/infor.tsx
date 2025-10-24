import React, { Suspense, useEffect, useState } from "react";
import { Page, Box, Avatar, Text, Icon, useSnackbar } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { listConfig, userState } from "../state";
import { ListRenderer } from "../components/list-renderer";
import { Divider } from "../components/divider";
import { RegisterPage } from "./register";
import {
  addRating,
  favoriteApp,
  followOA,
  getAppInfo,
  getUserInfo,
  openPhone,
  openShareSheet,
} from "zmp-sdk";
import { openPermissionSetting } from "zmp-sdk/apis";
import Header from "../components/header";
import { logo_danvan } from "../configs";

const getConfigByName = (configs, name) => {
  return configs.find((config) => config.name_config === name);
};

function Welcome() {
  const user = useRecoilValue(userState);
  const configs = useRecoilValue(listConfig(""));
  //console.log(configs);

  const PHONE = configs ? getConfigByName(configs, "PHONE").value_config : "";
  const ZALO_OA_ID = configs
    ? getConfigByName(configs, "ZALO_OA_ID").value_config
    : "";
  const ZALO_OA_TITLE = configs
    ? getConfigByName(configs, "ZALO_OA_TITLE").value_config
    : "";
  const ZALO_OA_LOGO = configs
    ? getConfigByName(configs, "ZALO_OA_LOGO").value_config
    : "";
  const SHOW_THAYDOI_VAITRO = configs
    ? getConfigByName(configs, "SHOW_THAYDOI_VAITRO").value_config
    : "1";
  const SHOW_QUAN_TAM_ZALO = configs
    ? getConfigByName(configs, "SHOW_QUAN_TAM_ZALO").value_config
    : "1";
  const SHOW_CHIA_SE_APP_LINK = configs
    ? getConfigByName(configs, "SHOW_CHIA_SE_APP_LINK").value_config
    : "1";
  const SHOW_CHIA_SE_APP_QR = configs
    ? getConfigByName(configs, "SHOW_CHIA_SE_APP_QR").value_config
    : "1";
  const SHOW_LIEN_HE = configs
    ? getConfigByName(configs, "SHOW_LIEN_HE").value_config
    : "1";
  const SHOW_YEU_THICH_APP = configs
    ? getConfigByName(configs, "SHOW_YEU_THICH_APP").value_config
    : "1";
  const SHOW_DANH_GIA_APP = configs
    ? getConfigByName(configs, "SHOW_DANH_GIA_APP").value_config
    : "1";
  const SHOW_CAI_DAT_QUYEN = configs
    ? getConfigByName(configs, "SHOW_CAI_DAT_QUYEN").value_config
    : "1";
  const SHOW_XAC_THUC = configs
    ? getConfigByName(configs, "SHOW_XAC_THUC").value_config
    : "1";

  const [userCheck, setUserCheck] = useState(user);

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      setUserCheck(userInfo);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const { openSnackbar } = useSnackbar();

  const follow = async () => {
    try {
      const f = await followOA({
        id: ZALO_OA_ID,
      });
      openSnackbar({
        text: ZALO_OA_TITLE,
        type: "success",
      });
    } catch (error) {
      console.log(error);
      if ((error as any).code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối. Mời bạn hãy quan tâm Zalo OA",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Bạn đã quan tâm Zalo OA",
          type: "info",
        });
      }
    }
  };

  const openCallScreen = async () => {
    try {
      await openPhone({
        phoneNumber: PHONE,
      });
    } catch (error) {
      openSnackbar({
        text: "Không liên hệ được",
        type: "warning",
      });
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const callAPI = async () => {
    try {
      await openPermissionSetting({});
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const shareAppUrl = async () => {
    try {
      const { appUrl } = await getAppInfo({});

      openShareSheet({
        type: "link",
        data: {
          link: appUrl,
          chatOnly: false,
        },
        success: (data) => {
          openSnackbar({
            text: "Chia sẻ qua link thành công",
            type: "success",
          });
        },
        fail: (err) => {
          openSnackbar({
            text: "Chia sẻ qua qua link thất bại",
            type: "warning",
          });
        },
      });
    } catch (error) {
      openSnackbar({
        text: "Không chia sẻ được",
        type: "warning",
      });
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const shareQrCodeUrl = async () => {
    try {
      const { qrCodeUrl } = await getAppInfo({});

      openShareSheet({
        type: "link",
        data: {
          link: qrCodeUrl,
          chatOnly: false,
        },
        success: (data) => {
          openSnackbar({
            text: "Chia sẻ qua QR code thành công",
            type: "success",
          });
        },
        fail: (err) => {
          openSnackbar({
            text: "Chia sẻ qua QR code thất bại",
            type: "warning",
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const callAddRating = async () => {
    try {
      await addRating();
      openSnackbar({
        text: "Đánh giá ứng dụng thành công",
        type: "success",
      });
    } catch (error) {
      if ((error as any).code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối. Mời bạn hãy đánh giá ứng dụng",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Bạn đã Đánh giá ứng dụng",
          type: "info",
        });
      }
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const callFavoriteApp = async () => {
    try {
      await favoriteApp();
      openSnackbar({
        text: "Yêu thích ứng dụng thành công",
        type: "success",
      });
    } catch (error) {
      if ((error as any).code === -201) {
        openSnackbar({
          text: "Bạn đã từ chối. Mời bạn hãy Yêu thích ứng dụng",
          type: "warning",
        });
      } else {
        openSnackbar({
          text: "Bạn đã Yêu thích ứng dụng",
          type: "info",
        });
      }
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <Box
        flex
        alignItems="center"
        className="bg-white"
        onClick={() => getUser()}
      >
        <Box
          mx={5}
          mb={2}
          mt={3}
          flex
          alignItems="center"
          className="space-x-4"
        >
          <Avatar className="shadow align-middle mb-2" src={userCheck.avatar}>
            Hi
          </Avatar>
          <Box>
            <Text.Title>
              {userCheck.name ? <>Chào, {userCheck.name}!</> : "Công dân"}
            </Text.Title>
            {userCheck.name ? <></> : "Vui lòng cung cấp tên và ảnh đại diện"}
          </Box>
        </Box>
      </Box>

      <Divider size={10} />
      {/* {userCheck.name ? (
        <Box className="space-y-3 px-4 ">
          <Box
            className="bg-green text-white rounded-xl p-4 space-y-2"
            style={{
              background: `#fff`,
              backgroundPosition: "right 8px center",
              backgroundRepeat: "no-repeat",
            }}
          >
              {SHOW_XAC_THUC === "1" ? <RegisterPage /> : <></>}
          </Box>
        </Box>
      ) : (
        <></>
      )} */}

      <Divider size={10} />
      {SHOW_QUAN_TAM_ZALO === "1" ? (
        <Box className="space-y-3 px-4 ">
          <ListRenderer
            items={[
              {
                left: (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`${ZALO_OA_LOGO}`}
                  />
                ),
                right: (
                  <Box flex className="space-x-2" onClick={() => follow()}>
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Title className="flex-1 items-center font-normal">
                        {ZALO_OA_TITLE}
                      </Text.Title>
                      <Text.Header className="flex-1 items-center font-normal">
                        Nhận thông báo từ Zalo OA
                      </Text.Header>
                    </Box>
                  </Box>
                ),
                key: "1",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        </Box>
      ) : (
        <></>
      )}
      <Divider size={10} />
      <Box className="space-y-1 px-4">
        {SHOW_CHIA_SE_APP_LINK === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-share" className="my-auto" />,
                right: (
                  <Box flex className="space-x-2" onClick={() => shareAppUrl()}>
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Chia sẻ ứng dụng qua link
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "1",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}

        {SHOW_CHIA_SE_APP_QR === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-qrline" className="my-auto" />,
                right: (
                  <Box
                    flex
                    className="space-x-2"
                    onClick={() => shareQrCodeUrl()}
                  >
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Chia sẻ ứng dụng qua mã QR
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "2",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}

        {SHOW_LIEN_HE === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-call" className="my-auto" />,
                right: (
                  <Box
                    flex
                    className="space-x-2"
                    onClick={() => openCallScreen()}
                  >
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Liên hệ góp ý
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "3",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}

        {SHOW_YEU_THICH_APP === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-heart" className="my-auto" />,
                right: (
                  <Box
                    flex
                    className="space-x-2"
                    onClick={() => callFavoriteApp()}
                  >
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Yêu thích ứng dụng
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "4",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}

        {SHOW_DANH_GIA_APP === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-star" className="my-auto" />,
                right: (
                  <Box
                    flex
                    className="space-x-2"
                    onClick={() => callAddRating()}
                  >
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Đánh giá ứng dụng
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "5",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}

        {SHOW_CAI_DAT_QUYEN === "1" ? (
          <ListRenderer
            items={[
              {
                left: <Icon icon="zi-setting" className="my-auto" />,
                right: (
                  <Box flex className="space-x-2" onClick={() => callAPI()}>
                    <Box className="flex-1 space-y-[2px]">
                      <Text.Header className="flex-1 items-center font-normal">
                        Cài đặt quyền
                      </Text.Header>
                    </Box>
                    <Icon icon="zi-chevron-right" />
                  </Box>
                ),
                key: "6",
              },
            ]}
            limit={4}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
            renderKey={(item) => JSON.stringify({ item: item.key })}
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

const InforPage = () => {
  return (
    <Page>
      <Box>
        <Suspense>
          <Welcome />
        </Suspense>
      </Box>
    </Page>
  );
};

export default InforPage;
