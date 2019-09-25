const { Trip } = require('../../../models/Trip');
const url = require('url');
const _ = require('lodash');
const moment = require('moment');

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
        .populate('driverID')
        .then(trip => {
            res.status(200).json(trip);
        })
        .catch(err => {
            res.json(err);
        });
};

// * Get trips
module.exports.getTrip = (req, res, next) => {
    const { limit } = req.params;

    Trip.find()
        .populate('driverID')
        .limit(parseInt(limit))
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
        startTime: parseInt(moment(startTime).valueOf()),
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

module.exports.bookingTrip = (req, res, next) => {
    const passengerID = req.user.id;

    const { numberOfBookingSeats, locationFrom, locationTo, note } = req.body;

    const { id } = req.params;

    Trip.findById(id)
        .then(trip => {
            if (trip.availableSeats < numberOfBookingSeats)
                return Promise.reject({
                    status: 400,
                    message: 'Not enough slot'
                });

            const passenger = {
                passengerID,
                numberOfBookingSeats,
                locationFrom,
                locationTo,
                note
            };

            trip.passengers.push(passenger);
            trip.availableSeats = trip.availableSeats - numberOfBookingSeats;

            return trip.save();
        })
        .then(trip => {
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
        .populate('driverID')
        .then(trip => {
            trip.isFinished = true;
            return trip.save();
        })
        .then(trip => {
            res.status(200).json(trip);
        })
        .catch(err => res.json(err));
};

// * Search trip
module.exports.searchTrips = (req, res, next) => {
    let queryString = url.parse(
        req.url.substring(0, req.url.lastIndexOf('/')),
        true
    ).query;

    Trip.find()
        .and([
            { locationFrom: queryString.from },
            { locationTo: queryString.to },
            { availableSeats: { $gte: parseInt(queryString.slot) } },
            {
                startTime: {
                    $gte: parseInt(moment(queryString.startTime).valueOf())
                }
            }
        ])
        .populate('driverID', 'fullName')
        .then(trip => {
            if (_.isEmpty(trip))
                return Promise.reject({ status: 404, message: 'Not found!' });

            res.status(200).json(trip);
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json({ message: err.message });
        });
};
