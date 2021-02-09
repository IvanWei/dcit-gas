// eslint-disable-next-line  no-unused-vars
var func = {
  getSheetId: function() {
    return PropertiesService.getScriptProperties().getProperty('sheet_id');
  },
  // 取特定 Sheet 的所有內容
  getSheetAllData: function(currentSheet) {
    // 略過的行數 (這裡設 1 ，目的是略過第一行標題)
    var skipRow = 1;

    var startRowPos = 1 + skipRow;
    var startColumnPos = 1;
    var rowFieldCount = currentSheet.getLastRow() - skipRow;
    var columnFieldCount = currentSheet.getLastColumn();

    return currentSheet.getSheetValues(
        startRowPos, startColumnPos, rowFieldCount, columnFieldCount
    ).filter(function(data) {
      var [status] = data;
      return status === 'success';
    });
  },
};

function validatePostActions (action) {
  return (['create'].indexOf(action) > -1);
}

// function validateGetActions (action) {
//   return (['media', 'empower-list', 'empower-details', 'homepage-bm', 'homepage-testimonials'].indexOf(action) > -1);
// }
