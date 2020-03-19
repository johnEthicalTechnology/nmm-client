export async function dataUriToBlob(dataUri: string): Promise<Blob> {
  const byteString = atob(dataUri.split(',')[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const unSignedInts = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    unSignedInts[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([unSignedInts], {
    type: 'image/jpeg'
  })

  return blob
}
