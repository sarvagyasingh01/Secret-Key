const asyncHandler = require("express-async-handler");
const Document = require("../models/docModel");
const CryptoJS = require("crypto-js");

// Save Document
const saveDoc = asyncHandler(async (req, res) => {
  const { site, username, password } = req.body;

  if (!site || !password) {
    res.status(400);
    throw new Error("Please fill the necessary fields");
  }

  //Encrypt password
  const ePass = CryptoJS.AES.encrypt(
    password,
    process.env.SECRET_KEY
  ).toString();

  //Encrypt site
  const eSite = CryptoJS.AES.encrypt(site, process.env.SECRET_KEY).toString();

  //Encrypt username
  const eUsername = CryptoJS.AES.encrypt(
    username,
    process.env.SECRET_KEY
  ).toString();

  //Save Document
  const document = await Document.create({
    user: req.user.id,
    site: eSite,
    username: eUsername,
    password: ePass,
  });

  res.status(201).json(document);
});

//Delete Document
const deleteDoc = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    res.status(400);
    throw new Error("Document not found");
  }

  //Match document to it's user
  if (document.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  //Delete Document
  await Document.findByIdAndDelete(req.params.id);
  res.status(200).json(document);
});

//Get all documents
const getDocs = asyncHandler(async (req, res) => {
  const user = req.user.id;
  const documents = await Document.find({ user });

  documents.forEach((doc) => {
    //Decrypt password
    const ePass = CryptoJS.AES.decrypt(doc.password, process.env.SECRET_KEY);
    const dPass = ePass.toString(CryptoJS.enc.Utf8);
    doc.password = dPass;

    //Decrypt site
    const eSite = CryptoJS.AES.decrypt(doc.site, process.env.SECRET_KEY);
    const dSite = eSite.toString(CryptoJS.enc.Utf8);
    doc.site = dSite;

    //Decrypt site
    const eUsername = CryptoJS.AES.decrypt(
      doc.username,
      process.env.SECRET_KEY
    );
    const dUsername = eUsername.toString(CryptoJS.enc.Utf8);
    doc.username = dUsername;
  });
  res.status(200).json(documents);
});

//Update a document
const updateDoc = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    res.status(400);
    throw new Error("Entry not found");
  }

  //Match document to it's user
  if (document.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const { site, username, password } = req.body;

  //Encrypt password
  const ePass = CryptoJS.AES.encrypt(
    password,
    process.env.SECRET_KEY
  ).toString();

  //Encrypt site
  const eSite = CryptoJS.AES.encrypt(
    site,
    process.env.SECRET_KEY
  ).toString();

  //Encrypt username
  const eUsername = CryptoJS.AES.encrypt(
    username,
    process.env.SECRET_KEY
  ).toString();


  // Update document
  const updatedDocument = await Document.findByIdAndUpdate(
    req.params.id,
    { site: eSite, username: eUsername, password: ePass },
    { new: true, runValidators: true }
  );
  res.status(200).json(updatedDocument);
});

//Get a single document
const getDoc = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    res.status(400);
    throw new Error("Entry not found");
  }

  //Decrypt password
  const ePass = CryptoJS.AES.decrypt(document.password, process.env.SECRET_KEY);
  const dPass = ePass.toString(CryptoJS.enc.Utf8);
  document.password = dPass;

  //Decrypt site
  const eSite = CryptoJS.AES.decrypt(document.site, process.env.SECRET_KEY);
  const dSite = eSite.toString(CryptoJS.enc.Utf8);
  document.site = dSite;

  //Decrypt username
  const eUsername = CryptoJS.AES.decrypt(
    document.username,
    process.env.SECRET_KEY
  );
  const dUsername = eUsername.toString(CryptoJS.enc.Utf8);
  document.username = dUsername;

  res.status(200).json(document);
});

const deleteAll = asyncHandler(async (req, res) => {
  const user = req.user.id;
  try {
    await Document.deleteMany({ user });
    res.status(200).json({ message: "Deleted all documents" });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  saveDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  getDoc,
  deleteAll,
};
