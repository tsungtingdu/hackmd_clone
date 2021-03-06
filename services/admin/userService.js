const db = require('../../models')
const { Collaborator, User, Post } = db

const userService = {
  getUsers: async (req, res, callback) => {
    try {
      let users = await User.findAll()
      return callback({
        status: 200,
        message: 'success',
        data: users
      })
    } catch (err) {
      return callback({
        status: 400,
        message: err,
        data: null
      })
    }
  },
  getUser: async (req, res, callback) => {
    try {
      let user = await User.findOne({
        where: { id: req.params.userId }
      })
      return callback({
        status: 200,
        message: 'success',
        data: user
      })
    } catch (err) {
      return callback({
        status: 400,
        message: err,
        data: null
      })
    }
  },
  putUser: async (req, res, callback) => {
    try {
      const { name, role } = req.body
      let user = await User.findOne({
        where: { id: req.params.userId }
      })

      // admin can only update his/her own name but not role
      if (user.id === req.user.id) {
        user = await user.update({ name: name })
        return callback({
          status: 400,
          message: 'Update a user successfully',
          data: null
        })
      }

      // admin can update other user's name and role
      user = await user.update({ name: name, role: role })
      return callback({
        status: 200,
        message: 'Update a user successfully',
        data: user
      })
    } catch (err) {
      return callback({
        status: 400,
        message: err,
        data: null
      })
    }
  },
  deleteUser: async (req, res, callback) => {
    try {
      let user = await User.findOne({
        where: { id: req.params.userId }
      })

      if (!user) {
        return callback({
          status: 400,
          message: "User not found.",
          data: null
        })
      }

      if (user.id === req.user.id) {
        return callback({
          status: 400,
          message: "You can not delete yourself.",
          data: null
        })
      }

      await user.destroy()
      await Collaborator.destroy({
        where: { UserId: req.params.userId }
      })

      return callback({
        status: 200,
        message: 'Delete a user successfully.',
        data: null
      })
    } catch (err) {
      return callback({
        status: 400,
        message: err,
        data: null
      })
    }
  }
}

module.exports = userService