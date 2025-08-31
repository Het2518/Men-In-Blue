// models/buyer.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/sequelize');

const Buyer = sequelize.define('Buyer', {
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
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'company_name',
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
    defaultValue: 'buyer',
  },
  industrySector: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'industry_sector',
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

module.exports = Buyer;
