const Model = require('./turn.model');

/**
 * Load Model and append to req.
 */
function load(req, res, next, walletID) {
  return Model.getBywalletID(walletID)
    .then((Model) => {
      req.Model = Model; // eslint-disable-line no-param-reassign
      return res.json(req.Model);
    })
    .catch((e) => next(e));
}

/**
 * Get Model
 * @returns {Model}
 */
function get(req, res) {
  return res.json(req.Model.safeModel());
}

/**
 * Get Model profile of logged in Model
 * @returns {Promise<Model>}
 */
function getObject(req, res, next) {
  return Model.get(res.locals.session.id)
    .then((Model) => res.json(Model.safeModel()))
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
function update(req, res, next) {
  const { Model } = req;
  Model.walletID = req.body.walletID;
  Model.turnNumber = req.body.turnNumber;
  Model.turnLimit = req.body.turnLimit;

  return Model.save()
    .then((savedModel) => res.json(savedModel.safeModel()))
    .catch((e) => next(e));
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
  create
};
