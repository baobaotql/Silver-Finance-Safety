/** 选择图片：拍照或相册 */
export function chooseImage(sourceType) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [sourceType],
      success: (res) => {
        const path = res.tempFilePaths[0]
        if (!path) {
          reject(new Error('未选择图片'))
          return
        }
        resolve(path)
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) {
          reject(new Error('cancel'))
        } else {
          reject(err)
        }
      },
    })
  })
}
