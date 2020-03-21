import { FaceExpressions } from 'face-api.js'

export default function detectExpression(expressions: FaceExpressions) {
  const thresholdForAcceptingAccurateExpression = 0.9
  for (let [expression, value] of Object.entries(expressions)) {
    if (value >= thresholdForAcceptingAccurateExpression) {
      if (expression != 'happy') {
        return `Why so ${expression}? Can you give us a smile?`
      }
      if (expression == 'happy') {
        return 'Now that is a nice smile!!'
      }
    }
  }
}
