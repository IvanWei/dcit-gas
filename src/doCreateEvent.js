// eslint-disable-next-line  no-unused-vars
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Event Menu')
      .addItem('Create Event', '⚙️ CreateEventDialog')
      .addToUi();
}

// eslint-disable-next-line  no-unused-vars
function CreateEventDialog() {
  var html = HtmlService.createHtmlOutputFromFile('createEvent');
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Create Event');
}

// eslint-disable-next-line  no-unused-vars
function createEvent(data) {
  // 取得 Spreadsheet
  const sheetId = func.getSheetId();
  const app = SpreadsheetApp.openById(sheetId);
  // 取得 Target Sheet
  const currentSheet = app.getSheets()[0];

  var title = data.title;
  var flag = data.flag;
  var startDate = data.startDate;
  var endDate = data.endDate;
  var location = data.location;
  var oversea = data.oversea;
  var source = data.source;
  var ticketSource = data.ticketSource;
  var ticketStartTime = data.ticketStartTime;
  var ticketEndTime = data.ticketEndTime;
  var callForSpeakerSource = data.callForSpeakerSource;
  var callForSpeakerStartTime = data.callForSpeakerStartTime;
  var callForSpeakerEndTime = data.callForSpeakerEndTime;

  currentSheet.appendRow(['success', title, flag, startDate, endDate, location, oversea,
    source, ticketSource, ticketStartTime, ticketEndTime,
    callForSpeakerSource, callForSpeakerStartTime, callForSpeakerEndTime,
  ]);
}
