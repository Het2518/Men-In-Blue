// models/certifier.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/sequelize');

const Certifier = sequelize.define('Certifier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'wallet_address',
    validate: {
      is: /^0x[a-fA-F0-9]{40}$/i,
    },
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'organization_name',
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'contact_email',
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'certifier',
  },
  accreditationId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'accreditation_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
});

module.exports = Certifier;
