import React from "react";

function Day({ day }: { day: number }) {
  return (
    <>
      {
        ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"][
          day - 1
        ]
      }
    </>
  );
}

export const convertDay = (d: Date) => {
  var d = new Date();
  switch (d.getDay()) {
    case 0:
      return "Chủ Nhật, ";
    case 1:
      return "Thứ hai, ";
    case 2:
      return "Thứ ba, ";
    case 3:
      return "Thứ tư, ";
    case 4:
      return "Thứ năm, ";
    case 5:
      return "Thứ sáu, ";
    case 6:
      return "Thứ bảy, ";
    default:
      break;
  }
};

export default Day;
