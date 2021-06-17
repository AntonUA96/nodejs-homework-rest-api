const express = require('express')
const router = express.Router()
const ctrl = require('../../../controllers/contacts')
const guard = require('../../../helpers/guard')
const {
    validateCreateContact,
    validateUpdateContact,
    validateUpdateStatusContact,
    validateObjectId} = require('./validation')

router.get('/', guard, ctrl.listContacts)

router.get('/:contactId',guard, validateObjectId, ctrl.getById)

router.post('/',guard, validateCreateContact, ctrl.addContact)

router.delete('/:contactId',guard, validateObjectId, ctrl.removeContact)

router.put('/:contactId',guard,validateObjectId, validateUpdateContact, ctrl.updateContact)

router.patch('/:contactId/favorite',guard, validateObjectId, validateUpdateStatusContact, ctrl.updateStatusContact)


module.exports = router

