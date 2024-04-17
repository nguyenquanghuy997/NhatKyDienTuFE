import moment from 'moment';
import { TypeInput, cleaveInputClass } from './Enum';

export module Utility {
  // 1 ngày
  var totalMiliseconds1Day = 24 * 60 * 60 * 1000;

  // https://www.sohamkamani.com/javascript/localstorage-with-ttl-expiry/
  export function setLocalStorageWithExpiry(
    key,
    value,
    ttl = totalMiliseconds1Day
  ) {
    // ttl: Time to live, miliseconds

    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  // https://www.sohamkamani.com/javascript/localstorage-with-ttl-expiry/
  export function getLocalStorageWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);

    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  export function removeVietnameseTones(str) {
    if (!str) return str;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt, ngoại trừ ký tự "_", "-"
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|`|{|}|\||\\/g,
      ' '
    );
    return str;
  }

  export function getTypeInput(identity: string, id: string): string {
    let tagName = $(`#${id} #${identity}`).prop('tagName');
    let type = $(`#${id} #${identity}`).prop('type');
    var classList = $(`#${id} #${identity}`).attr('class').split(/\s+/);
    if (tagName === 'TEXTAREA') {
      return TypeInput.TEXTAREA;
    } else if (tagName === 'SELECT') {
      return TypeInput.SELECT;
    } else if (type === 'checkbox') {
      return TypeInput.CHECKBOX;
    } else {
      let type = '';
      classList.forEach((item) => {
        switch (item) {
          case cleaveInputClass.TEXT:
            return (type = TypeInput.TEXT);
          case cleaveInputClass.NUMBER:
            return (type = TypeInput.NUMBER);
          case cleaveInputClass.DATE:
            return (type = TypeInput.DATE);
          case cleaveInputClass.DATEPICKER:
            return (type = TypeInput.DATEPICKER);
          case cleaveInputClass.TIME_HH_MM:
            return (type = TypeInput.TIME_HH_MM);
          case cleaveInputClass.TIME_HH_MM_SS:
            return (type = TypeInput.TIME_HH_MM_SS);
          default:
            break;
        }
      });
      return type;
    }
  }

  export function getValueOptionSelect(identity: string, id: string): any[] {
    let options = $(`#${id} #${identity}`).find('option');
    let values = [];
    options.each(function () {
      if ($(this).attr('value')) values.push($(this).attr('value'));
    });
    return values;
  }

  export function renderValueOptionSelect(arr): [] {
    let values = [];
    arr.forEach((item) => {
      values.push(item.label ? item.label : item);
    });
    return values as [];
  }

  export function isTrue(str) {
    if (
      str != null &&
      str != undefined &&
      str.toString().toLowerCase() === 'true'
    )
      return true;
    return false;
  }

  export const fncOffsetTimeUtc = (strDate: string): string => {
    if (strDate == null || strDate == '') return '';
    const currentDate = new Date();
    var timeOffset = currentDate.getTimezoneOffset();
    let dateOffsetUtc = moment(strDate, 'YYYY-MM-DD HH:mm:ss')
      .utcOffset(+`${Math.abs(timeOffset)}`)
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    return dateOffsetUtc;
  };

  export const fnccheckTime = (timeInput, flag) => {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const timeRegexHms = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const dateTimeRegex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    if (flag == 1) return timeRegex.test(timeInput);
    else if (flag == 2) return timeRegexHms.test(timeInput);
    else if (flag == 3) return dateTimeRegex.test(timeInput);
  };
}
