export module ESDateHelper {
  export function getPostTimeFormat(time) {
    if (time == '' || time == undefined) return null;
    let timeArr = time.split('/');
    return timeArr[1] + '/' + timeArr[0] + '/' + timeArr[2];
  }
  export function getPostTimeFormatFromDateTime(time) {
    if (time == '' || time == undefined) return null;
    let timeArr = time.split(' ');
    return this.getPostTimeFormat(timeArr[0]) + ' ' + timeArr[1];
  }
  // return: đối tượng Date thỏa mãn output = date + days
  export function addDays(date, days) {
    var temp = new Date(date.valueOf());
    temp.setDate(temp.getDate() + days);

    return temp;
  }

  // return: date string với format yyyy-MM-dd
  export function toDateString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return year
      .toString()
      .concat('-', month > 9 ? month : '0' + month)
      .concat('-', day > 9 ? day : '0' + day);
  }

  // return: date string với format yyyy-MM-dd HH:mm
  export function toShortDateTimeString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return year
      .toString()
      .concat('-', month > 9 ? month : '0' + month)
      .concat('-', (day > 9 ? day : '0' + day).toString())
      .concat(' ', hour > 9 ? hour : '0' + hour)
      .concat(':', minutes > 9 ? minutes : '0' + minutes);
  }

  // return: date string với format yyyy-MM-dd HH:mm:ss
  export function toDateTimeString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return year
      .toString()
      .concat('-', month > 9 ? month : '0' + month)
      .concat('-', (day > 9 ? day : '0' + day).toString())
      .concat(' ', hour > 9 ? hour : '0' + hour)
      .concat(':', minutes > 9 ? minutes : '0' + minutes)
      .concat(':', seconds > 9 ? seconds : '0' + seconds);
  }

  // return: date string với format dd/MM/yyyy
  export function toVietNamDateString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return (day > 9 ? day : '0' + day)
      .toString()
      .concat('/', month > 9 ? month : '0' + month)
      .concat('/', year.toString());
  }

  // return: date string với format dd-MM-yyyy
  export function toVietNamDateString2(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return (day > 9 ? day : '0' + day)
      .toString()
      .concat('-', month > 9 ? month : '0' + month)
      .concat('-', year.toString());
  }

  // return: date string với format dd/MM/yyyy HH:mm:ss
  export function toVietNamDateTimeString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return (day > 9 ? day : '0' + day)
      .toString()
      .concat('/', month > 9 ? month : '0' + month)
      .concat('/', year.toString())
      .concat(' ', hour > 9 ? hour : '0' + hour)
      .concat(':', minutes > 9 ? minutes : '0' + minutes)
      .concat(':', seconds > 9 ? seconds : '0' + seconds);
  }

  // return: giá trị thể hiện phép so sánh: -1 nếu first < second, 0 nếu bằng nhau, 1 nếu first > second
  export function compareDateAndPeriod(
    first_date,
    first_period,
    second_date,
    second_period
  ) {
    try {
      first_date = new Date(first_date);
      second_date = new Date(second_date);
    } catch (err) {
      throw new Error('first_date và second_date không phải Date');
    }

    try {
      first_period = parseInt(first_period);
      second_period = parseInt(second_period);
    } catch (err) {
      throw new Error('first_period và second_period không phải Number');
    }

    var temp = this.compareNumber(
      first_date.getFullYear(),
      second_date.getFullYear()
    );
    if (temp != 0) return temp;

    temp = this.compareNumber(first_date.getMonth(), second_date.getMonth());
    if (temp != 0) return temp;

    temp = this.compareNumber(first_date.getDate(), second_date.getDate());
    if (temp != 0) return temp;

    return this.compareNumber(first_period, second_period);
  }

  // return: giá trị thể hiện phép so sánh: -1 nếu first < second, 0 nếu bằng nhau, 1 nếu first > second
  export function compareNumber(first, second) {
    try {
      first = parseInt(first);
      second = parseInt(second);

      if (first == second) return 0;

      return first < second ? -1 : 1;
    } catch (err) {
      throw new Error('first và second không phải Number');
    }
  }

  // return: đếm số ngày liên tiếp từ ngày bắt đầu đến ngày kết thúc, có tính cả hai ngày đầu chuỗi
  export function countDate(start, end) {
    try {
      start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    } catch (err) {
      throw new Error('start và end không phải Date');
    }

    var sub = end.getTime() - start.getTime();

    if (sub < 0) {
      throw new Error('start không được lớn hơn end');
    }

    return sub / 1000 / 86400 + 1;
  }
}
