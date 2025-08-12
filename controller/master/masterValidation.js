

const validateCategoryId = (req, res, next) => {
    const categoryId = req.params.categoryId || req.body.categoryId || req.query.categoryId;
    
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Category ID is required',
            error: {
                field: 'categoryId',
                message: 'Category ID must be provided'
            }
        });
    }

    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Invalid Category ID format',
            error: {
                field: 'categoryId',
                message: 'Category ID must be a valid MongoDB ObjectId'
            }
        });
    }

    next();
};


const validationResponses = {
    CATEGORY_ID_REQUIRED: {
        success: false,
        statusCode: 400,
        message: 'Category ID is required',
        error: {
            code: 'CATEGORY_ID_MISSING',
            description: 'Category ID parameter is mandatory for this operation'
        }
    },
    
    INVALID_CATEGORY_ID: {
        success: false,
        statusCode: 400,
        message: 'Invalid Category ID format',
        error: {
            code: 'INVALID_CATEGORY_ID',
            description: 'Category ID must be a valid 24-character hexadecimal string'
        }
    },
    
    CATEGORY_NOT_FOUND: {
        success: false,
        statusCode: 404,
        message: 'Category not found',
        error: {
            code: 'CATEGORY_NOT_FOUND',
            description: 'The specified category does not exist'
        }
    }
};

module.exports = {
    validateCategoryId,
    validationResponses
};
