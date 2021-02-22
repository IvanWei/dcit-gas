var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
var weekNames = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat'];
var currentYear = null;
var currentMonth = null;

function formatDate(date) {
  return (!date)?'---':
    ((date.getMonth() + 1) + '.' + date.getDate() + ' (' + weekNames[date.getDay()] + ')');
}
function createLink(name, link) {
  return (!link)? name:({link: {title: name, source: link}});
}

// eslint-disable-next-line  no-unused-vars
var transfer = {
  md: function(sheetData) {
    var result = [];
    var rowTables = [];

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
            result.push([
              status, title, flag, c4sStartTime, c4sEndTime, location, oversea, link,
              c4sSource, ticketStartTime, ticketEndTime, true,
            ]);
          }

          return result;
        }, [])
        .filter(function(data) {
          var thisYear = (new Date()).getFullYear();
          // eslint-disable-next-line  no-unused-vars
          var [status, title, flag, startDate, endDate,
            // eslint-disable-next-line  no-unused-vars
            location, oversea, link,
            // eslint-disable-next-line  no-unused-vars
            ticketSource, ticketStartTime, ticketEndTime,
            // eslint-disable-next-line  no-unused-vars
            c4sSource, c4sStartTime, c4sEndTime,
          ] = data;

          return (
            (new Date(endDate).getFullYear() >= thisYear &&
              (new Date(endDate).getMonth() >= new Date().getMonth())
            )
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

          var isDiffYear = ((currentYear === null) ||
            (currentYear !== new Date(startDate).getFullYear()));
          var isDiffMonth = ((currentMonth === null) ||
            (currentMonth !== new Date(startDate).getMonth()));

          if (isDiffYear) {
            currentYear = new Date(startDate).getFullYear();
            result.push({'h1': 'Developer Conferences in Taiwan ' +
              new Date(startDate).getFullYear()});
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
              'Venue': createLink(((oversea?'🛫':'🛵') + ' ' + location),
                  ('https://maps.google.com/?q=' + encodeURI(location))),
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
              'Venue': createLink(((oversea?'🛫':'🛵') + ' ' + location),
                  ('https://maps.google.com/?q=' + encodeURI(location))),
            });
          }
        });

    return result;
  },
  api: function(sheetData, params) {
    var result = [];

    sheetData
        .reduce(function(currentResult, data) {
          var [status, title, flag, startDate, endDate,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime,
            c4sSource, c4sStartTime, c4sEndTime,
          ] = data;

          if (startDate !== endDate) {
            endDate = new Date(endDate).setDate(new Date(endDate).getDate() + 1);
          }

          if (c4sStartTime !== c4sEndTime) {
            c4sEndTime = new Date(c4sEndTime).setDate(new Date(c4sEndTime).getDate() + 1);
          }

          currentResult.push([
            status, title, flag, startDate, endDate, location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime, false,
          ]);

          if (c4sSource) {
            currentResult.push([
              status, title, flag, c4sStartTime, c4sEndTime, location, oversea, link,
              c4sSource, ticketStartTime, ticketEndTime, true,
            ]);
          }

          return currentResult;
        }, [])
        // .filter(function(data) {
        //   var thisYear = (new Date()).getFullYear();
        //   var thisMonth = (new Date()).getMonth();
        //   // eslint-disable-next-line  no-unused-vars
        //   var [status, title, flag, startDate, endDate,
        //     // eslint-disable-next-line  no-unused-vars
        //     location, oversea, link,
        //     // eslint-disable-next-line  no-unused-vars
        //     ticketSource, ticketStartTime, ticketEndTime,
        //     // eslint-disable-next-line  no-unused-vars
        //     c4sSource, c4sStartTime, c4sEndTime,
        //   ] = data;

    //   if (params.month !== undefined) {
    //     return (new Date(endDate).getFullYear() === thisYear &&
    //       ((new Date(endDate).getMonth() + 1) >= Number(params.month))
    //     );
    //   }

        //   return (new Date(endDate).getFullYear() === thisYear &&
        //     (new Date(endDate).getMonth() >= thisMonth) &&
        //     ((new Date(startDate).getMonth() + 1) <= thisMonth)
        //   );
        // })
        .sort(function(currentValue, nextValue) {
          return (new Date(currentValue[3]).getTime() - new Date(nextValue[3]).getTime());
        })
        .forEach(function(data) {
          // eslint-disable-next-line  no-unused-vars
          var [status, title, flag, startDate, endDate,
            location, oversea, link,
            ticketSource, ticketStartTime, ticketEndTime, isC4s,
          ] = data;

          result.push({
            'startDate': startDate,
            'endDate': endDate,
            'ticketStartTime': ticketStartTime,
            'ticketEndTime': ticketEndTime,
            'flag': flag,
            'name': createLink(((isC4s?'[徵稿] ':'') + title), link),
            'oversea': (oversea?'🛫':'🛵'),
            'ticket': (isC4s?'---':ticketSource),
            'callForSpeaker': (!isC4s?'---':ticketSource),
            'venue': createLink(location, ('https://maps.google.com/?q=' + encodeURI(location))),
          });
        });

    return result;
  },
};
