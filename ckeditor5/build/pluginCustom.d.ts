import { Plugin } from '@ckeditor/ckeditor5-core';
export declare class TextField extends Plugin {
    init(): void;
}
export declare class NumberField extends Plugin {
    init(): void;
}
export declare class TextAreaField extends Plugin {
    init(): void;
}
export declare class DateField extends Plugin {
    init(): void;
}
export declare class TimeHHMMField extends Plugin {
    init(): void;
}
export declare class TimeHHMMSSField extends Plugin {
    init(): void;
}
export declare class InsertElementRange extends Plugin {
    init(): void;
}
export declare class SelectField extends Plugin {
    init(): void;
}
export declare class CheckboxField extends Plugin {
    init(): void;
}
export declare enum TypeInput {
    TEXT = "Text",
    NUMBER = "number",
    TEXTAREA = "Textarea",
    DATE = "date",
    DATEPICKER = "dateTime",
    TIME_HH_MM = "time_hm",
    TIME_HH_MM_SS = "time_hms",
    SELECT = "select",
    CHECKBOX = "checkbox"
}
