const jwt = require('jsonwebtoken');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const httpStatus = require('http-status');
const { User } = require('../models');
const APIError = require('../../helpers/APIError');
const config = require('../../config');

function login(req, res, next) {
	const publicAddress = req.body.publicAddress.toLowerCase();
	const signature = req.body.signature;
	if (!signature || !publicAddress)
		return res
			.status(400)
			.send({ error: 'Request should have signature and publicAddress' });

	return (
		User.findOne({ where: { publicAddress } })
			////////////////////////////////////////////////////
			// Step 1: Get the user with the given publicAddress
			////////////////////////////////////////////////////
			.then((user) => {
				if (!user) {
					res.status(401).send({
						error: `User with publicAddress ${publicAddress} is not found in database`,
					});

					return null;
				}
				return user;
			})
			////////////////////////////////////////////////////
			// Step 2: Verify digital signature
			////////////////////////////////////////////////////
			.then((user) => {
				if (!(user instanceof User)) {
					// Should not happen, we should have already sent the response
					const err = new APIError('User is not defined in "Verify digital signature".', httpStatus.UNAUTHORIZED, true);
					return next(err);
				}

				const msg = `I am signing my one-time nonce: ${user.nonce}`;

				// We now are in possession of msg, publicAddress and signature. We
				// will use a helper from eth-sig-util to extract the address from the signature
				const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
				const address = recoverPersonalSignature({
					data: msgBufferHex,
					sig: signature,
				});

				// The signature verification is successful if the address found with
				// sigUtil.recoverPersonalSignature matches the initial publicAddress
				if (address.toLowerCase() === publicAddress.toLowerCase()) {
					return user;
				} else {
					res.status(401).send({
						error: 'Signature verification failed',
					});

					return null;
				}
			})
			////////////////////////////////////////////////////
			// Step 3: Generate a new nonce for the user
			////////////////////////////////////////////////////
			.then((user) => {
				if (!(user instanceof User)) {
					// Should not happen, we should have already sent the response
					const err = new APIError('User is not defined in "Verify digital signature".', httpStatus.UNAUTHORIZED, true);
					return next(err);
				}

				user.nonce = Math.floor(Math.random() * 10000);
				return user.save();
			})
			////////////////////////////////////////////////////
			// Step 4: Create JWT
			////////////////////////////////////////////////////
			.then((user) => {
				return new Promise((resolve, reject) =>
					// https://github.com/auth0/node-jsonwebtoken
					jwt.sign(
						{
							payload: {
								id: user.id,
								publicAddress,
							},
						},
						config.secret,
						{
							algorithm: config.algorithms,
						},
						(err, token) => {
							if (err) {
								return reject(err);
							}
							if (!token) {
								return new Error('Empty token');
							}
							return resolve(token);
						}
					)
				);
			})
			.then((accessToken) => res.json({ accessToken }))
			.catch(next)
	);
}



/**
 * Register a new user
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
function register(req, res, next) {
	const user = new User(req.body);
	user.publicAddress = user.publicAddress.toLowerCase();
	// return res.json({ a: user });
	User.findOne({ where: { publicAddress: user.publicAddress } })
		.then((foundUser) => {
			if (foundUser) {
				return Promise.reject(new APIError('publicAddress must be unique', httpStatus.CONFLICT, true));
			}
			user.nonce = Math.floor(Math.random() * 10000);
			return user.save();
		})
		.then((savedUser) => {
			return res.json({
				user: savedUser.safeModel(),
			});
		})
		.catch((e) => next(e));
}

function check(req, res, next) {
	const publicAddress = req.query.publicAddress.toLowerCase();

	User.findOne({ where: { publicAddress: publicAddress } })
		.then((foundUser) => {
			if (foundUser) {
				return res.json({
					user: foundUser,
				});
			} else {
				return res.json({
					user: 'publicAddress is not define!',
				});
			}
		})
		.catch((e) => next(e));

}

module.exports = { login, register, check };
