import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
declare var $: any;

export class TextField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('textfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Text',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        // Change the model using the model writer.
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.TEXT);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class NumberField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('numberfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Number',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.NUMBER);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class TextAreaField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('textareafield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Textarea',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.TEXTAREA);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class DateField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('datefield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Date',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.DATE);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class TimeHHMMField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('timehhmmfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Time hh:mm',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.TIME_HH_MM);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class TimeHHMMSSField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('timehhmmssfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Time hh:mm:ss',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.TIME_HH_MM_SS);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class InsertElementRange extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('insertelementrange', () => {
      const button = new ButtonView();
      button.set({
        label: 'Field',
        withText: true,
      });
      button.on('execute', () => {
        $('#openModalCreateRange').click();
      });
      return button;
    });
  }
}

export class SelectField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('selectfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Select',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.SELECT);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export class CheckboxField extends Plugin {
  init() {
    const editor = this.editor;
    (window as any).editor = editor;
    editor.ui.componentFactory.add('checkboxfield', () => {
      const button = new ButtonView();

      button.set({
        label: 'Checkbox',
        withText: true,
      });
      // Execute a callback function when the button is clicked.
      button.on('execute', () => {
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          $('#idInputType').val(TypeInput.CHECKBOX);
          $('#openModalCreate').click();
        });
      });

      return button;
    });
  }
}

export enum TypeInput {
  TEXT = 'Text',
  NUMBER = 'number',
  TEXTAREA = 'Textarea',
  DATE = 'date',
  DATEPICKER = 'dateTime',
  TIME_HH_MM = 'time_hm',
  TIME_HH_MM_SS = 'time_hms',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
}
