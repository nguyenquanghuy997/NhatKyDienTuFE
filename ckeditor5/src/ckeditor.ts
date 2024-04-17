/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Autosave } from '@ckeditor/ckeditor5-autosave';
import {
  Bold,
  Code,
  Italic,
  Subscript,
  Superscript,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import {
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
} from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { List, TodoList } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
import { ShowBlocks } from '@ckeditor/ckeditor5-show-blocks';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Style } from '@ckeditor/ckeditor5-style';
import {
  Table,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableSelection,
  TableToolbar,
} from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import {
  CheckboxField,
  DateField,
  InsertElementRange,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
  TimeHHMMField,
  TimeHHMMSSField,
} from './pluginCustom';
// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    TodoList,
    TableSelection,
    Alignment,
    AutoImage,
    Autoformat,
    Autosave,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    CloudServices,
    Code,
    CodeBlock,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    List,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    ShowBlocks,
    SourceEditing,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    TextField,
    NumberField,
    TextAreaField,
    DateField,
    TimeHHMMField,
    TimeHHMMSSField,
    SelectField,
    CheckboxField,
    InsertElementRange,
  ];

  public static override defaultConfig = {
    toolbar: {
      items: [
        'sourceEditing',
        'heading',
        '|',
        {
          label: 'Field',
          icon: false as false,
          withText: true,
          items: [
            'textfield',
            'numberfield',
            'textareafield',
            'datefield',
            'timehhmmfield',
            'timehhmmssfield',
            'selectfield',
            'checkboxfield',
          ],
        },
        '|',
        'undo',
        'redo',
        'bold',
        'italic',
        'alignment',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'insertTable',
        'imageUpload',
        'subscript',
        'superscript',
        '|',
        'selectAll',
        'fontColor',
        'fontBackgroundColor',
        'blockQuote',
        'removeFormat',
        '|',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties',
        'insertelementrange'
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: /.*/,
          classes: /.*/,
          styles: /.*/,
        },
      ],
    },
    allowedContent: true,
  };
}
export default Editor;
