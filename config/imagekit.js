const ImageKit = require('imagekit');

console.log(process.env.IMAGEKIT_PUBLIC_KEY)

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_rvyIo5tmKY/pPHvJ+P6uEG3DwdQ=",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_r70Wn7cnTLb3xtecs3e5iuOr4fI=",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/7op7bftj4"
});

module.exports = imagekit;
