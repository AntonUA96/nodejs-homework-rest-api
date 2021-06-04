const Contact = require("./schemas/contact");
const listContacts = async (userId, query) => {
  const { limit = 10, offset = 0, favorite = null } = query;
  const optioSearch = { owner: userId };
  if (favorite !== null) {
    optioSearch.favorite = favorite;
  }
  const results = await Contact.paginate(optioSearch, {
    limit,
    offset,
  });
  const { docs: contacts, totalDocs: total } = results;
  return { contacts, total, limit, offset };
};
const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email subscription -_id",
  });
  return result;
};
const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};
const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};
const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true }
  );
  return result;
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};