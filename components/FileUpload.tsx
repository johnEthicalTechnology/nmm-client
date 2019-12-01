import React, { ChangeEvent } from 'react'

import logger from '../utils/logger'
import { FileUploadProps } from './types'

export default (props: FileUploadProps) => {
  const { field, form } = props

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    logger.log({
      level: 'INFO',
      description: 'Starting file upload...'
    })
    if (!event.target.files) return
    const file = event.target.files[0]

    let data = new FormData()
    data.append('file', file)
    // N.B. - Cloudinary settings for image transformation
    data.append('upload_preset', 'nmm-recipes')

    const res = await fetch(
      process.env.CLOUDINARY_API || '',
      {
        method: 'POST',
        body: data,
      }
    )
    logger.log({
      level: 'INFO',
      description: `Transformation status: ${res.statusText} ${res.status}`
    })

    const files = await res.json()
    if(files.error) {
      logger.log({
        level: 'ERROR',
        description: files.error.message
      })
      return
    }

    form.setFieldValue(field.name, files.secure_url)
    form.setFieldValue('standardResolution', files.eager[0].secure_url)
    logger.log({
      level: 'INFO',
      description: 'Finished file upload!'
    })
  }

  return (
    <>
      <input
        aria-errormessage={props['aria-errormessage']}
        aria-invalid={props['aria-invalid']}
        aria-required={props['aria-required']}
        autoComplete={props.autoComplete}
        data-testid={props["data-testid"]}
        id={props.id}
        type={props.type}
        onChange={event => handleChange(event)}
      />
    </>
  )
}
