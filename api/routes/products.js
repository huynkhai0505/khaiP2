const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /products"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling POST request to /products"
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if ( id === 'special' ) {
        res.status(200).json({
            message: "You discovered the special ID",
            id: id
        });
    } else {
        res.status(200).json({
            message: "You passed new ID"
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "Updated products"
    });
});

router.deleted('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "Deleted products"
    });
}); 


module.exports = router;

