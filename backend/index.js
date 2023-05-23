const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({}));
const { Reader } = require("thaismartcardreader.js");
const { error } = require("console");

const myReader = new Reader();

let currentPerson = {};
process.on("unhandledRejection", (reason) => {
  console.log("From Global Rejection -> Reason: " + reason);
  process.exit();
});

myReader.on("device-activated", async (event) => {
  console.log("Device-Activated");
  console.log(event.name);
  console.log("=============================================");
});

myReader.on("error", async (err) => {
  console.log(err);
  throw error;
});

// myReader.on("image-reading", (percent) => {
//   console.log(percent);
// });

myReader.on("card-inserted", async (person) => {
  if (person) {
    console.log("PERSON FOUND");
    const cid = await person.getCid();
    const thName = await person.getNameTH();
    const enName = await person.getNameEN();
    const dob = await person.getDoB();
    const issueDate = await person.getIssueDate();
    const expireDate = await person.getExpireDate();
    const address = await person.getAddress();
    const issuer = await person.getIssuer();

    console.log(`CitizenID: ${cid}`);
    console.log(
      `THName: ${thName.prefix} ${thName.firstname} ${thName.lastname}`
    );
    console.log(
      `ENName: ${enName.prefix} ${enName.firstname} ${enName.lastname}`
    );
    console.log(`DOB: ${dob.day}/${dob.month}/${dob.year}`);
    console.log(`Address: ${address}`);
    console.log(
      `IssueDate: ${issueDate.day}/${issueDate.month}/${issueDate.year}`
    );
    console.log(`Issuer: ${issuer}`);
    console.log(
      `ExpireDate: ${expireDate.day}/${expireDate.month}/${expireDate.year}`
    );

    // console.log("=============================================");
    // console.log("Receiving Image");
    // const photo = await person.getPhoto();
    // console.log(`Image Saved to ${path.resolve("")}/${cid}.bmp`);
    // console.log("=============================================");
    // const fileStream = fs.createWriteStream(`photo/${cid}.bmp`);
    // const photoBuff = Buffer.from(photo);
    // fileStream.write(photoBuff);
    // fileStream.close();

    currentPerson = {
      cid,
      thPrefix: thName?.prefix,
      thName: thName?.firstname,
      thSurname: thName?.lastname,
      enPrefix: enName?.prefix,
      enName: enName?.firstname,
      enSurname: enName?.lastname,
      dayOfBirth: dob?.day,
      monthOfBirth: dob?.month,
      yearOfBirth: dob?.year,
      address,
    };
  } else {
    currentPerson = {};
  }
});

myReader.on("device-deactivated", () => {
  console.log("device-deactivated");
});

app.get("/pooling", async (req, res) => {
  try {
    console.log("Pooling New");
    console.log("Waiting For Device !");
    res.json(currentPerson);
  } catch (error) {
    res.status(400).json({
      message: error?.message,
    });
  }
});

app.listen(23523, () => {
  console.log("Application is Running on Port 23523");
});
