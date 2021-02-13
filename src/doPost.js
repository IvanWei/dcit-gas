// eslint-disable-next-line  no-unused-vars
function doPost(e) {
  try {
    // 取得 Spreadsheet
    const sheetId = func.getSheetId();
    const app = SpreadsheetApp.openById(sheetId);
    // 取得 Target Sheet
    const currentSheet = app.getSheets()[0];

    const params = (e && e.parameter) || {};
    const action = params.action;
    var response = null;

    if (!func.validatePostActions(action)) {
      throw new Error('[Post] Action(' + action + ') is invalid.');
    }

    switch (action) {
      case 'create':
        const title = params.title;
        const flag = params.flag;
        const startDate = params.startDate;
        const endDate = params.endDate;
        const location = params.location;
        const oversea = params.oversea;
        const source = params.source;
        const ticketSource = params.ticketSource;
        const ticketStartTime = params.ticketStartTime;
        const ticketEndTime = params.ticketEndTime;
        const callForSpeakerSource = params.callForSpeakerSource;
        const callForSpeakerStartTime = params.callForSpeakerStartTime;
        const callForSpeakerEndTime = params.callForSpeakerEndTime;

        // insertLog('info', 'Insert the new row (' + prefixSpreadsheetName + 'create)');
        currentSheet.appendRow(['success', title, flag, startDate, endDate, location, oversea,
          source, ticketSource, ticketStartTime, ticketEndTime,
          callForSpeakerSource, callForSpeakerStartTime, callForSpeakerEndTime,
        ]);

        break;
      case 'edit':


      // case 'update-caches':
      //   var addCronJob = params.addCronJob || 'false';

      //   refreshAllCaches();

      //   var triggers = ScriptApp.getProjectTriggers();
      //   triggers.forEach(function(trigger) {
      //     ScriptApp.deleteTrigger(trigger);
      //   });

      //   if (addCronJob === 'true') {
      //     ScriptApp.newTrigger('refreshAllCaches')
      //       .timeBased()
      //       .everyHours(4)
      //       .create();
      //   }

      //   break;
    }

    return ContentService
        .createTextOutput(JSON.stringify({data: response}))
        .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    insertLog('error', error);

    return ContentService
        .createTextOutput(JSON.stringify({error: (error || new Error('Unknown Error'))}))
        .setMimeType(ContentService.MimeType.JSON);
  }
}
