var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
var weekNames = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat'];
var currentYear = 0;
var currentMonth = 0;

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

    return currentSheet.getSheetValues(startRowPos, startColumnPos, rowFieldCount, columnFieldCount);
  },
  // 轉換 Sheet 的 Data 從 Array 轉成預計顯示的 Markdown (json2md) 格式
  transfer: function(sheetData) {
    var result = [];
    var rowTables = [];

    function formatDate(date) {
      return (!date)? '---': ((date.getMonth() + 1) + '.' + date.getDate() + ' (' + weekNames[date.getDay()] + ')');
    }
    function createLink(name, link) {
      return (!link)? name:({link: {title: name, source: link}});
    }

    sheetData.forEach(function(data) {
      var [status, title, flag, year,
           startMonth, startDay,
           endMonth, endDay,
           location, oversea, link,
           ticketSource, ticketStartTime, ticketEndTime,
           //c4s = call for spearker
           c4sSource, c4sStartTime, c4sEndTime
          ] = data;
      var tranFlag = flag && flag.length > 0?flag.split(','):[];

      var triggerPushData = false;
      var ticketTitle = '---';
      var callForSpeakerTitle = '---';

      // 確認活動日期的顯示狀態
      var now = Date.now();
      var startDate = startMonth?new Date(year, (startMonth - 1), startDay):null;
      var endDate = endMonth?new Date(year, (endMonth - 1), endDay):null;
      var startWeekName = startDate?weekNames[startDate.getDay()]:'---';
      var endWeekName = endDate?weekNames[endDate.getDay()]:'---';

      // 售票時間狀態
      if (ticketSource) {
        if (new Date(ticketStartTime).getTime() >= now && new Date(ticketEndTime).getTime() <= now) {
          ticketTitle = 'Register Now';
        }
        else if (new Date(ticketStartTime).getTime() < now) {
          ticketTitle = 'Not Yet Started';
        }
        else if (new Date(ticketEndTime).getTime() > now) {
          ticketTitle = 'End';
        }
      }

      // 講師招募時間狀態
      if (c4sSource) {
        if (new Date(c4sStartTime).getTime() >= now && new Date(c4sEndTime).getTime() <= now) {
          callForSpeakerTitle = 'Link';
        }
        else if (new Date(c4sStartTime).getTime() < now) {
          callForSpeakerTitle = 'Not Yet Started';
        }
        else if (new Date(c4sEndTime).getTime() > now) {
          callForSpeakerTitle = 'End';
        }
      }

      var isDiffYear = ((currentYear === 0) || (currentYear !== year));
      var isDiffMonth = ((currentMonth === 0) || (currentMonth !== startMonth));

      if (isDiffYear) {
        currentYear = year;
        result.push({'h1': 'Developer Conferences in Taiwan ' + year});
      }

      if (isDiffMonth) {
        // 第一次先不清 Data
        if (currentMonth !== 0) {
          rowTables = [];
        }

        currentMonth = startMonth;

        result.push({'h2': (currentMonth?monthNames[currentMonth -1]:'UnKnown')});
        result.push({'table': {
          'headers': ['Start date', 'End date', 'Name','Ticket', 'Call for Speaker', 'Venue'],
          'rows': rowTables
        }});
      }

      rowTables.push({
        'Year': year,
        'Start date': formatDate(startDate),
        'End date': formatDate(endDate),
        'Name': createLink(title, link),
        'Ticket': createLink(ticketTitle, ticketSource),
        'Call for Speaker': createLink(callForSpeakerTitle, c4sSource),
        'Venue': location,
      });
    });

    return result;
  }
}
