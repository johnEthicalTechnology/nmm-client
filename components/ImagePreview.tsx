import React from 'react'
import { Box } from 'grommet'

export default function ImagePreview({ dataUri }: { dataUri: string }) {
  return (
    <Box
      a11yTitle='photo preview container'
      align='center'
      border={{
        size: 'small',
        side: 'all',
        color: '#E8161A'
      }}
      margin='medium'
      justify='center'
    >
      <img src={dataUri} alt='imageURL' />
    </Box>
  )
}
