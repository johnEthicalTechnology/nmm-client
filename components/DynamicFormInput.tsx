import React from 'react'
import { Field, FormikErrors, FormikTouched } from 'formik'
import ImageUpload from './FileUpload'
import { TextInput, Paragraph, Heading } from 'grommet'
import styled from 'styled-components'

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
            {inputItem.name === 'id' ? null : (
              <>
                <Heading
                  a11yTitle='input label'
                  level='3'
                  margin='xsmall'
                  size='xlarge'
                  className='impactFont'
                >
                  {inputItem.displayName}
                </Heading>
                <Paragraph
                  a11yTitle='input hint text'
                  fill={true}
                  size='small'
                  textAlign='center'
                >
                  {inputItem.hintText}
                </Paragraph>
              </>
            )}
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
          {errors[inputItem.name] && touched[inputItem.name] ? (
            <div
              className='errors'
              id={inputItem.errorMessageId}
              data-testid={inputItem.errorMessageId}
            >
              <br />
              Error: {errors[inputItem.name]}
            </div>
          ) : null}
        </>
      )}
    </Field>
  )
}
