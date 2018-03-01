const carModel = require('../models/carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

  /**
   * carController.list()
   */
  list: (req, res) => {
    carModel.find(req.query.where, req.query.fields, req.query.sort, (err, cars) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting car.',
          error: err
        });
      }
      return res.json(cars);
    });
  },

  /**
   * carController.show()
   */
  show: (req, res) => {
    let id = req.params.id;
    carModel.findOne({_id: id}, (err, car) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting car.',
          error: err
        });
      }
      if (!car) {
        return res.status(404).json({
          message: 'No such car'
        });
      }
      return res.json(car);
    });
  },

  /**
   * carController.create()
   */
  create: (req, res) => {
    let car = new carModel({			carDoor : req.body.carDoor,			color : req.body.color
    });

    car.save((err, car) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating car',
          error: err
        });
      }
      return res.status(201).json(car);
    });
  },

  /**
   * carController.update()
   */
  update: (req, res) => {
    let id = req.params.id;
    carModel.findOne({_id: id}, (err, car) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting car',
          error: err
        });
      }
      if (!car) {
        return res.status(404).json({
          message: 'No such car'
        });
      }

      car.carDoor = req.body.carDoor ? req.body.carDoor : car.carDoor;			car.color = req.body.color ? req.body.color : car.color;			
      car.save( (err, car) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating car.',
            error: err
          });
        }

        return res.json(car);
      });
    });
  },

  /**
   * carController.remove()
   */
  remove: (req, res) => {
    let id = req.params.id;
    carModel.findByIdAndRemove(id, (err, car) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the car.',
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
