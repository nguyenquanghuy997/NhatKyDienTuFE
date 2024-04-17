import { publicDecrypt } from 'crypto';
import { TypeInput, cleaveInputClass } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { v4 as uuidv4 } from 'uuid';

declare var $: any;
export const Configs = {
  airMode: false,
  tabDisable: true,
  disableDragAndDrop: true,
  popover: {
    table: [
      ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
      ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
    ],
    image: [
      ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
      ['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['remove', ['removeMedia']],
    ],
    link: [['link', ['linkDialogShow', 'unlink']]],
    air: [
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
    ],
  },
  height: '50vh',
  uploadImagePath: '/api/upload',
  toolbar: [
    ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
    [
      'font',
      [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'superscript',
        'subscript',
        'clear',
      ],
    ],
    ['fontsize', ['fontname', 'fontsize', 'color']],
    ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
    ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    [
      'customButtons',
      [
        'inputText',
        'numberInput',
        'inputTextarea',
        'datepicker',
        'date',
        'timeHhmm',
        'timeHms',
        'pasteBtn',
      ],
    ],
  ],
  focus: true,
  lang: 'vi-VN',
  // codemirror: {
  //   // mode: 'htmlmixed',
  //   lineNumbers: 'true',
  //   theme: 'monokai',
  // },
  codemirror: {
    mode: 'text/html',
    htmlMode: true,
    lineNumbers: true,
    theme: 'monokai',
  },
  buttons: {
    inputText: inputTextBtn,
    inputTextarea: inputTextareaBtn,
    numberInput: numberBtn,
    date: inputdateBtn,
    timeHhmm: inputTimeHhMmBtn,
    timeHms: inputTimeHhMmSsBtn,
    pasteBtn: pasteInputBtn,
  },
  codeviewFilter: true,
  codeviewFilterRegex:
    /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
  codeviewIframeFilter: true,
  callbacks: {
    onPaste: function (e) {
      var bufferText = (
        (e.originalEvent || e).clipboardData || window['clipboardData']
      ).getData('text/html');
      e.preventDefault();
      var div = $('<div />');
      div.append(bufferText);
      div.find('*').removeAttr('width').css({
        width: 'unset',
        'margin-left': 'unset',
        'margin-right': 'unset',
        'padding-left': 'unset',
        'padding-right': 'right',
      });
      div.find('table').css({ 'min-width': '100%', width: '100%' });
      setTimeout(function () {
        document.execCommand('insertHtml', false, div.html());
      }, 10);
    },
  },
};

function saveToLocalstorage(typeInput) {
  let sel = window.getSelection();
  let range = sel.getRangeAt(0);
  let startNode: any = range.startContainer;
  let endNode: any = range.endContainer;

  if (startNode.nodeType == 3) {
    var startIsText = true;
    var startFlag = startNode.parentNode;
    startNode = startNode.nodeValue;
  } else {
    var startIsText = false;
    var startFlag = startNode;
  }
  if (endNode.nodeType == 3) {
    var endIsText = true;
    var endFlag = endNode.parentNode;
    endNode = endNode.nodeValue;
  } else {
    var endIsText = false;
    var endFlag = endNode;
  }

  let startOffset = range.startOffset;
  let endOffset = range.endOffset;

  let startTagName = startFlag.nodeName;
  let startHTML = startFlag.innerHTML;

  let endTagName = endFlag.nodeName;
  let endHTML = endFlag.innerHTML;

  //you can store this in database and use it
  let rInfo = {
    startNode: startNode,
    startOffset: startOffset,
    startIsText: startIsText,
    startTagName: startTagName,
    startHTML: startHTML,

    endNode: endNode,
    endOffset: endOffset,
    endIsText: endIsText,
    endTagName: endTagName,
    endHTML: endHTML,
  };
  console.log('rInfo=', rInfo);
  Utility.setLocalStorageWithExpiry('selectedText', JSON.stringify(rInfo));
  Utility.setLocalStorageWithExpiry('typeInput', typeInput);
}
let typeInput: string = '';
function inputTextBtn(context: any) {
  const ui = $.summernote.ui;
  const button = ui.button({
    contents: '<i class="note-icon-font"></i> Text Field',
    tooltip: 'Text Input',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = TypeInput.TEXT;
      console.log('typeInput: ', typeInput);
      // Lưu vùng chọn vào localStorage
      saveToLocalstorage(typeInput);
      $('#idInputType').val(typeInput);
      $('#openModalCreate_Test').click();
    },
  });
  return button.render();
}

