const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/sequelize'); // Assuming you have a database connection config file

const Producer = sequelize.define('Producer', {
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
      is: /^0x[a-fA-F0-9]{40}$/i, // Validates for a standard Ethereum address format
    },
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  // The role is hard-coded as 'producer' during registration
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'producer',
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

module.exports = Producer;
