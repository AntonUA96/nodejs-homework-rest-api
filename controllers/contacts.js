const Contacts = require("../model/contacts");
const { HttpCode } = require("../helpers/constants");
const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, offset } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res
      .status(HttpCode.OK)
      .json({
        status: "succes",
        code: HttpCode.OK,
        data: { total, limit, offset, contacts },
      });
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    // console.log(contact)
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "succes", code: HttpCode.OK, data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
  } catch (error) {
    next(error);
  }
};
const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res
      .status(HttpCode.CREATED)
      .json({ status: "succes", code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = HttpCode.BAD_REQUEST;
    }
    next(error);
  }
};
const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({
          status: "succes",
          code: HttpCode.OK,
          message: "contact deleted",
        });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
  } catch (error) {
    next(error);
  }
};
const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "succes", code: HttpCode.OK, data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "succes", code: HttpCode.OK, data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Missing field favorite",
      });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
