function doPost(e) {
  try {
    // 取得 Spreadsheet
    const app = SpreadsheetApp.openById(sheetId);
    // 取得 Target Sheet
    const currentSheet = app.getSheets()[0];

    var params = (e && e.parameter) || {};
    var action = params.action;


    if (!validatePostActions(action)) {
      throw '[Post] Action(' + action + ') is invalid.';
    }

    switch (action) {
      case 'create':
        var title = params.title;
        var flag = params.flag;
        var startDate = params.startDate;
        var endDate = params.endDate;
        var location = params.location;
        var oversea = params.oversea;
        var source = params.source;
        var source = params.ticketSource;
        var source = params.ticketStartTime;
        var source = params.ticketEndTime;
        var source = params.callForSpeakerSource;
        var source = params.callForSpeakerStartTime;
        var source = params.callForSpeakerEndTime;

        // insertLog('info', 'Insert the new row (' + prefixSpreadsheetName + 'create)');
        currentSheet.appendRow(['success', title, flag, startDate, endDate, location, oversea,
          source, ticketSource, ticketStartTime, ticketEndTime,
          callForSpeakerSource, callForSpeakerStartTime, callForSpeakerEndTime,
        ]);

        break;

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
      .createTextOutput(JSON.stringify({data: null}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    insertLog('error', error);

    return ContentService
      .createTextOutput(JSON.stringify({ error: (error || new Error('Unknown Error')) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
