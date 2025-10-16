import React from "react";
import { useState } from "react";
import { Box, Button, Text, Page, Input, useSnackbar, Modal } from "zmp-ui";
import { IDonvi } from "../../models";
import { BASE_URL } from "../../configs";
import Header from "../header";

interface BookingItemProps {
  booking: IDonvi;
}

const { Title } = Text;

const CreatePAKN = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pakn, setPAKN] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const { openSnackbar } = useSnackbar();
  const submit = () => {


    if (name && phone && pakn && content) {
      fetch(`${BASE_URL}/zalo/ghiLaiPAKNisZalo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten: name,
          so_dien_thoai: phone,
          email: email,
          dia_chi: address,
          tieu_de: pakn,
          noi_dung: content,
          file: file
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          openSnackbar({
            text: "Thêm mới thành công",
            type: "success"
          });
          setDialogVisible(true)
        })
        .catch(error => {
        });
    } else {
      openSnackbar({
        text: "Vui lòng nhập đủ thông tin bắt buộc",
        type: "error"
      });
    }

  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    const formData = new FormData();
    if (file) {
      for (let i = 0; i < file.length; i++) {
        formData.append('files', file[i]);
      }
    }
    fetch(`${BASE_URL}/zalo/file/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        const data = response.json;
        return response.json();
      })
      .then(data => {
        setFile(data.file_path)
      })
      .catch(error => {
      });
  };

  const boxTitle = {
    fontSize: '25px',
    textAlign: 'center',
    lineHeight: '1.1',
    fontWeight: 'bold',
  }
  const boxTit = {
    borderRadius: '10px',
  }
  const boxContent = {
    borderRadius: '10px',
    marginTop: '10px',
    padding: '20px'
  }
  const handleName = (event) => {
    setName(event.target.value);
  };
  const handlePhone = (event) => {
    setPhone(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const handlePAKN = (event) => {
    setPAKN(event.target.value);
  };
  const handleContent = (event) => {
    setContent(event.target.value);

  };
  return (
    <Page className="min-h-0 bg-white">
      <Header />
      <Box
        mx={4}
        my={4}
      >
        <div style={boxTit}>
          <p style={boxTitle}> PHIẾU TIẾP NHẬN <br /> PHẢN ÁNH KIẾN NGHỊ </p>
        </div>
        <div style={boxContent}>
          <Input
            type="text"
            label="Họ tên(*)"
            value={name}
            onChange={handleName}
          />
          <Input
            type="text"
            label="Số điện thoại(*)"
            value={phone}
            onChange={handlePhone}
          />
          <Input
            type="text"
            label="Email"
            value={email}
            onChange={handleEmail}
          />
          <Input
            type="text"
            label="Địa chỉ"
            value={address}
            onChange={handleAddress}
          />
          <Input
            type="text"
            label="Phản ánh kiến nghị về việc(*)"
            value={pakn}
            onChange={handlePAKN}
          />
          <Input.TextArea
            label="Nội dung(*)"
            value={content}
            onChange={handleContent}
          />
          <p>File đính kèm</p>
          <input type='file' onChange={handleFileChange} />
        </div>
        <br />
        <Button fullWidth onClick={submit} size="large">
          Gửi phản ánh
        </Button>
      </Box>
      <div className="createPAKN">
        <Modal
          visible={dialogVisible}
          title="Gửi thành công"
          onClose={() => {
            setDialogVisible(false);
            window.history.back();
          }}
          description="Cảm ơn bạn đã gửi phản ánh kiến nghị chúng tôi sẽ trả lời sớm nhất"
        />
      </div>

    </Page>
  );
};

export default CreatePAKN;
