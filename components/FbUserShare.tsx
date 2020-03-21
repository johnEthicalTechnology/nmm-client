import React from 'react'
import { Button } from 'grommet'
import logger from '../utils/logger'

import {
  HandleCreateUpdateChallengeApi,
  CreateUpdateMutationValues
} from '../containers/types'

// TODO - styling for the button
// TODO - logic for the challenge
export default function FbUserShare({
  href,
  quote,
  handleCreateUpdateChallengeApi,
  values
}: {
  href: string
  quote: string
  handleCreateUpdateChallengeApi: HandleCreateUpdateChallengeApi
  values: CreateUpdateMutationValues
}) {
  function handleShareItem() {
    FB.ui(
      {
        method: 'share',
        hashtag: '#NoMeatMay',
        href,
        quote
      },
      (res: fb.ShareDialogResponse) => {
        if (res == undefined) {
          logger.log({
            level: 'ERROR',
            description:
              'Undefined error occurred when attempting to post to user timeline!'
          })
          return
        }

        if (res.error_message) {
          logger.log({
            level: 'ERROR',
            description: `Couldn't post to user timeline b/c ${res.error_message}`
          })
        } else {
          handleCreateUpdateChallengeApi(values, ['SharedRecipe'])
          logger.log({
            level: 'INFO',
            description: 'Successfully posted to timeline'
          })
        }
      }
    )
  }

  return (
    <div>
      <Button
        a11yTitle='share'
        color='red'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        label='SHARE RECIPE TO TIMELINE'
        margin='medium'
        primary={true}
        type='button'
        onClick={handleShareItem}
      />
    </div>
  )
}
