function insertLog (type, info) {
  var sheet = null;
  var errorMessage = '';

  if (type === 'info') {
    return;
  } else if (type === 'error') {
    if (typeof info === 'string') {
      errorMessage = info;
    } else {
      errorMessage = ('[' + info.fileName + '.js (Line: ' + info.lineNumber + ')] ' + info);
    }
  }

  try {
    // var spreadsheetName = 'LB-O-log-' + currentEnvironment();
    // var fileId = PropertiesService.getScriptProperties().getProperty(spreadsheetName);
    // var spreadsheet = null;

    // if (fileId) {
    //   spreadsheet = SpreadsheetApp.openById(fileId);

    // } else {
    //   var file = DriveApp.searchFiles('title = "' + spreadsheetName + '" and mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    //   spreadsheet = file.hasNext()?SpreadsheetApp.open(file.next()):SpreadsheetApp.create(spreadsheetName);

    //   var fileId = spreadsheet.getId();
    //   PropertiesService.getScriptProperties().setProperty(spreadsheetName, fileId);
    // }

    // sheet = spreadsheet.getSheets()[0];

    // var now = new Date().toString();

    Logger.log('Log ' + type + ': ' + errorMessage);
    // sheet.appendRow([now, type, errorMessage]);

  } catch (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = ('[' + error.fileName + '.js (Line: ' + error.lineNumber + ')] ' + error);
    }

    Logger.log(errorMessage);

    // if (!sheet) {
    //   var file = DriveApp.searchFiles('title = "' + spreadsheetName + '" and mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    //   spreadsheet = file.hasNext()?SpreadsheetApp.open(file.next()):SpreadsheetApp.create(spreadsheetName);

    //   var fileId = spreadsheet.getId();
    //   PropertiesService.getScriptProperties().setProperty(spreadsheetName, fileId);

    //   sheet = spreadsheet.getSheets()[0];
    // }

    // if (sheet) {
    //   sheet.appendRow([new Date().toString(), 'error', errorMessage]);
    // }
  }
}
