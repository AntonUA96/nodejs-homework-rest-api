const db = require("./db");
const { v4: uuid } = require("uuid");
const listContacts = async () => {
  try {
    return db.get("contacts").value();
  } catch (err) {
    return console.log(err.message);
  }
};
const getContactById = async (contactId) => {
  try {
    return db
      .get("contacts")
      .find(({ id }) => id.toString() === contactId.toString())
      .value();
  } catch (err) {
    return console.log(err.message);
  }
};
const removeContact = async (contactId) => {
  try {
    const [record] = db
      .get("contacts")
      .remove(({ id }) => id.toString() === contactId.toString())
      .write();
    return record;
  } catch (err) {
    return console.log(err.message);
  }
};
const addContact = async (body) => {
  try {
    const id = uuid();
    const record = {
      id,
      ...body,
      ...(body.isVaccinated ? {} : { isVaccinated: false }),
    };
    db.get("contacts").push(record).write();
    return record;
  } catch (err) {
    return console.log(err.message);
  }
};
const updateContact = async (contactId, body) => {
  try {
    const record = db
      .get("contacts")
      .find(({ id }) => id.toString() === contactId.toString())
      .assign(body)
      .value();
    db.write();
    return record.id ? record : null;
  } catch (err) {
    return console.log(err.message);
  }
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
