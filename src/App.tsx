import { useState } from "react";
import "./App.css";
import {
  doSubmitForm,
  getSignedUrl,
  getStudentDetailsById,
  putFileToS3,
} from "./actions";

const convertFileToBase64Async = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    convertFileToBase64(file, (data) => {
      resolve(data);
    });
  });
};

const convertFileToBase64 = (
  file: File,
  callback: (data: any) => void
): void => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      const base64Data = reader.result.split(",")[1];
      const mimeType = reader.result.split(",")[0].split(":")[1].split(";")[0];
      const base64DataURI = `data:${mimeType};base64,${base64Data}`;
      const data = {
        base64DataURI,
        mimeType,
      };
      callback(data);
    }
  };
  reader.readAsDataURL(file);
};
function App() {
  const [studentData, setStudentData] = useState<any>({});
  const [passportNo, setPassportNo] = useState<string>("");
  const [fetchedStudentData, setFetchedStudentData] = useState<any>({});
  const handleChangeFile = async (event: any) => {
    const fileList = event?.target?.files;
    if (fileList.length > 0) {
      const uploadedFileResponse = await getSignedUrl(fileList[0]?.type);
      const signedURLObject = JSON.parse(uploadedFileResponse["data"]["body"]);
      console.log({ signedURLObject });
      const s3Response = await putFileToS3(
        signedURLObject["uploadURL"],
        fileList[0],
        fileList[0]?.type
      );
      console.log({ s3Response });
      setStudentData({
        ...studentData,
        fileName: signedURLObject["photoFilename"],
      });
    }
  };
  const handleChangeDocumentType = (event: any) => {
    const value = event?.target.value;
    setStudentData({ ...studentData, documentType: value });
  };
  const handleChangeBoardType = (event: any) => {
    const value = event?.target.value;
    setStudentData({ ...studentData, board: value });
  };
  const handleClickEvent = async () => {
    const prepareBody = { ...studentData };
    prepareBody.flowSelected = "call-to-ocr";
    const response = await doSubmitForm(prepareBody);
    console.log({ response });
  };
  const handleGetData = async () => {
    if (passportNo.length === 0) {
      alert("Passport number required.");
      return;
    }
    const studentResponse = await getStudentDetailsById(passportNo);
    setFetchedStudentData(studentResponse);
  };
  return (
    <div className="App">
      <h1>Demo For What's app flow</h1>
      <p>
        Consider this UI as a what's app UI just considering primary case not
        content.
      </p>
      <form action="" method="post">
        <div>
          <input type="file" name="file" onChange={handleChangeFile} />
        </div>
        <div>
          <select onChange={handleChangeDocumentType}>
            <option value="passport">passport</option>
            <option value="ielts">ielts</option>
            <option value="pte">pte</option>
            <option value="marksheet">marksheet</option>
          </select>
        </div>
        <div>
          <select
            disabled={studentData?.documentType !== "marksheet" ? true : false}
            onChange={handleChangeBoardType}
          >
            <option value="PUNJAB">PUNJAB</option>
            <option value="RAJASTHAN">RAJASTHAN</option>
          </select>
        </div>
        <input
          type="text"
          onChange={(event) =>
            setStudentData({ ...studentData, studentId: event?.target?.value })
          }
        />
        <button type="button" onClick={handleClickEvent}>
          Submit
        </button>
      </form>
      <hr />
      <div>
        <label htmlFor="">Enter PassportNo:</label>
        <input
          type="text"
          onChange={(event) => setPassportNo(event.target.value)}
        />
      </div>
      <button type="button" onClick={handleGetData}>
        Get Data
      </button>
      {Object.keys(fetchedStudentData).length > 0 ? (
        <>
          <h3>Personal Info</h3>
          <table border={1}>
            <tr>
              <th>passportNo</th>
              <th>placeOfIssue</th>
              <th>placeOfBirth</th>
              <th>countryCode</th>
              <th>surname</th>
              <th>sex</th>
              <th>name</th>
              <th>dateOfBirth</th>
              <th>dateOfIssue</th>
            </tr>
            <tr>
              <td>{fetchedStudentData?.studentPersonalInfo?.passportNo}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.placeOfIssue}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.placeOfBirth}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.countryCode}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.surname}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.sex}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.name}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.dateOfBirth}</td>
              <td>{fetchedStudentData?.studentPersonalInfo?.dateOfIssue}</td>
            </tr>
          </table>
          <h3>Marksheet - BOARD - {fetchedStudentData?.studentBoardType}</h3>

          <table border={1}>
            <tr>
              <th>Subject</th>
              <th>marksObtained</th>
              <th>totalMarks</th>
            </tr>
            {fetchedStudentData?.studentMarksheetInfo?.map(
              (marksheetRow: any, marksheetIndex: number) => {
                return (
                  <tr key={marksheetIndex}>
                    <td>{marksheetRow?.subject}</td>
                    <td>{marksheetRow?.marksObtained}</td>
                    <td>{marksheetRow?.totalMarks}</td>
                  </tr>
                );
              }
            )}
          </table>
          {fetchedStudentData?.englishProficiencyTestsType === "pte" ? (
            <div>
              <h3>PTE data</h3>
              <table border={1}>
                <tr>
                  <th>testCentreId</th>
                  <th>testTakerId</th>
                  <th>regId</th>
                  <th>testDate</th>
                  <th>gender</th>
                  <th>dateOfBirth</th>
                  <th>testCentreCountry</th>
                  <th>countryOfCitizenship</th>
                  <th>firstTimeTestTaker</th>
                  <th>countryOfResidence</th>
                  <th>reportIssueDate</th>
                  <th>scoreReportCode</th>
                  <th>validUntil</th>
                </tr>
                <tr>
                  <td>{fetchedStudentData?.pteInfo?.testCentreId}</td>
                  <td>{fetchedStudentData?.pteInfo?.testTakerId}</td>
                  <td>{fetchedStudentData?.pteInfo?.regId}</td>
                  <td>{fetchedStudentData?.pteInfo?.testDate}</td>
                  <td>{fetchedStudentData?.pteInfo?.gender}</td>
                  <td> {fetchedStudentData?.pteInfo?.dateOfBirth}</td>
                  <td>{fetchedStudentData?.pteInfo?.testCentreCountry}</td>
                  <td>{fetchedStudentData?.pteInfo?.countryOfCitizenship}</td>
                  <td>{fetchedStudentData?.pteInfo?.firstTimeTestTaker}</td>
                  <td>{fetchedStudentData?.pteInfo?.countryOfResidence}</td>
                  <td>{fetchedStudentData?.pteInfo?.reportIssueDate}</td>
                  <td>{fetchedStudentData?.pteInfo?.scoreReportCode}</td>
                  <td>{fetchedStudentData?.pteInfo?.validUntil}</td>
                </tr>
              </table>
              <br />
              <table border={1}>
                <tr>
                  <th>writtenDiscourse</th>
                  <th>oralFluency</th>
                  <th>speaking</th>
                  <th>vocabulary</th>
                  <th>writing</th>
                  <th>listening</th>
                  <th>pronunciation</th>
                  <th>spelling</th>
                  <th>reading</th>
                </tr>
                <tr>
                  <td>{fetchedStudentData?.pteInfo?.writtenDiscourse}</td>
                  <td>{fetchedStudentData?.pteInfo?.oralFluency}</td>
                  <td>{fetchedStudentData?.pteInfo?.speaking}</td>
                  <td>{fetchedStudentData?.pteInfo?.vocabulary}</td>
                  <td>{fetchedStudentData?.pteInfo?.writing}</td>
                  <td>{fetchedStudentData?.pteInfo?.listening}</td>
                  <td>{fetchedStudentData?.pteInfo?.pronunciation}</td>
                  <td>{fetchedStudentData?.pteInfo?.spelling}</td>
                  <td>{fetchedStudentData?.pteInfo?.reading}</td>
                </tr>
              </table>
            </div>
          ) : (
            <div>
              <h3>IELTS data</h3>
              <table border={1}>
                <tr>
                  <th>firstName</th>
                  <th>familyName</th>
                  <th>firstLanguage</th>
                  <th>sex</th>
                  <th>cidateId</th>
                  <th>schemeCode</th>
                  <th>centreNumber</th>
                  <th>testReportFormNumber</th>
                  <th>testReportForm</th>
                  <th>cefrLevel</th>
                  <th>cidateNumber</th>
                </tr>
                <tr>
                  <td>{fetchedStudentData?.ieltsInfo?.firstName}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.familyName}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.firstLanguage}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.sexMf}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.cidateId}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.schemeCode}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.centreNumber}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.testReportFormNumber}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.testReportForm}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.cefrLevel}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.cidateNumber}</td>
                </tr>
              </table>
              <br />
              <table border={1}>
                <tr>
                  <th>listening</th>
                  <th>reading</th>
                  <th>writing</th>
                  <th>speaking</th>
                  <th>band</th>
                </tr>
                <tr>
                  <td>{fetchedStudentData?.ieltsInfo?.listening}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.reading}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.writing}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.speaking}</td>
                  <td>{fetchedStudentData?.ieltsInfo?.b}</td>
                </tr>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default App;
