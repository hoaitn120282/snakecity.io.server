const { isEmpty } = require('lodash');
const Model = require('./turn.model');

/**
 * Load Model and append to req.
 */
function load(req, res, next, walletID) {
  return Model.getBywalletID(walletID)
    .then((model) => {
      if (isEmpty(model)) {
        const obj = new Model();
        obj.walletID = walletID;
        obj.turnNumber = 0;
        obj.turnLimit = 5;
        obj.save();
        req.model = obj;
      } else {
        return next();
      }
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

/**
 * Get Model
 * @returns {Model}
 */
function get(req, res, next) {
  // res.send({ err: 'here we are' });
  const walletID = req.params.walletID;
  return Model.getBywalletID(walletID)
    .then((model) => {
      if (isEmpty(model)) {
        const obj = new Model();
        obj.walletID = walletID;
        obj.turnNumber = 0;
        obj.turnLimit = 5;
        obj.save();
        res.json(obj);
      }
      res.json(model);
    })
    .catch((e) => next(e));
}

/**
 * Get Model profile of logged in Model
 * @returns {Promise<Model>}
 */
function getObject(req, res, next) {
  return Model.get(res.locals.session.id)
    .then((model) => res.json(model.safeModel()))
    .catch((e) => next(e));
}
/**
 * Create reward
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function create(req, res, next) {
  const model = new Model(req.body);
  return model.save()
    .then((savedmodel) => res.json(savedmodel.safeModel()))
    .catch((e) => next(e));
}

/**
 * Update existing Model
 * @property {string} req.body.walletID .
 * @property {integer} req.body.turnNumber .
 * @property {integer} req.body.turnLimit .
 * @returns {Model}
 */
// createdAt: {
//   $between: [ new Date(), new Date(new Date() - 24 * 60 * 60 * 1000) ]
// },
// walletID: walletID,
function update(req, res, next) {
  const walletID = req.body.walletID;
  //Set datetime
  Model.findAll({
    where: {
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
        $lte: new Date(),
      },
      walletID: walletID,
    },
  }).then((turn) => {
    if (!isEmpty(turn)) {
      const model = turn[ 0 ];
      model.turnNumber = req.body.turnNumber;
      model.save();
      res.json(model.safeModel());
    } else {
      res.json({ err: 'record is not exist!' });
    }
  }).catch((e) => next(e));
}

/**
 * Get Model list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Model[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Model.list({ limit, skip })
    .then((Models) => res.json(Models))
    .catch((e) => next(e));
}

/**
 * Delete Model.
 * @returns {Model}
 */
function destroy(req, res, next) {
  const { Model } = req;
  Model.destroy()
    .then((deletedModel) => res.json(deletedModel.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  getObject,
  update,
  list,
  destroy,
  create,
};
