const {format} = require('util');
const path = require('path');

const uploadImageToStorage = (file, bucket) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }

    let newFileName = `inova_journey_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      console.log('erro ', error)
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}

module.exports = uploadImageToStorage;