function numberBtn(context: any) {
  const ui = $.summernote.ui;

  const button = ui.button({
    contents: '<i class="note-icon-hashtag"></i> Number Input',
    tooltip: 'Number Input',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = TypeInput.NUMBER;
      saveToLocalstorage(typeInput);
      $('#idInputType').val(typeInput);
      $('#openModalCreate_Test').click();
    },
  });
  return button.render();
}

function inputTextareaBtn(context: any) {
  const ui = $.summernote.ui;
  const button = ui.button({
    contents: '<i class="note-icon-font"></i>Textarea',
    tooltip: 'Textarea',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = 'Textarea';
      saveToLocalstorage(typeInput);
      $('#idInputType').val('Textarea');
      $('#openModalCreate_Test').click();
      $('#clickStatus').click();
    },
  });
  return button.render();
}

function inputdateBtn(context: any) {
  const ui = $.summernote.ui;

  const button = ui.button({
    contents: '<i class="icon-calendar"></i> Date',
    tooltip: 'Date dd/mm/yyyy',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = TypeInput.DATE;
      saveToLocalstorage(typeInput);
      $('#idInputType').val(typeInput);
      $('#openModalCreate_Test').click();
    },
  });
  return button.render();
}

function inputTimeHhMmBtn(context: any) {
  const ui = $.summernote.ui;

  const button = ui.button({
    contents: '<i class="icon-calendar"></i> Time HH:mm',
    tooltip: 'Time format HH:mm',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = TypeInput.TIME_HH_MM;
      saveToLocalstorage(typeInput);
      $('#idInputType').val(typeInput);
      $('#openModalCreate_Test').click();
    },
  });
  return button.render();
}

function inputTimeHhMmSsBtn(context: any) {
  const ui = $.summernote.ui;

  const button = ui.button({
    contents: '<i class="icon-calendar"></i> Time HH:mm:ss',
    tooltip: 'Time format HH:mm:ss',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.pasteHTML', '&nbsp;&nbsp;');
      typeInput = TypeInput.TIME_HH_MM_SS;
      saveToLocalstorage(typeInput);
      $('#idInputType').val(typeInput);
      $('#openModalCreate_Test').click();
    },
  });
  return button.render();
}

