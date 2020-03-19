import React from 'react'
import { Field, FormikErrors, FormikTouched } from 'formik'
import ImageUpload from './FileUpload'
import { TextInput } from 'grommet'
import { DynamicFormInputObject } from './types'

export default function DynamicFormInput({
  inputItem,
  errors,
  touched
}: {
  inputItem: DynamicFormInputObject
  errors: FormikErrors<DynamicFormInputObject>
  touched: FormikTouched<DynamicFormInputObject>
}) {
  return (
    <Field name={inputItem.name}>
      {({ field }: { field: any }) => (
        <>
          <label htmlFor={inputItem.name}>
            <b>{inputItem.displayName}</b>: <br />
            <i>{inputItem.hintText}</i>
            <br />
            <Field
              aria-errormessage={inputItem.errorMessageId}
              aria-invalid={!!errors[inputItem.name]}
              aria-required={inputItem.required}
              autoComplete={inputItem.autocomplete}
              component={inputItem.type == 'file' ? ImageUpload : TextInput}
              data-testid={inputItem.name}
              disabled={inputItem.disabled}
              id={inputItem.name}
              type={inputItem.type}
              {...field}
            />
          </label>
          <br />
          {errors[inputItem.name] && touched[inputItem.name] ? (
            <div
              id={inputItem.errorMessageId}
              data-testid={inputItem.errorMessageId}
            >
              {errors[inputItem.name]}
            </div>
          ) : null}
        </>
      )}
    </Field>
  )
}
