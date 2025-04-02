import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch
} from "react-hook-form";

export type BookAddFormModel = {
    title:  string;
    author: string;
};

export type BookAddFormState = {
    errors: FieldErrorsImpl<DeepRequired<BookAddFormModel>>;
};

export type BookAddFormActions = {
    register: UseFormRegister<BookAddFormModel>;
    watch: UseFormWatch<BookAddFormModel>;
    handleSubmit: UseFormHandleSubmit<BookAddFormModel>;
    submit: (body: BookAddFormModel) => void;
};
export type BookAddFormComputed = {
    defaultValues: BookAddFormModel,
    isSubmitting: boolean
};

export type BookAddFormController = FormController<BookAddFormState, BookAddFormActions, BookAddFormComputed>;