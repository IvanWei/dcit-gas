function doGet(e) {
  try {
    var sheetId = func.getSheetId();

    // 取得 Spreadsheet
    const app = SpreadsheetApp.openById(sheetId);
    // 取得 Target Sheet
    const sheet = app.getSheets()[0];

    // 取得所有 Activity 資料
    const sheetData = func.getSheetAllData(sheet);
    const newSheetData = sheetData.filter(function(data) {
      const [status] = data;
      return status === 'success';
    });

    const result = func.transfer(newSheetData);

    return ContentService.createTextOutput(JSON.stringify({data: result}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    Logger.log(e);
  }
}