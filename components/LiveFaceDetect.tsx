import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  RefObject
} from 'react'
import Webcam from 'react-webcam'
import { loadModels, detectFacesAndExpression } from '../utils/faceRecog'
import ImagePreview from './ImagePreview'
import logger from '../utils/logger'
import { isServer } from '../utils/misc'
import FbInitAndToken from '../containers/FbInitParent'
import FbGroupShare from '../components/FbGroupShare'

import { FaceRecogProperties } from './types'
import {
  HandleCreateUpdateChallengeApi,
  CreateUpdateMutationValues
} from '../containers/types'

const WIDTH = 420
const HEIGHT = 420
const INPUT_SIZE = 160
const FACE_RECOG_INITIAL_STATE: Array<FaceRecogProperties> = []

// TODO fix up the styling for the camera and if I want the box or some kind of notice that is nicer than a box
export default function LiveFaceDetect({
  handleCreateUpdateChallengeApi,
  values
}: {
  handleCreateUpdateChallengeApi: HandleCreateUpdateChallengeApi
  values: CreateUpdateMutationValues
}) {
  const [faceRecogAttributes, setFaceRecogAttributes] = useState(
    FACE_RECOG_INITIAL_STATE
  )
  const [cameraFacingMode, setCameraFacingMode] = useState('')
  const [dataUri, setDataUri] = useState('')
  let webcamRef: RefObject<any> = useRef(null)

  useEffect(() => {
    /**
     * @remark used to prevent fetching when SSR which causes error
     */
    if (!isServer()) {
      loadModels()
    }
    logger.log({
      level: 'INFO',
      description: 'Starting setInputDevice()'
    })
    setInputDevice()
    const intervalId = setInterval(() => {
      detectFaceAndExpression()
    }, 100)
    return () => clearInterval(intervalId)
  }, [])

  async function setInputDevice() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const inputDevice = await devices.filter(
        (device: MediaDeviceInfo) => device.kind == 'videoinput'
      )
      // TODO - find a way to change camera from front to back
      if (inputDevice.length < 2) {
        setCameraFacingMode('user')
      } else {
        setCameraFacingMode('environment')
      }
      logger.log({
        level: 'INFO',
        description: 'Starting capture.'
      })
    } catch (error) {
      logger.log({
        level: 'ERROR',
        description: `Error in setInputDevice: ${error}`
      })
    }
  }

  async function detectFaceAndExpression() {
    if (webcamRef.current) {
      try {
        const result = await detectFacesAndExpression(
          webcamRef.current.getScreenshot(),
          INPUT_SIZE
        )

        if (result.length) {
          setFaceRecogAttributes(result)
        }
      } catch (error) {
        logger.log({
          level: 'ERROR',
          description: `Error in detectFaceAndExpression: ${error}`
        })
      }
    }
  }

  const captureImage = useCallback(() => {
    logger.log({
      level: 'INFO',
      description: 'Running getScreenShot()'
    })
    const imageSrc = webcamRef.current.getScreenshot()
    setDataUri(imageSrc)
    logger.log({
      level: 'INFO',
      description: 'Running dataUriToBlod()'
    })
  }, [webcamRef])

  let videoConstraints
  let camera
  if (cameraFacingMode) {
    videoConstraints = {
      width: WIDTH,
      height: HEIGHT,
      facingMode:
        cameraFacingMode == 'user' ? 'user' : { exact: cameraFacingMode }
    }
    if (cameraFacingMode === 'user') {
      camera = 'Front'
    } else {
      camera = 'Back'
    }
  }

  let drawBox
  if (faceRecogAttributes.length) {
    drawBox = faceRecogAttributes.map((faceObj: FaceRecogProperties) => (
      <div>
        <div
          style={{
            position: 'absolute',
            border: 'solid',
            borderColor: 'blue',
            height: faceObj.detection.box.height,
            width: faceObj.detection.box.width,
            transform: `translate(${faceObj.detection.box.x}px,${faceObj.detection.box.y}px)`
          }}
        ></div>
      </div>
    ))
  }

  return (
    <>
      {dataUri ? (
        <>
          <ImagePreview
            dataUri={dataUri}
            faceRecogAttributes={faceRecogAttributes}
          />
          <FbInitAndToken>
            {() => (
              <FbGroupShare
                imageSrc={dataUri}
                handleCreateUpdateChallengeApi={handleCreateUpdateChallengeApi}
                values={values}
              />
            )}
          </FbInitAndToken>
        </>
      ) : (
        <div>
          <div
            className='Camera'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <p>Camera: {camera}</p>
            <div
              style={{
                width: WIDTH,
                height: HEIGHT
              }}
            >
              <div style={{ position: 'relative', width: WIDTH }}>
                {!!videoConstraints ? (
                  <div style={{ position: 'absolute' }}>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat='image/jpeg'
                      videoConstraints={videoConstraints}
                    />
                  </div>
                ) : null}
                {!!drawBox ? drawBox : null}
              </div>
            </div>
          </div>
          <button onClick={captureImage}>Capture photo</button>
        </div>
      )}
    </>
  )
}
