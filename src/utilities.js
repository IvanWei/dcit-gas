var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
var weekNames = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat'];
var currentYear = null;
var currentMonth = null;

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
  // 轉換 Sheet 的 Data 從 Array 轉成預計顯示的 Markdown (json2md) 格式
  transfer: function(sheetData) {
    var result = [];
    var rowTables = [];

    function formatDate(date) {
      return (!date)?'---':
        ((date.getMonth() + 1) + '.' + date.getDate() + ' (' + weekNames[date.getDay()] + ')');
    }
    function createLink(name, link) {
      return (!link)? name:({link: {title: name, source: link}});
    }

    sheetData
        .reduce(function(result, data) {
          var [status, title, flag, startDate, endDate,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime,
            c4sSource, c4sStartTime, c4sEndTime,
          ] = data;

          result.push([
            status, title, flag, startDate, endDate, location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime, false,
          ]);

          if (c4sSource) {
            var currentStartDate = new Date(c4sStartTime);
            var currentEndDate = new Date(c4sEndTime);
            var currentYear = currentStartDate.getFullYear();
            var currentStartMonth = currentStartDate.getMonth() + 1;
            var currentStartdate = currentStartDate.getDate();
            var currentEndMonth = currentEndDate.getMonth() + 1;
            var currentEnddate = currentEndDate.getDate();

            result.push([
              status, title, flag, currentYear, currentStartMonth, currentStartdate,
              currentEndMonth, currentEnddate, location, oversea, link,
              c4sSource, ticketStartTime, ticketEndTime, true,
            ]);
          }

          return result;
        }, [])
        .filter(function (data) {
          var thisYear = (new Date()).getFullYear();
          var [status, title, flag, startDate, endDate,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime,
            c4sSource, c4sStartTime, c4sEndTime,
          ] = data;

          return (
            (new Date(startDate).getFullYear() >= thisYear
              && (new Date(startDate).getMonth() >= new Date().getMonth())
              && (new Date(endDate).getDate() <= new Date().getDate())
            )
            || new Date(c4sStartTime).getFullYear() >= thisYear
            );
        })
        .sort(function(currentValue, nextValue) {
          return (new Date(currentValue[3]).getTime() - new Date(nextValue[3]).getTime());
        })
        .forEach(function(data) {
          // eslint-disable-next-line  no-unused-vars
          var [status, title, flag, startDate, endDate,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime, isC4s,
          ] = data;
          // var tranFlag = flag && flag.length > 0?flag.split(','):[];

          var ticketTitle = '---';

          // 確認活動日期的顯示狀態
          var now = Date.now();
          var oneDay = 1000 * 60 * 60 * 24;
          startDate = startDate?new Date(startDate):null;
          endDate = endDate?new Date(endDate):null;

          // 售票時間狀態
          if (ticketSource) {
            var thisStartTime = !isC4s?ticketStartTime:startDate;
            var thisEndTime = !isC4s?ticketEndTime:endDate;

            if (now >= new Date(thisStartTime).getTime() &&
            now <= (new Date(thisEndTime).getTime() + oneDay)
            ) {
              ticketTitle = 'Register Now';
            } else if (now < new Date(thisStartTime).getTime()) {
              ticketTitle = 'Not Yet Started';
            } else if (now > (new Date(thisEndTime).getTime() + oneDay)) {
              ticketTitle = 'End';
            }
          }

          var isDiffYear = ((currentYear === null) || (currentYear !== new Date(startDate).getFullYear()));
          var isDiffMonth = ((currentMonth === null) || (currentMonth !== new Date(startDate).getMonth()));

          if (isDiffYear) {
            currentYear = new Date(startDate).getFullYear();
            result.push({'h1': 'Developer Conferences in Taiwan ' + new Date(startDate).getFullYear()});
          }

          if (isDiffMonth) {
            // 第一次先不清 Data
            if (currentMonth !== null) {
              rowTables = [];
            }

            currentMonth = new Date(startDate).getMonth();

            result.push({'h2': (currentMonth !== null?monthNames[currentMonth]:'UnKnown')});
            result.push({'table': {
              'headers': ['Start date', 'End date', 'Name', 'Oversea',
                'Ticket', 'Call for Speaker', 'Venue',
              ],
              'rows': rowTables,
            }});
          }

          if (!isC4s) {
            rowTables.push({
              'Year': new Date(startDate).getFullYear(),
              'Start date': formatDate(startDate),
              'End date': formatDate(endDate),
              'Name': createLink(title, link),
              'Oversea': (oversea?'🛫':'🛵'),
              'Ticket': createLink(ticketTitle, ticketSource),
              'Call for Speaker': '---',
              'Venue': createLink(((oversea?'🛫':'🛵') + ' ' + location), ('https://maps.google.com/?q=' + encodeURI(location))),
            });
          } else {
            // 講師招募時間狀態
            rowTables.push({
              'Year': new Date(startDate).getFullYear(),
              'Start date': formatDate(startDate),
              'End date': formatDate(endDate),
              'Name': createLink(('[徵稿] ' + title), link),
              'Oversea': (oversea?'🛫':'🛵'),
              'Ticket': '---',
              'Call for Speaker': createLink(ticketTitle, ticketSource),
              'Venue': createLink(((oversea?'🛫':'🛵') + ' ' + location), ('https://maps.google.com/?q=' + encodeURI(location))),
            });
          }
        });

    return result;
  },
  transferApi: function(sheetData) {
    var result = [];
    var rowTables = [];

    sheetData
        .reduce(function(result, data) {
          var [status, title, flag, year,
            startMonth, startDay,
            endMonth, endDay,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime,
            c4sSource, c4sStartTime, c4sEndTime,
          ] = data;

          result.push([
            status, title, flag, year, startMonth, startDay,
            endMonth, endDay, location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime,
          ]);

          if (c4sSource) {
            var currentStartDate = new Date(c4sStartTime);
            var currentEndDate = new Date(c4sEndTime);
            var currentYear = currentStartDate.getFullYear();
            var currentStartMonth = currentStartDate.getMonth() + 1;
            var currentStartdate = currentStartDate.getDate();
            var currentEndMonth = currentEndDate.getMonth() + 1;
            var currentEnddate = currentEndDate.getDate();

            result.push([
              status, title, flag, currentYear, currentStartMonth, currentStartdate,
              currentEndMonth, currentEnddate, location, oversea, link,
              c4sSource, ticketStartTime, ticketEndTime,
            ]);
          }

          return result;
        }, [])
        .sort(function(currentValue, nextValue) {
          return (new Date(currentValue[3], (currentValue[4] - 1), currentValue[5]) -
                  new Date(nextValue[3], (nextValue[4] - 1), nextValue[5]));
        });

    return result;
  },
};
