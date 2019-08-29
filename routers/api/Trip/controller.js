const { Trip } = require('../../../models/Trip');
const url = require('url');
// * Delete Trip
module.exports.deleteTrip = (req, res, next) => {
    const { id } = req.params;
    Trip.deleteOne({ _id: id })
        .then(result => res.status(200).json(result))
        .catch(err => res.json(err));
};

// * Delete Trip By ID
module.exports.getDetailTrip = (req, res, next) => {
    const { id } = req.params;

    Trip.findById(id)
        // .populate('id', 'avatar') lay avatar
        .populate('driverID')
        .then(trip => {
            if (!trip)
                return Promise.reject({
                    status: 404,
                    message: 'khong co trip'
                });

            res.status(200).json(trip);
        })
        .catch(err => {
            res.json(err);
        });
};

// * Get trips
module.exports.getTrip = (req, res, next) => {
    Trip.find()
        .populate('driverID',"fullName")
        // .select('driverID')
        .then(trips => {
            res.status(200).json(trips);
        })
        .catch(err => res.json(err));
};

// * Create trip
module.exports.createTrips = (req, res, next) => {
    const {
        locationFrom,
        locationTo,
        startTime,
        availableSeats,
        fee
    } = req.body;

    const driverID = req.user.id;

    const newTrip = new Trip({
        locationFrom,
        locationTo,
        startTime,
        availableSeats,
        fee,
        driverID
    });

    newTrip
        .save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => res.json(err));
};

module.exports.bookTrip = (req, res, next) => {
    const passengerID = req.user.id;

    const { numberOfBookingSeats } = req.body;

    const { id } = req.params;

    Trip.findById(id)
        .then(trip => {
            if (trip.availableSeats < numberOfBookingSeats)
                return Promise.reject({ status: 400, message: 'k du ghe' });

            const passenger = {
                passengerID,
                numberOfBookingSeats
            };

            trip.passengers.push(passenger);
            trip.availableSeats = trip.availableSeats - numberOfBookingSeats;
            console.log(trip);
            return trip.save();
        })
        .then(trip => {
            console.log(trip);
            res.status(200).json(trip);
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json({ message: err.message });
        });
};

module.exports.finishTrip = (req, res, next) => {
    const { id } = req.params;

    Trip.findById(id)
        .then(trip => {
            trip.isFinished = true;
            return trip.save();
        })
        .then(trip => {
            res.status(200).json(trip);
        })
        .catch(err => res.json(err));
};

// * Search
module.exports.searchTrips = (req, res, next) =>{
    const { queryString } = req.params;
    
    const abc = url.parse(req.url,true).query
    console.log(abc);
}