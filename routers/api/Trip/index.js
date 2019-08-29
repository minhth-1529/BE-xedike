const express = require('express');
const router = express.Router();
const { author, authen } = require('../../../middlewares/author');
const tripController = require('./controller');

router.post('/', authen, author(['driver']), tripController.createTrips);
router.get('/', tripController.getTrip);
router.post('/search?:queryString', tripController.searchTrips);
// router.get('/:id', tripController.getDetailTrip);
// router.post('/:id', tripController.deleteTrip);
// router.put('/booking-trip/:id', authen, tripController.bookTrip);
// router.put('/finish-trip/:id', authen, tripController.finishTrip);

module.exports = router;
