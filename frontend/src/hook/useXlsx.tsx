import * as xlsx from "xlsx";

export const excelToJson = (target: any, setJson: any) => {
  try {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(target.files[0]);

    fileReader.onload = function () {
      var fileData = fileReader.result;
      //   // 엑셀 작업 가능하도록 변환
      var wb = xlsx.read(fileData, { type: "binary" });

      var sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기
      var firstSheetName = sheetNameList[0]; // 첫번째 시트명
      var firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트
      const json = xlsx.utils.sheet_to_json(firstSheet);
      setJson(json);
    };
  } catch (error) {
    console.log(error);
    setJson(null);
  }
};
