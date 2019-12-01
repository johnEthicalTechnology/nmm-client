import React from 'react'
import { Formik, Field } from 'formik'
import ImageUpload from './FileUpload'
import Modal from '../components/Modal'

import {
  DynamicFormProps,
  DynamicFormInputObject,
  DynamicFormSelectObject,
  SelectOption
} from './types'

// TODO - STYLING
// TODO - placeholder for inputs explaining pw conditions
export default function DynamicForm(props: DynamicFormProps) {
  const {
    failMessage,
    formInput,
    onSubmit,
    successMessage,
    submitType,
    validationSchema,
    inputHints = false,
    formSelect = [],
    formInitialValues = []
  } = props

  return (
    <>
      <Formik
        initialValues={
          formInitialValues.length
            ? formInitialValues.reduce((acc: object, name: string) => {
                return Object.assign(acc, {
                  [name]: ''
                })
              }, {})
            : formInput.reduce((acc: object, cur: DynamicFormInputObject) => {
                return Object.assign(acc, {
                  [cur.name]: ''
                })
              }, {})
        }
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, handleReset, handleSubmit, status, setStatus }) => (
          <>
            <Modal
              failMessage={failMessage}
              successMessage={successMessage}
              status={status}
              setStatus={setStatus}
            />
            <form onReset={handleReset} onSubmit={handleSubmit} method="POST">
              {formInput.map((inputItem: DynamicFormInputObject) => (
                <React.Fragment key={inputItem.name}>
                  <label htmlFor={inputItem.name}>
                    {inputItem.displayName}:{' '}
                  </label>
                  <Field
                    aria-errormessage={inputItem.errorMessageId}
                    aria-invalid={!!errors[inputItem.name]}
                    aria-required={inputItem.required}
                    autoComplete={inputItem.autocomplete}
                    component={
                      inputItem.textArea
                        ? 'textarea'
                        : inputItem.name == 'lowResolution'
                        ? ImageUpload
                        : 'input'
                    }
                    data-testid={inputItem.name}
                    id={inputItem.name}
                    name={inputItem.name}
                    type={inputItem.type}
                  />
                  {errors[inputItem.name] && touched[inputItem.name] ? (
                    <div
                      id={inputItem.errorMessageId}
                      data-testid={inputItem.errorMessageId}
                    >
                      {errors[inputItem.name]}
                    </div>
                  ) : null}
                  {inputHints ? (
                    <span>
                      <p>{inputItem.hintText}</p>
                    </span>
                  ) : null}
                  <br />
                </React.Fragment>
              ))}
              {formSelect.length
                ? formSelect.map((selectItem: DynamicFormSelectObject) => (
                    <React.Fragment key={selectItem.name}>
                      <br />
                      <Field
                        component="select"
                        name={selectItem.name}
                        id={`${selectItem.name}-select`}
                        key={selectItem.name}
                      >
                        {selectItem.options.map(
                          (selectOption: SelectOption) => (
                            <option
                              value={selectOption.value}
                              key={selectOption.value}
                            >
                              {selectOption.displayName}
                            </option>
                          )
                        )}
                      </Field>
                      {errors[selectItem.name] && touched[selectItem.name] ? (
                        <div
                          id={selectItem.errorMessageId}
                          data-testid={selectItem.errorMessageId}
                        >
                          {errors[selectItem.name]}
                        </div>
                      ) : null}
                      <br />
                    </React.Fragment>
                  ))
                : null}
              <br />
              <button data-testid="submit" type="submit">
                {submitType}
              </button>
            </form>
          </>
        )}
      </Formik>
    </>
  )
}
