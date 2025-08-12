const { console } = require('inspector');
const ImageKit = require('../config/imagekit');
const path = require('path');

class   ImageUpload {
   
    static async uploadToImageKit(fileBuffer, fileName, folder = 'uploads') {
        console.log(fileBuffer,'================================')

        try {
            if (!fileBuffer || !fileName) {
                throw new Error('Missing file buffer or filename');
            }

            const extension = path.extname(fileName);
            const baseName = path.basename(fileName, extension);
            const uniqueName = `${folder}/${baseName}_${Date.now()}${extension}`;
            
            const response = await ImageKit.upload({
                file: fileBuffer,
                fileName: uniqueName,
                folder: folder
            });
            
            return response.url;
        } catch (error) {
            console.error('ImageKit upload error:', error);
            throw new Error('Failed to upload image to ImageKit');
        }
    }

    /**
     * Delete image from ImageKit
     * @param {string} imageUrl - ImageKit URL to delete
     * @returns {Promise<boolean>} - Success status
     */
    static async deleteFromImageKit(imageUrl) {
        try {
            if (!imageUrl) return false;
            
            // Extract fileId from URL
            const urlParts = imageUrl.split('/');
            const fileId = urlParts[urlParts.length - 1].split('?')[0];
            
            await ImageKit.deleteFile(fileId);
            return true;
        } catch (error) {
            console.error('ImageKit delete error:', error);
            return false;
        }
    }

    /**
     * Upload multiple images to ImageKit
     * @param {Array} files - Array of file objects
     * @param {string} folder - ImageKit folder path
     * @returns {Promise<Array<string>>} - Array of ImageKit URLs
     */
    static async uploadMultipleToImageKit(files, folder = 'uploads') {
        const uploadPromises = files.map(file => 
            this.uploadToImageKit(file.buffer, file.originalname, folder)
        );
        
        return Promise.all(uploadPromises);
    }
}

module.exports = ImageUpload;
