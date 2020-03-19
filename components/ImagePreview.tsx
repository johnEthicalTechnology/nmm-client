import React from 'react'
import { FaceRecogProperties } from './types'

export default function ImagePreview({
  dataUri,
  faceRecogAttributes
}: {
  dataUri: string
  faceRecogAttributes: FaceRecogProperties[]
}) {
  let drawBox = null
  if (faceRecogAttributes.length) {
    drawBox = faceRecogAttributes.map((faceObj: FaceRecogProperties) => (
      <div
        key={faceObj.detection.box.height}
        style={{
          position: 'absolute',
          border: 'solid',
          borderColor: 'blue',
          height: faceObj.detection.box.height,
          width: faceObj.detection.box.width,
          transform: `translate(${faceObj.detection.box.x}px,${faceObj.detection.box.y}px)`
        }}
      ></div>
    ))
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute' }}>
          <img src={dataUri} alt='imageURL' />
          {!!drawBox
            ? faceRecogAttributes.map((faceObj: FaceRecogProperties) => (
                <div>
                  <p>Neutral:{faceObj.expressions.neutral}</p>
                  <p>Happy:{faceObj.expressions.happy}</p>
                  <p>Sad:{faceObj.expressions.sad}</p>
                  <p>Angry:{faceObj.expressions.angry}</p>
                  <p>Surprised:{faceObj.expressions.surprised}</p>
                </div>
              ))
            : null}
        </div>
        {!!drawBox ? drawBox : null}
      </div>
    </div>
  )
}
