const mongoose = require("mongoose")
const Store = mongoose.model("Store")

exports.myMiddleware = (req, res, next) => {
  req.name = "Wes"
  next()
}
exports.homePage = (req, res) => {
  res.render("index", { title: "Homepage" })
}

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" })
}

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save()
  req.flash("success", `Successfully created ${store.name}.`)
  res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render("stores", { title: "Stores", stores })
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id })
  res.render("editStore", { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
  // find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // returns the new store instead of the old
    runValidators: true,
  }).exec()
  req.flash("success", `Successfully updated <strong>${store.name}</strong>.`)
  res.redirect(`/stores/${store._id}/edit`)
}
