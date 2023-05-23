import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
  TabListProps,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Button,
  Body1,
  Title3,
  Subtitle1,
  Input,
  Label,
  Divider,
  Switch,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("10px", "10px"),
    rowGap: "20px",
  },
  tab: {
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    gap: "5px",
  },
  divider: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    minHeight: "96px",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
  checkbox: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    marginLeft: "15px",
  },
});

function App() {
  const [currentPerson, setCurrentPerson] = useState({});
  const [fetchNew, setFetchNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("main");
  const [selectedURL, setSelectedURL] = useState("");
  const [selectedAPIKey, setSelectedAPIKey] = useState("");
  const [systemInfo, setSystemInfo] = useState({});
  const [enable, setEnable] = useState(false);

  const API_URL = "http://localhost:23523";
  const styles = useStyles();
  useEffect(() => {
    if (fetchNew) {
      console.log("Fetch New One");
      setFetchNew(false);
      axios
        .get(API_URL + "/pooling")
        .then((res) => {
          setCurrentPerson(res.data);
          setErrorMessage("");
        })
        .catch((err) => {
          setErrorMessage(JSON.stringify(err?.response?.data));
        });
    }

    return () => {};
  }, [fetchNew]);

  useEffect(() => {
    let timeout;
    if (enable) {
      if (fetchNew === false) {
        timeout = setTimeout(() => {
          setFetchNew(true);
        }, 3000);
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [fetchNew, enable]);

  const getSystemInfo = () => {
    axios
      .get(API_URL + "/")
      .then((res) => {
        setSystemInfo(res.data);
        setSelectedURL(res?.data?.apiURL);
        setSelectedAPIKey(res?.data?.apiKey);
      })
      .catch((err) => {
        setErrorMessage("เชื่อมต่อระบบไม่ได้" + err?.message);
      });
  };

  useEffect(() => {
    getSystemInfo();

    return () => {};
  }, []);

  const handleUpdateAPI = () => {
    const payload = {
      apiURL: selectedURL,
      apiKey: selectedAPIKey,
    };

    axios
      .put(API_URL + "/info", payload)
      .then(() => {
        alert("แก้ไขสำเร็จ");
        getSystemInfo();
      })
      .catch((err) => {
        setErrorMessage(`แก้ไขข้อมูลมีปัญหา  ${err?.message}`);
      });
  };
  return (
    <div>
      <div className={styles.root}>
        {" "}
        <TabList defaultSelectedValue={selectedTab} className={styles.tab}>
          <Tab value='main' onClick={() => setSelectedTab("main")}>
            หน้าหลัก
          </Tab>
          <Tab value='setting' onClick={() => setSelectedTab("setting")}>
            ตั้งค่า
          </Tab>
        </TabList>
      </div>

      {selectedTab === "main" && (
        <div>
          <div className={styles.checkbox}>
            <Body1>
              <Subtitle1>ระบบดึงข้อมูลจากบัตรประชาชน</Subtitle1>
            </Body1>
            <Switch
              checked={enable}
              onChange={(e) => setEnable(e.target.checked)}
              label={enable ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
            />
          </div>
          <Card className={styles.card}>
            <CardHeader />
            <div>
              <Body1>
                <b>เลขบัตรประจำตัวประชาชน </b>
                {currentPerson?.cid}
                <br />
                <b> ชื่อ </b>
                {currentPerson?.thPrefix}
                {currentPerson?.thName} {currentPerson?.thSurname} <br />
                <b> ที่อยู่ </b>
                {currentPerson?.address} <br />
                <b> วัน เดือน ปีเกิด </b>
                {currentPerson?.dayOfBirth || "-"}/
                {currentPerson?.monthOfBirth || "-"}/
                {currentPerson?.yearOfBirth || "-"}
              </Body1>
            </div>
            <CardFooter>
              {/* <Button>Reply</Button>
            <Button>Share</Button> */}
            </CardFooter>
          </Card>
        </div>
      )}
      {selectedTab === "setting" && (
        <Card className={styles.card}>
          <CardHeader
            header={
              <Body1>
                <Subtitle1>ตั้งค่าระบบ</Subtitle1>
                <div className={styles.form}>
                  <Label>
                    URL ของระบบ E-Accom เช่น https://demo.eaccom.net
                  </Label>
                  <Input
                    value={selectedURL}
                    onChange={(e) => setSelectedURL(e.target.value)}
                  />
                  <br />
                  <Label>API Token</Label>
                  <Input
                    value={selectedAPIKey}
                    onChange={(e) => setSelectedAPIKey(e.target.value)}
                  />
                </div>
              </Body1>
            }
          />
          <div></div>
          <CardFooter>
            <Button appearance='primary' onClick={() => handleUpdateAPI()}>
              Save
            </Button>
          </CardFooter>
        </Card>
      )}
      <div>{errorMessage}</div>
      <Divider />
      <div className={styles.footer}>
        <Body1>
          ศูนย์วิจัยระบบอัตโนมัติอัจฉริยะ คณะวิศวกรรมศาสตร์
          มหาวิทยาลัยสงขลานครินทร์
          <br />
          E-Accom ID Card Reader by IARC@PSU Version 0.0.1
        </Body1>
      </div>
    </div>
  );
}

export default App;
