// eslint-disable-next-line  no-unused-vars
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var type = params.type || '';
    var sheetId = func.getSheetId();

    // 取得 Spreadsheet
    const app = SpreadsheetApp.openById(sheetId);
    // 取得 Target Sheet
    const sheet = app.getSheets()[0];

    // 取得所有 Activity 資料
    const sheetData = func.getSheetAllData(sheet);

    var result = null;

    switch (type) {
      case 'md':
        result = transfer.md(sheetData);
        break;
      case 'api':
        result = transfer.api(sheetData, (params || {}));
        break;
      default:
        result = [];
    }

    return ContentService.createTextOutput(JSON.stringify({data: result}))
        .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    insertLog('error', e);
  }
}
