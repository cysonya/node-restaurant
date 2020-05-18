const mongoose = require("mongoose")
const Store = mongoose.model("Store")
const multer = require("multer")
const jimp = require("jimp")
const uuid = require("uuid")

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/")
    if (isPhoto) {
      next(null, true)
    } else {
      next({ message: "That filetype isn't allowed!" }, false)
    }
  },
}

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

exports.upload = multer(multerOptions).single("photo")

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next() // skip to the next middleware
    return
  }
  const extension = req.file.mimetype.split("/")[1]
  req.body.photo = `${uuid.v4()}.${extension}`
  // resize and save photo to filesystem
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  // once we have written the photo to our filesystem, keep going!
  next()
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
  // set location data to be a point
  req.body.location.type = "Point"
  // find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // returns the new store instead of the old
    runValidators: true,
  }).exec()
  req.flash("success", `Successfully updated <strong>${store.name}</strong>.`)
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug })
  if (!store) {
    return next()
  }
  res.render("store", { title: store.name, store })
}
