function doSort() {
  var sheetId = func.getSheetId();
  const app = SpreadsheetApp.openById(sheetId);
  // 取得 Target Sheet
  const sheet = app.getSheets()[0];

  // 略過的行數 (這裡設 1 ，目的是略過第一行標題)
  const skipRow = 1;
  // 取得最後一欄的欄數與最後一行的行數
  const lastColumn = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  // Sort Data
  const sheetStartPos = String.fromCharCode(65) + (1 + skipRow).toString();
  const sheetEndPos = String.fromCharCode(65 + lastColumn - 1) + lastRow;
  const sheetRange = sheetStartPos + ':' + sheetEndPos;

  sheet.getRange(sheetRange).sort([
    {column: 4},
    {column: 5},
    {column: 6},
    {column: 7}
  ]);
}
