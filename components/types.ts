import { ObjectSchema } from 'yup'
import { FormikActions, FieldProps } from 'formik'

// DYNAMIC FORM TYPES
export interface DynamicFormProps {
  inputHints?: boolean
  failMessage: string
  formInput: Array<DynamicFormInputObject>
  onSubmit: (arg0: OnSubmitObject, arg1: FormikActions<OnSubmitObject>) => void
  submitType: string
  successMessage: string
  validationSchema: ObjectSchema
  formSelect?: Array<DynamicFormSelectObject>
  formInitialValues?: Array<string>
}

export interface OnSubmitObject {
  [key: string]: string
}

export interface DynamicFormInputObject {
  type: string
  name: string
  errorMessageId: string
  required: boolean
  autocomplete: string
  displayName: string
  hintText?: string
  textArea?: boolean
}

export interface DynamicFormSelectObject {
  name: string
  errorMessageId: string
  options: Array<SelectOption>
}

export interface SelectOption {
  value: string
  displayName: string
}

export interface FileUploadProps extends FieldProps {
  'aria-errormessage': string
  'aria-invalid': boolean
  'aria-required': boolean
  autoComplete: string
  children: undefined | string
  'data-testid': string
  id: string
  type: string
}

// MODAL TYPES
export interface ModalProps {
  status: ModalStatus
  successMessage: string
  failMessage: string
  setStatus: (arg: ModalStatus) => void
}

export interface ModalStatus {
  success?: boolean
  openModal: boolean
}
