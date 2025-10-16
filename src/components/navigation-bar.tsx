import React, { useEffect, useState } from "react";
import { BottomNavigation, Icon } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    path: "/",
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  {
    path: "/congkhai",
    label: "Đường dây nóng",
    icon: <Icon icon="zi-call" />,
  },
  {
    path: "/pakn",
    label: "Hỏi đáp",
    icon: <Icon icon="zi-post" />,
  },
  {
    path: "/infor",
    label: "Cá nhân",
    icon: <Icon icon="zi-user" />,
  },
];

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  useEffect(() => {
    navigate(activeTab);
  }, [activeTab]);
  useEffect(() => {
    if (navItems.find((item) => item.path === location.pathname)) {
      setActiveTab(location.pathname);
    }
  }, [location]);

  return (
    <>
      {location.pathname !== "/restaurant" && (
        <>
          <BottomNavigation
            id="bottom-nav"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
          >
            {navItems.map(({ path, label, icon }) => (
              <BottomNavigation.Item key={path} label={label} icon={icon} />
            ))}
          </BottomNavigation>
        </>
      )}
    </>
  );
}

export default NavigationBar;
