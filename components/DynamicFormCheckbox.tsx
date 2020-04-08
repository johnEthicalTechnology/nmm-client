import React from 'react'
import { Field, FormikErrors, FormikTouched } from 'formik'
import { Heading } from 'grommet'
import styled from 'styled-components'

const LabelStyled = styled(Heading)`
  font-family: 'NoMeatMayTitle';
  text-align: center;
`

import { DynamicFormInputObject, DynamicFormCheckboxInputObject } from './types'

export default function DynamicFormCheckbox({
  errors,
  inputItem,
  touched
}: {
  errors: FormikErrors<DynamicFormInputObject>
  inputItem: DynamicFormInputObject
  touched: FormikTouched<DynamicFormInputObject>
}) {
  return (
    <Field name={inputItem.name}>
      {() => (
        <>
          <LabelStyled>{inputItem.legend}</LabelStyled>
          <fieldset name={inputItem.name}>
            <legend>
              <i>{inputItem.hintText}</i>
            </legend>
            {inputItem.checkboxInput!.map(
              (checkboxItem: DynamicFormCheckboxInputObject) => (
                <React.Fragment key={checkboxItem.name}>
                  {errors[checkboxItem.name] && touched[checkboxItem.name] ? (
                    <div
                      className='errors'
                      id={checkboxItem.errorMessageId}
                      data-testid={checkboxItem.errorMessageId}
                    >
                      Error: {errors[checkboxItem.name]}
                    </div>
                  ) : null}
                  <label htmlFor={checkboxItem.name}>
                    <b>{checkboxItem.displayName}</b>:
                    <Field
                      aria-errormessage={checkboxItem.errorMessageId}
                      aria-invalid={!!errors[checkboxItem.name]}
                      aria-required={checkboxItem.required}
                      autoComplete={checkboxItem.autocomplete}
                      data-testid={checkboxItem.name}
                      id={checkboxItem.name}
                      type={checkboxItem.type}
                      name={checkboxItem.name}
                    />
                  </label>
                </React.Fragment>
              )
            )}
          </fieldset>
        </>
      )}
    </Field>
  )
}