function pasteInputBtn(context: any) {
  const ui = $.summernote.ui;

  const button = ui.button({
    contents: '<i class="icon-paste"></i> Paste',
    tooltip: 'Paste',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      let jsonStrGet = Utility.getLocalStorageWithExpiry('formInput');
      if (jsonStrGet == null || jsonStrGet == '') {
        $('#btn_showError_onPaste').click();
        return;
      }
      let formInput = JSON.parse(jsonStrGet);
      let typeInput = formInput.typeInput;
      let uuid = uuidv4();
      let htmlToInsert = '';
      if (formInput.Placeholder == null) formInput.Placeholder = '';
      switch (typeInput) {
        case TypeInput.TEXT:
          htmlToInsert = `<input class="form-control ${cleaveInputClass.TEXT}" id="input-${uuid}" name="fieldText-${uuid}" data-key="input-${uuid}" data-tag="${formInput.TagCode}"`;
          htmlToInsert += `placeholder="${formInput.Placeholder}"`;
          if (formInput.minValue > 0) {
            htmlToInsert += ` minlength="${formInput.minValue}"`;
          }
          if (formInput.maxValue > 0) {
            htmlToInsert += ` maxlength="${formInput.maxValue}"`;
          }
          if (formInput.Width > 0) {
            htmlToInsert += `style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += `style="min-width: 100px; width:100%"`;
          }
          break;
        case TypeInput.TEXTAREA:
          htmlToInsert = `<textarea class="form-control"
        id="input-${uuid}" name="textarea-${uuid}" data-key="input-${uuid}" data-tag="${formInput.TagCode}" placeholder="${formInput.Placeholder}"`;
          if (formInput.minValue > 0) {
            htmlToInsert += ` minlength="${formInput.minValue}"`;
          }
          if (formInput.maxValue > 0) {
            htmlToInsert += ` maxlength="${formInput.maxValue}"`;
          }
          if (formInput.Rows > 0) {
            htmlToInsert += ` rows="${formInput.Rows}"`;
          }
          if (formInput.Width > 0) {
            htmlToInsert += ` style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
          }
          break;
        case TypeInput.DATE:
          var placeholder = (formInput.Placeholder = ''
            ? formInput.Placeholder
            : 'dd/mm/yyyy');
          htmlToInsert = `<input class="form-control ${cleaveInputClass.DATE}" id="input-${uuid}" name="dateTime-${uuid}"`;
          htmlToInsert += ` data-key="input-${uuid}" data-tag="${formInput.TagCode}" placeholder="${placeholder}"`;
          if (formInput.Width > 0) {
            htmlToInsert += ` style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
          }
          break;
        case TypeInput.TIME_HH_MM:
          var placeholder = (formInput.Placeholder = ''
            ? formInput.Placeholder
            : 'HH:mm');
          htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM}" id="input-${uuid}" name="dateTime-${uuid}"`;
          htmlToInsert += ` data-key="input-${uuid}" data-tag="${formInput.TagCode}" placeholder="${placeholder}"`;
          if (formInput.Width > 0) {
            htmlToInsert += ` style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
          }
          break;
        case TypeInput.TIME_HH_MM_SS:
          var placeholder = (formInput.Placeholder = ''
            ? formInput.Placeholder
            : 'HH:mm:ss');
          htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM_SS}" id="input-${uuid}" name="dateTime-${uuid}"`;
          htmlToInsert += ` data-key="input-${uuid}" data-tag="${formInput.TagCode}" placeholder="${placeholder}"`;
          if (formInput.Width > 0) {
            htmlToInsert += ` style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
          }
          break;
        case TypeInput.NUMBER:
          var placeholder = (formInput.Placeholder = ''
            ? formInput.Placeholder
            : 'Nhập số');
          htmlToInsert = `<input class="form-control ${cleaveInputClass.NUMBER}" id="input-${uuid}" name="numberInput-${uuid}" id="input-${uuid}"`;
          htmlToInsert += ` data-key="input-${uuid}" data-tag="${formInput.TagCode}" placeholder="${placeholder}"`;
          htmlToInsert += ` min="${formInput.minValue}" `;
          htmlToInsert += ` max="${formInput.maxValue}" `;
          htmlToInsert += ` data-minblock="${formInput.MinBlocking}"  data-maxblock="${formInput.MaxBlocking}"`;
          htmlToInsert += ` data-minwarn="${formInput.MinWarning}"  data-maxwarn="${formInput.MaxWarning}"`;
          if (formInput.Width > 0) {
            htmlToInsert += ` style="min-width: 100px; width:${formInput.Width}${formInput.DonViTinh}"`;
          } else {
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
          }
      }
      if (formInput.EquipmentId > 0) {
        htmlToInsert += ` data-equipmentid="${formInput.EquipmentId}"  data-equipmenttagid="${formInput.EquipmentTagId}"`;
        htmlToInsert += ` data-equipmentname="${formInput.EquipmentName}"  data-equipmenttagname="${formInput.EquipmentTagName}"`;
        htmlToInsert += ` data-equipmentcode="${formInput.EquipmentCode}"`;
      }
      if (formInput.OrganizationId > 0) {
        htmlToInsert += ` data-organizationid="${formInput.OrganizationId}"`;
      }
      if (formInput.TagId > 0) {
        htmlToInsert += ` data-tagid="${formInput.TagId}"`;
      }
      htmlToInsert += `/>`;
      context.invoke('editor.pasteHTML', '<p></p>');
      if (typeInput == 'Textarea') {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const newElem = document.createElement('span');
        newElem.innerHTML = htmlToInsert;
        range.insertNode(newElem);
        range.setStartBefore(newElem);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else context.invoke('editor.pasteHTML', htmlToInsert);
      var content = $('#summernote').summernote('code');
      var markupStr = content.replace('&nbsp;&nbsp;', '');
      markupStr = markupStr.replace('<br>', '');
      $('#summernote').summernote('code', markupStr);
    },
  });
  return button.render();
}

export const sliderConfig: any = {
  connect: 'lower',
  start: 0,
  range: {
    min: 0,
    max: 5,
  },
  pips: {
    mode: 'values',
    values: [0, 1, 2, 3, 4, 5],
    density: 20,
    format: {
      to: function (value) {
        return [
          'Chọn file',
          'Tạo mã Html',
          'Xóa style tự sinh',
          'Tạo thẻ input tự động',
          'Xem trước',
          'Cấu hình thẻ input',
        ][+value];
      },
    },
  },
};
