// eslint-disable-next-line no-unused-vars
function insertLog(type, info) {
  // var sheet = null;
  var errorMessage = '';

  if (type === 'info') {
    return;
  } else if (type === 'error') {
    if (typeof info === 'string') {
      errorMessage = info;
    } else {
      var fileName = info.fileName;
      var lineNumber = info.lineNumber;

      errorMessage = '[' + fileName + '.js (Line: ' + lineNumber + ')] ' + info;
    }
  }

  try {
    // var spreadsheetName = 'LB-O-log-' + currentEnvironment();

    // eslint-disable-next-line max-len
    // var fileId = PropertiesService.getScriptProperties().getProperty(spreadsheetName);
    // var spreadsheet = null;

    // if (fileId) {
    //   spreadsheet = SpreadsheetApp.openById(fileId);

    // } else {

    // eslint-disable-next-line max-len
    //   var file = DriveApp.searchFiles('title = "' + spreadsheetName + '" and mimeType = "' + MimeType.GOOGLE_SHEETS + '"');

    // eslint-disable-next-line max-len
    //   spreadsheet = file.hasNext()?SpreadsheetApp.open(file.next()):SpreadsheetApp.create(spreadsheetName);

    //   var fileId = spreadsheet.getId();
    //   PropertiesService.getScriptProperties().setProperty(spreadsheetName, fileId);
    // }

    // sheet = spreadsheet.getSheets()[0];

    // var now = new Date().toString();

    // eslint-disable-next-line no-undef
    Logger.log('Log ' + type + ': ' + errorMessage);
    // sheet.appendRow([now, type, errorMessage]);
  } catch (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else {
      var errFileName = error.fileName;
      var errLineNumber = error.lineNumber;

      errorMessage = ('[' + errFileName + '.js (Line: ' + errLineNumber + ')] ' + error);
    }

    // eslint-disable-next-line no-undef
    Logger.log(errorMessage);

    // if (!sheet) {
    // eslint-disable-next-line max-len
    //   var file = DriveApp.searchFiles('title = "' + spreadsheetName + '" and mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    // eslint-disable-next-line max-len
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
