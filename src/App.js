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
});

function App() {
  const [currentPerson, setCurrentPerson] = useState({});
  const [fetchNew, setFetchNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("main");
  const [selectedURL, setSelectedURL] = useState("");
  const [selectedAPIKey, setSelectedAPIKey] = useState("");

  const styles = useStyles();
  useEffect(() => {
    if (fetchNew) {
      console.log("Fetch New One");
      setFetchNew(false);
      axios
        .get("http://localhost:23523/pooling")
        .then((res) => {
          setCurrentPerson(res.data);
          setErrorMessage("");
        })
        .catch((err) => {
          setErrorMessage(err?.message);
        });
    }

    return () => {};
  }, [fetchNew]);

  useEffect(() => {
    let timeout;
    if (fetchNew === false) {
      timeout = setTimeout(() => {
        setFetchNew(true);
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [fetchNew]);

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
        <Card className={styles.card}>
          <CardHeader
            header={
              <Body1>
                <Subtitle1>ระบบดึงข้อมูลจากบัตรประชาชน</Subtitle1>
              </Body1>
            }
          />
          <div>
            <Body1>
              <b>เลขบัตรประจำตัวประชาชน {currentPerson?.cid}</b>
            </Body1>
          </div>
          <CardFooter>
            <Button>Reply</Button>
            <Button>Share</Button>
          </CardFooter>
        </Card>
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
            <Button appearance='primary'>Save</Button>
          </CardFooter>
        </Card>
      )}
      <div>{errorMessage}</div>
    </div>
  );
}

export default App;
