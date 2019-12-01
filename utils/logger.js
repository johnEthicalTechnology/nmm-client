import uuid from 'uuid'
import { Logger, createLogStream } from 'aws-cloudwatch-log-browser'

const randomIdentifier = uuid()

if (!process.env.IS_DEVELOPMENT) {
  const logStreamConfig = {
    uri: `${process.env.LOGGER_URI}/prod/create-streams`,
    logGroupName: 'nmm-client-group'
  }

  createLogStream(randomIdentifier, logStreamConfig)
}

const config = {
  logGroupName: 'nmm-client-group',
  logStreamName: randomIdentifier,
  uri: `${process.env.LOGGER_URI}/prod/put-logs`,
  uploadFreq: 5000, // make sure use this to activate batch uploading
  local: process.env.IS_DEVELOPMENT
}

const logger = new Logger(config)

export default logger
