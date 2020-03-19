import uuid from 'uuid'
import { Logger, createLogStream } from 'aws-cloudwatch-log-browser'

const randomIdentifier = uuid()

const config = {
  logGroupName: 'nmm-client-group',
  logStreamName: randomIdentifier,
  uri: `${process.env.LOGGER_URI}/prod/put-logs`,
  uploadFreq: 5000, // make sure use this to activate batch uploading
  local: process.env.IS_DEVELOPMENT
}

if (!process.env.IS_DEVELOPMENT) {
  const logStreamConfig = {
    uri: `${process.env.LOGGER_URI}/prod/create-streams`,
    logGroupName: 'nmm-client-group'
  }

  createLogStream(randomIdentifier, logStreamConfig)
    .then(res => console.log('this is res', res))
    .catch(err => console.log('Error', err))
}

const logger = new Logger(config)

export default logger

// "git+ssh://git@github.com/codeinaire/aws-cloudwatch-logger-browser.git#ac235159efb8e7e7dab2f03b0bd805aff4d664a9"
